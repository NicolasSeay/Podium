import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppShellComponent } from './app-shell.component';
import { authRehydrateRequested } from './auth.store';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShellComponent],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(authRehydrateRequested());
  }
}
