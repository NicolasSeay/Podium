import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { trackCreateRequested, tracksFeature, tracksLoadRequested } from './tracks.store';

@Component({
  selector: 'app-tracks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.scss',
})
export class TracksComponent {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly tracks = this.store.selectSignal(tracksFeature.selectTracks);
  protected readonly loading = this.store.selectSignal(tracksFeature.selectLoading);
  protected readonly saving = this.store.selectSignal(tracksFeature.selectSaving);
  protected readonly error = this.store.selectSignal(tracksFeature.selectError);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    location: [''],
  });

  constructor() {
    this.store.dispatch(tracksLoadRequested());
  }

  protected createTrack(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, location } = this.form.getRawValue();
    this.store.dispatch(
      trackCreateRequested({ name: name.trim(), location: location.trim() || null }),
    );
    this.form.reset();
  }
}
