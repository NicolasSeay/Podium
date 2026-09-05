import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthFacade } from '../auth.facade';
import { environment } from '../../environments/environment';

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
  private readonly authFacade = inject(AuthFacade);
  protected registering = false;
  protected email = environment.demoCredentials.email;
  protected password = environment.demoCredentials.password;
  protected firstName = '';
  protected lastName = '';
  protected confirmPassword = '';
  protected loading = false;
  protected error = '';

  protected toggleMode(): void {
    this.registering = !this.registering;
    this.email = this.registering ? '' : environment.demoCredentials.email;
    this.password = this.registering ? '' : environment.demoCredentials.password;
    this.firstName = '';
    this.lastName = '';
    this.confirmPassword = '';
    this.error = '';
  }

  protected submit(): void {
    if (this.loading) {
      return;
    }

    if (
      !this.email ||
      !this.password ||
      (this.registering && this.password.length < 8) ||
      (this.registering &&
        (!this.firstName || !this.lastName || this.password !== this.confirmPassword))
    ) {
      this.error =
        this.registering && this.password.length < 8
          ? 'Password must be at least 8 characters.'
          : this.registering && this.password !== this.confirmPassword
            ? 'Passwords do not match.'
            : 'Please complete all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    const request = this.registering
      ? this.auth.register(this.email, this.password, this.firstName, this.lastName)
      : this.auth.login(this.email, this.password);
    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: ({ user }) => {
        this.authFacade.userLoaded(user);
        void this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { message?: string; detail?: string } }) => {
        this.error =
          error.error?.message ??
          error.error?.detail ??
          (this.registering
            ? 'Registration failed. Please try again.'
            : 'Sign in failed. Check your credentials.');
      },
    });
  }
}
