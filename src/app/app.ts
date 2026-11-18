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
    <div class="mx-auto max-w-xl p-6">
      <h1 class="mb-4 text-3xl font-bold">{{ title() }}</h1>
      <nav class="mb-6 flex gap-4">
        <a routerLink="/" routerLinkActive="font-bold text-orange-600" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
        <a routerLink="/pizzas" routerLinkActive="font-bold text-orange-600">Pizzas</a>
      </nav>
      <router-outlet />
    </div>
  `,
})
export class App {
  title = signal('Pizza Party');
}
