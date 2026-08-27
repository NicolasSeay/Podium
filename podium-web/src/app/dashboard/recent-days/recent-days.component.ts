import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recent-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-days.component.html',
  styleUrl: './recent-days.component.scss',
})
export class RecentDaysComponent {
  readonly days = [
    { date: 'May 03', year: '2026', track: 'Virginia International Raceway', vehicle: '2020 Camaro LT1', sessions: 6, best: '2:38.421', improvement: '-1.31s', weather: '72°' },
    { date: 'Apr 18', year: '2026', track: 'VIR Full Course', vehicle: '2020 Camaro LT1', sessions: 5, best: '2:41.182', improvement: '+2.08s', weather: '68°' },
    { date: 'Mar 21', year: '2026', track: 'Summit Point Main', vehicle: '2018 Civic Type R', sessions: 4, best: '1:29.771', improvement: '-0.82s', weather: '61°' },
    { date: 'Feb 07', year: '2026', track: 'Virginia International Raceway', vehicle: '2020 Camaro LT1', sessions: 6, best: '2:42.091', improvement: '-1.96s', weather: '54°' },
  ];
}
