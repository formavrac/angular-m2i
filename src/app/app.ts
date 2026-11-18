import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// type Ingredient = {} // Juste typage...
// interface Pizza {} // Typage + implémentation possible
// class Box {} // Typage + instanciation possible

@Component({
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  template: `
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <h1 class="text-2xl font-bold">
          <a routerLink="/" class="rounded-lg text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
            <span aria-hidden="true">🍕</span> {{ title() }}
          </a>
        </h1>
        <nav aria-label="Menu principal" class="flex flex-wrap gap-2">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-orange-700 text-white hover:bg-orange-800"
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              class="rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-orange-100 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 active:scale-95"
            >{{ link.label }}</a>
          }
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-xl p-6">
      <router-outlet />
    </main>
  `,
})
export class App {
  title = signal('Pizza Party');

  readonly links = [
    { path: '/', label: 'Accueil' },
    { path: '/pizzas', label: 'Pizzas' },
    { path: '/register', label: 'Inscription' },
    { path: '/exercice', label: 'Exercice' },
  ];
}
