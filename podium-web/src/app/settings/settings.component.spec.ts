import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { AuthFacade } from '../store/auth.facade';
import { AuthService } from '../auth.service';
import { TrackDaysFacade } from '../track-days/store/track-days.facade';
import { DistanceUnit, TemperatureUnit } from '../preferences';

const user = {
  id: 1,
  email: 'driver@example.com',
  firstName: 'Nicolas',
  lastName: 'Seay',
  distanceUnit: DistanceUnit.Kilometers,
  temperatureUnit: TemperatureUnit.Celsius,
  defaultTrackId: 2,
  defaultVehicleId: 3,
};

const authFacadeMock = {
  user: signal<typeof user | null>(user),
  userLoaded: vi.fn(),
};

const trackDaysFacadeMock = {
  tracks: signal([{ id: 2, name: 'Road Atlanta' }]),
  vehicles: signal([{ id: 3, name: 'MX-5' }]),
  loadOptions: vi.fn(),
};

const authServiceMock = {
  updateUser: vi.fn(),
};

describe('SettingsComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    authFacadeMock.user.set(user);
    authServiceMock.updateUser.mockReturnValue(of(user));
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TrackDaysFacade, useValue: trackDaysFacadeMock },
      ],
    }).compileComponents();
  });

  it('loads options and patches the current user into the form', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    expect(trackDaysFacadeMock.loadOptions).toHaveBeenCalledOnce();
    expect((fixture.componentInstance as any).form.getRawValue()).toMatchObject({
      firstName: 'Nicolas',
      lastName: 'Seay',
      email: 'driver@example.com',
      distanceUnit: DistanceUnit.Kilometers,
      temperatureUnit: TemperatureUnit.Celsius,
      defaultTrackId: 2,
      defaultVehicleId: 3,
    });
  });

  it('marks an invalid form as touched without saving', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;
    component.form.controls.email.setValue('invalid');
    component.form.controls.email.markAsTouched();

    component.save();

    expect(authServiceMock.updateUser).not.toHaveBeenCalled();
    expect(component.hasError('email', 'email')).toBe(true);
    expect(component.hasError('missing', 'required')).toBe(false);
  });

  it('saves valid settings and updates the authenticated user', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;
    component.form.patchValue({ firstName: 'Nico', email: 'nico@example.com' });

    component.save();

    expect(authServiceMock.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Nico', email: 'nico@example.com' }),
    );
    expect(authFacadeMock.userLoaded).toHaveBeenCalledWith(user);
    expect(component.saved()).toBe(true);
    expect(component.saving()).toBe(false);
  });

  it('shows a specific message for an email conflict', () => {
    authServiceMock.updateUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 409 })),
    );
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.save();

    expect(component.error()).toBe('That email address is already in use.');
    expect(component.saving()).toBe(false);
  });

  it('shows a generic message for other save failures', () => {
    authServiceMock.updateUser.mockReturnValue(throwError(() => new Error('offline')));
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.save();

    expect(component.error()).toBe('Unable to save your settings.');
    expect(component.saved()).toBe(false);
  });
});
