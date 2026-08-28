import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RecentTrackDay } from '../dashboard.store';

@Component({
  selector: 'app-recent-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-days.component.html',
  styleUrl: './recent-days.component.scss',
})
export class RecentDaysComponent {
  readonly days = input<RecentTrackDay[]>([]);
}
