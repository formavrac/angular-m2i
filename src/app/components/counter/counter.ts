import { Component, input, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div class="flex items-center gap-2">
      <button
        (click)="decrement()"
        class="bg-gray-200 p-2 rounded cursor-pointer hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        [disabled]="count() <= 0"
      >-</button>
      <p>{{ count() }}</p>
      @if (count() < max) {
        <button
          (click)="increment()"
          class="bg-gray-200 p-2 rounded cursor-pointer hover:bg-gray-300"
        >+</button>
      }
    </div>
  `,
})
export class Counter {
  value = input(0);
  max = 10;
  count = linkedSignal(() => this.value() > this.max ? this.max : this.value());

  increment() {
    this.count.update(c => c + 1);
  }

  decrement() {
    this.count.set(this.count() - 1);
  }
}
