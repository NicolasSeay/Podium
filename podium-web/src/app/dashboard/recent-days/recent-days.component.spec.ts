import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RecentDaysComponent } from './recent-days.component';

describe('RecentDaysComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentDaysComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders API track days without fabricated rows when empty', () => {
    const fixture = TestBed.createComponent(RecentDaysComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.recent-row')).toHaveLength(0);
    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled).toBe(
      false,
    );
  });

  it('renders supplied track day identifiers and metadata', () => {
    const fixture = TestBed.createComponent(RecentDaysComponent);
    fixture.componentRef.setInput('days', [
      {
        id: 1,
        userId: 1,
        trackId: 1,
        vehicleId: 1,
        date: '2026-08-24',
        notes: 'Dry',
        conditions: 'Sunny',
      },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('2026-08-24');
    expect(fixture.nativeElement.textContent).toContain('Track 1');
    expect(fixture.nativeElement.textContent).toContain('Sunny');
  });
});
