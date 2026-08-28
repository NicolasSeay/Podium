import { ComponentFixture } from '@angular/core/testing';

export class AppPage {
  constructor(private readonly fixture: ComponentFixture<unknown>) {}

  clickNavigation(item: string): void {
    const button = this.findAll<HTMLButtonElement>('button.nav-item').find((candidate) =>
      candidate.textContent?.includes(item),
    );
    if (!button) {
      throw new Error(`Navigation item not found: ${item}`);
    }
    button.click();
    this.fixture.detectChanges();
  }

  fill(selector: string, value: string): void {
    const input = this.find<HTMLInputElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  submit(selector: string): void {
    this.find<HTMLFormElement>(selector).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    this.fixture.detectChanges();
  }

  text(selector?: string): string {
    const element = selector ? this.find(selector) : (this.fixture.nativeElement as HTMLElement);
    return element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  find<T extends Element>(selector: string): T {
    const element = (this.fixture.nativeElement as HTMLElement).querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element as T;
  }

  private findAll<T extends Element>(selector: string): T[] {
    return Array.from(
      (this.fixture.nativeElement as HTMLElement).querySelectorAll(selector),
    ) as T[];
  }
}
