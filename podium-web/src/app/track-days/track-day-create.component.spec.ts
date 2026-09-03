import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TrackDayCreateComponent } from './track-day-create.component';
import { TrackDaysApiService } from './track-days-api.service';

const apiMock = {
  tracks: vi.fn(() => of([])),
  vehicles: vi.fn(() => of([])),
  complete: vi.fn(() => of({})),
};

describe('TrackDayCreateComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [TrackDayCreateComponent],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'track-days', component: TrackDayCreateComponent }]),
        { provide: TrackDaysApiService, useValue: apiMock },
      ],
    }).compileComponents();
  });

  it('adds an empty editable session slot', () => {
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

  it('submits named sessions and excludes empty slots', () => {
    const fixture = TestBed.createComponent(TrackDayCreateComponent);
    const component = fixture.componentInstance as any;
    component.eventForm.patchValue({ trackId: 1 });
    component.days.set([
      {
        date: '2026-09-03',
        sessions: [
          { name: '  Open practice  ', notes: '  First run  ', laps: [] },
          { name: '   ', notes: 'Unused slot', laps: [] },
        ],
      },
    ]);

    component.complete();

    expect(apiMock.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        sessions: [
          {
            name: 'Open practice',
            notes: 'First run',
            sessionDate: '2026-09-03',
            laps: [],
          },
        ],
      }),
    );
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
