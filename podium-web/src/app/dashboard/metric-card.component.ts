import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="metric-card">
      <div class="metric-label">{{ label() }} <span class="metric-icon">{{ icon() }}</span></div>
      <div class="metric-value">{{ value() }}</div>
      <div class="metric-foot" [class.positive]="positive()">{{ detail() }}</div>
    </article>
  `,
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly detail = input.required<string>();
  readonly icon = input('');
  readonly positive = input(false);
}
