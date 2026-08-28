import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth.service';
import { authUserLoaded } from '../auth.store';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  protected email = 'nicolas.seay@gmail.com';
  protected password = 'password';
  protected loading = false;
  protected error = '';

  protected submit(): void {
    if (!this.email || !this.password || this.loading) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: ({ user }) => {
        this.store.dispatch(authUserLoaded(user));
        void this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.error = error.error?.message ?? 'Unable to sign in. Check your credentials.';
      },
    });
  }
}
