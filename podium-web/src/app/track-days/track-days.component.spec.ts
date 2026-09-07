import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TrackDaysComponent } from './track-days.component';
import { TrackDaysFacade } from './store/track-days.facade';
import { AuthFacade } from '../store/auth.facade';

const trackDaysFacadeMock = {
  tracks: signal<any[]>([]),
  vehicles: signal<any[]>([]),
  trackDays: signal<any[]>([]),
  sessions: signal<any[]>([]),
  laps: signal<Record<number, any[]>>({}),
  stats: signal<Record<number, any>>({}),
  loading: signal(false),
  error: signal<string | null>(null),
  selectedDayId: signal<number | null>(null),
  load: vi.fn(),
  selectDay: vi.fn(),
};

const authFacadeMock = {
  user: signal<any | null>(null),
};

describe('TrackDaysComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    trackDaysFacadeMock.tracks.set([]);
    trackDaysFacadeMock.vehicles.set([]);
    trackDaysFacadeMock.trackDays.set([]);
    trackDaysFacadeMock.sessions.set([]);
    trackDaysFacadeMock.laps.set({});
    trackDaysFacadeMock.stats.set({});
    trackDaysFacadeMock.loading.set(false);
    trackDaysFacadeMock.error.set(null);
    trackDaysFacadeMock.selectedDayId.set(null);
    authFacadeMock.user.set(null);
    await TestBed.configureTestingModule({
      imports: [TrackDaysComponent],
      providers: [
        { provide: TrackDaysFacade, useValue: trackDaysFacadeMock },
        { provide: AuthFacade, useValue: authFacadeMock },
      ],
    }).compileComponents();
  });

  it('loads and renders the empty state', () => {
    const fixture = TestBed.createComponent(TrackDaysComponent);
    fixture.detectChanges();

    expect(trackDaysFacadeMock.load).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.textContent).toContain(
      'Your first drive is waiting to be logged.',
    );
  });

  it('renders selected track-day details and formats values', () => {
    trackDaysFacadeMock.tracks.set([
      { id: 2, name: 'Road Atlanta', lengthMiles: 2.54 },
      { id: 4, name: 'Unknown Length', lengthMiles: null },
    ]);
    trackDaysFacadeMock.vehicles.set([{ id: 3, name: 'MX-5' }]);
    trackDaysFacadeMock.trackDays.set([
      {
        id: 7,
        userId: 1,
        trackId: 2,
        vehicleId: 3,
        startDate: '2026-09-04',
        endDate: '2026-09-05',
        notes: 'Sunny day',
        conditions: 'Dry',
      },
    ]);
    trackDaysFacadeMock.sessions.set([{ id: 4, trackDayId: 7, name: 'Practice', notes: null }]);
    trackDaysFacadeMock.laps.set({
      4: [{ id: 11, sessionId: 4, lapNumber: 1, timeMillis: 92350 }],
    });
    trackDaysFacadeMock.stats.set({
      7: { fastestLapTimeMillis: 92350, averageLapTimeMillis: 95000 },
    });
    trackDaysFacadeMock.selectedDayId.set(7);
    authFacadeMock.user.set({ distanceUnit: 'MILES' });
    const fixture = TestBed.createComponent(TrackDaysComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('2026-09-04 - 2026-09-05');
    expect(fixture.nativeElement.textContent).toContain('Road Atlanta · 2.54 mi');
    expect(fixture.nativeElement.textContent).toContain('1:32.350');
    expect(fixture.nativeElement.textContent).toContain('1:35.000');
    expect(fixture.nativeElement.textContent).toContain('No session notes');
    expect(fixture.nativeElement.textContent).toContain('Sunny day');

    (fixture.nativeElement.querySelector('.day-row') as HTMLButtonElement).click();
    expect(trackDaysFacadeMock.selectDay).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }));
  });

  it('renders loading and error states', () => {
    trackDaysFacadeMock.loading.set(true);
    trackDaysFacadeMock.error.set('Unable to load track days');
    const fixture = TestBed.createComponent(TrackDaysComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading track days...');
    expect(fixture.nativeElement.textContent).toContain('Unable to load track days');
  });
});
