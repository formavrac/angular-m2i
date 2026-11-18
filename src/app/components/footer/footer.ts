import { Component, input } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-5xl px-6 py-4 text-sm text-gray-600">
        <p>© {{ year }} {{ title() }}</p>
      </div>
    </footer>
  `,
})
export class Footer {
  readonly title = input.required<string>();
  protected readonly year = new Date().getFullYear();
}
