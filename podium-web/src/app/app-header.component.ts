import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private readonly router = inject(Router);

  readonly title = input.required<string>();
  readonly eyebrow = input('Overview of your performance');
  readonly description = input('');
  readonly backLabel = input('');
  readonly showNewTrackDay = input(true);

  protected goBack(): void {
    void this.router.navigate(['/track-days']);
  }

  protected newTrackDay(): void {
    void this.router.navigate(['/track-days/new']);
  }
}
