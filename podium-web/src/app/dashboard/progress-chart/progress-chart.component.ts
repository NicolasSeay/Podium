import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.scss',
})
export class ProgressChartComponent { readonly range = input.required<string>(); }
