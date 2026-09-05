import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TrackDay } from './track-days.store';
import { TrackDaysFacade } from './track-days.facade';
import { AuthFacade } from '../auth.facade';
import { DistanceUnit } from '../preferences';

@Component({
  selector: 'app-track-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './track-days.component.html',
  styleUrl: './track-days.component.scss',
})
export class TrackDaysComponent {
  private readonly facade = inject(TrackDaysFacade);
  private readonly authFacade = inject(AuthFacade);
  protected readonly tracks = this.facade.tracks;
  protected readonly vehicles = this.facade.vehicles;
  protected readonly trackDays = this.facade.trackDays;
  protected readonly sessions = this.facade.sessions;
  protected readonly laps = this.facade.laps;
  protected readonly stats = this.facade.stats;
  protected readonly loading = this.facade.loading;
  protected readonly error = this.facade.error;
  protected readonly selectedDayId = this.facade.selectedDayId;
  protected readonly selectedDay = computed(
    () => this.trackDays().find((day) => day.id === this.selectedDayId()) ?? null,
  );
  protected readonly user = this.authFacade.user;

  constructor() {
    this.facade.load();
  }

  protected openDay(day: TrackDay): void {
    this.facade.selectDay(day);
  }
  protected trackName(trackId: number): string {
    return this.tracks().find((track) => track.id === trackId)?.name ?? `Track ${trackId}`;
  }
  protected trackLength(trackId: number): string {
    const track = this.tracks().find((item) => item.id === trackId);
    if (track?.lengthMiles === null || track?.lengthMiles === undefined)
      return 'Length unavailable';
    return this.user()?.distanceUnit === DistanceUnit.Kilometers
      ? `${(track.lengthMiles * 1.609344).toFixed(2)} km`
      : `${track.lengthMiles.toFixed(2)} mi`;
  }
  protected vehicleName(vehicleId: number): string {
    return vehicleId
      ? (this.vehicles().find((vehicle) => vehicle.id === vehicleId)?.name ??
          `Vehicle ${vehicleId}`)
      : 'No vehicle';
  }
  protected formatLapTime(timeMillis: number): string {
    return `${Math.floor(timeMillis / 60000)}:${((timeMillis % 60000) / 1000).toFixed(3).padStart(6, '0')}`;
  }
  protected formatDateRange(day: TrackDay): string {
    return day.endDate && day.endDate !== day.startDate
      ? `${day.startDate} - ${day.endDate}`
      : day.startDate;
  }
  protected fastestLap(dayId: number): string {
    const time = this.stats()[dayId]?.fastestLapTimeMillis ?? 0;
    return time ? this.formatLapTime(time) : '--';
  }
  protected averageLapTime(dayId: number): string {
    const time = this.stats()[dayId]?.averageLapTimeMillis ?? 0;
    return time ? this.formatLapTime(time) : '--';
  }
}
