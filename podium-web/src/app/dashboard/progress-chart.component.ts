import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="panel chart-panel">
      <div class="panel-heading">
        <div><span class="eyebrow">Performance</span><h2>Personal Best Progression</h2></div>
        <button class="select-button" type="button">{{ range() }} <span>⌄</span></button>
      </div>
      <div class="chart-wrap">
        <div class="y-axis"><span>2:35</span><span>2:40</span><span>2:45</span><span>2:50</span><span>2:55</span></div>
        <div class="chart" aria-label="Personal best progression chart">
          <div class="grid-lines"><i></i><i></i><i></i><i></i><i></i></div>
          <svg viewBox="0 0 700 210" preserveAspectRatio="none" role="img">
            <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2d9cff" stop-opacity=".28"/><stop offset="1" stop-color="#2d9cff" stop-opacity="0"/></linearGradient></defs>
            <path class="area" d="M0 35 L42 47 L84 61 L126 77 L168 85 L210 105 L252 110 L294 123 L336 130 L378 136 L420 144 L462 151 L504 148 L546 162 L588 158 L630 171 L700 178 L700 210 L0 210Z" />
            <path class="line" d="M0 35 L42 47 L84 61 L126 77 L168 85 L210 105 L252 110 L294 123 L336 130 L378 136 L420 144 L462 151 L504 148 L546 162 L588 158 L630 171 L700 178" />
            <circle cx="700" cy="178" r="4" />
          </svg>
          <div class="x-axis"><span>May 25</span><span>Jul 25</span><span>Sep 25</span><span>Nov 25</span><span>Jan 26</span><span>Mar 26</span><span>May 26</span></div>
        </div>
      </div>
    </section>
  `,
})
export class ProgressChartComponent { readonly range = input.required<string>(); }
