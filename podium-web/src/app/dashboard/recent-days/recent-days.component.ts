import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { RecentTrackDay } from '../dashboard.store';

@Component({
  selector: 'app-recent-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-days.component.html',
  styleUrl: './recent-days.component.scss',
})
export class RecentDaysComponent {
  private readonly router = inject(Router);
  readonly days = input<RecentTrackDay[]>([]);
  protected viewAll(): void {
    void this.router.navigate(['/track-days']).catch(() => undefined);
  }
}
