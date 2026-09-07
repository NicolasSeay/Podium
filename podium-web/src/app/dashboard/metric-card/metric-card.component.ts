import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays, lucideGauge, lucideRoute, lucideTimer } from '@ng-icons/lucide';

@Component({
  selector: 'app-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ lucideCalendarDays, lucideGauge, lucideRoute, lucideTimer })],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly detail = input.required<string>();
  readonly icon = input('');
  readonly positive = input(false);
}
