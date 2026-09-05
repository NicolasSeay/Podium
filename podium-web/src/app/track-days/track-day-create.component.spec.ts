import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { TrackDayCreateComponent } from './track-day-create.component';
import { TrackDaysFacade } from './track-days.facade';
import { Track, TrackDay, Vehicle } from './track-days.store';

const facadeMock = {
  tracks: signal<Track[]>([]),
  trackDays: signal<TrackDay[]>([]),
  vehicles: signal<Vehicle[]>([]),
  loading: signal(false),
  saving: signal(false),
  error: signal(null),
  completedTrackDayId: signal(null),
  load: vi.fn(),
  complete: vi.fn(),
};

describe('TrackDayCreateComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [TrackDayCreateComponent],
      providers: [
        provideRouter([{ path: 'track-days', component: TrackDayCreateComponent }]),
        { provide: TrackDaysFacade, useValue: facadeMock },
      ],
    }).compileComponents();
  });

  it('adds an empty editable session', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.step.set(2);
    component.days.set([{ date: '2026-09-03', sessions: [] }]);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.add-session-button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.draft-session')).toHaveLength(1);
    expect(
      (fixture.nativeElement.querySelector('[aria-label="Session name"]') as HTMLInputElement)
        .value,
    ).toBe('');
  });

  it('adds a new empty lap row when typing a lap time', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.step.set(2);
    component.days.set([
      { date: '2026-09-03', sessions: [{ name: 'Practice', notes: null, laps: [] }] },
    ]);
    component.days.update((days: any[]) =>
      days.map((day) => ({
        ...day,
        sessions: day.sessions.map((session: any) => ({
          ...session,
          laps: [{ timeMillis: 0, displayTime: '' }],
        })),
      })),
    );
    fixture.detectChanges();

    const firstLap = fixture.nativeElement.querySelector('.lap-time-input') as HTMLInputElement;
    expect(fixture.nativeElement.querySelector('[aria-label="Remove lap 1"]')).toBeNull();
    firstLap.value = '1:';
    firstLap.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const lapInputs = fixture.nativeElement.querySelectorAll('.lap-time-input');
    expect(lapInputs).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.draft-laps').textContent).toContain('Lap 1');
    expect(fixture.nativeElement.querySelector('.draft-laps').textContent).toContain('Lap 2');
    expect((lapInputs[1] as HTMLInputElement).value).toBe('');
    expect(fixture.nativeElement.querySelector('[aria-label="Remove lap 1"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Remove lap 2"]')).toBeNull();
  });

  it('submits named sessions and excludes empty slots', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.eventForm.patchValue({ trackId: 1, vehicleId: 1 });
    component.days.set([
      {
        date: '2026-09-03',
        sessions: [
          {
            name: '  Open practice  ',
            notes: '  First run  ',
            laps: [
              { timeMillis: 102350, displayTime: '1:42.350' },
              { timeMillis: 0, displayTime: '' },
            ],
          },
          { name: '   ', notes: 'Unused slot', laps: [] },
        ],
      },
    ]);

    component.complete();

    expect(facadeMock.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        sessions: [
          {
            name: 'Open practice',
            notes: 'First run',
            sessionDate: '2026-09-03',
            laps: [{ lapNumber: 1, timeMillis: 102350 }],
          },
        ],
      }),
    );
  });

  it('counts only timed laps in the review summary', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.step.set(3);
    component.days.set([
      {
        date: '2026-09-03',
        sessions: [
          {
            name: 'Practice',
            notes: null,
            laps: [
              { timeMillis: 1000, displayTime: '1' },
              { timeMillis: 2000, displayTime: '2' },
              { timeMillis: 3000, displayTime: '3' },
              { timeMillis: 0, displayTime: '' },
            ],
          },
        ],
      },
    ]);
    fixture.detectChanges();

    const summaryValues = Array.from(
      fixture.nativeElement.querySelectorAll('dt + dd'),
    ) as Element[];
    const sessionsValue = summaryValues.find(
      (value) => value.previousElementSibling?.textContent?.trim() === 'Sessions',
    ) as HTMLElement;
    expect(sessionsValue.textContent).toContain('3');
    expect(sessionsValue.textContent).toContain('laps');
  });

  it('requires a vehicle before continuing', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.eventForm.patchValue({ trackId: 1 });

    component.nextStep();

    expect(component.step()).toBe(1);
    expect(component.eventForm.controls.vehicleId.hasError('min')).toBe(true);
  });

  it('routes to Vehicles when adding a new vehicle', async () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    const vehicleSelect = fixture.nativeElement.querySelector(
      '#create-vehicle',
    ) as HTMLSelectElement;
    const addVehicleOption = vehicleSelect.querySelector('option:last-child') as HTMLOptionElement;
    expect(addVehicleOption.textContent?.trim()).toBe('Add a new vehicle...');

    vehicleSelect.value = addVehicleOption.value;
    vehicleSelect.dispatchEvent(new Event('change'));

    expect(navigate).toHaveBeenCalledWith(['/vehicles']);
    expect((fixture.componentInstance as any).eventForm.controls.vehicleId.value).toBe(0);
  });

  it('groups previously raced tracks under Recents', () => {
    facadeMock.tracks.set([
      { id: 1, name: 'North Circuit', city: 'Northport', country: 'US', lengthMiles: 2 },
      { id: 2, name: 'Summit Raceway', city: 'Summit', country: 'US', lengthMiles: 3 },
      { id: 3, name: 'Lakeside Park', city: 'Lakeside', country: 'US', lengthMiles: 4 },
    ]);
    facadeMock.trackDays.set([
      {
        id: 10,
        userId: 1,
        trackId: 2,
        vehicleId: 1,
        startDate: '2026-08-01',
        notes: null,
        conditions: null,
      },
    ]);

    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll(
      'optgroup',
    ) as NodeListOf<HTMLOptGroupElement>;
    expect(groups).toHaveLength(2);
    expect(groups[0].label).toBe('Recents');
    expect(groups[0].textContent).toContain('Summit Raceway');
    expect(groups[0].textContent).not.toContain('North Circuit');
    expect(groups[1].label).toBe('All tracks');
    expect(groups[1].textContent).toContain('North Circuit');
    expect(groups[1].textContent).toContain('Lakeside Park');
    expect(groups[1].textContent).not.toContain('Summit Raceway');
  });

  it('shows one date for a single-day track day', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.step.set(3);
    component.eventForm.patchValue({
      startDate: '2026-06-14',
      endDate: '2026-06-14',
    });
    fixture.detectChanges();

    const dates = fixture.nativeElement.querySelectorAll('dt + dd')[1] as HTMLElement;
    expect(dates.textContent.trim()).toBe('2026-06-14');
  });
});
