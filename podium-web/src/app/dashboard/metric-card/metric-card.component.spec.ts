import { TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';

describe('MetricCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MetricCardComponent] }).compileComponents();
  });

  it('renders its supplied metric', () => {
    const fixture = TestBed.createComponent(MetricCardComponent);
    fixture.componentRef.setInput('label', 'Total laps');
    fixture.componentRef.setInput('value', '42');
    fixture.componentRef.setInput('detail', 'Across all sessions');
    fixture.componentRef.setInput('icon', 'lap');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Total laps');
    expect(fixture.nativeElement.textContent).toContain('42');
    expect(fixture.nativeElement.textContent).toContain('Across all sessions');
  });
});
