import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const PIZZAS: Pizza[] = [
  { id: '1', name: 'Reine', price: 12, image: '/assets/pizzas/reine.jpg' },
  { id: '2', name: '4 fromages', price: 13, image: '/assets/pizzas/4-fromages.jpg' },
  { id: '3', name: 'Orientale', price: 11, image: '/assets/pizzas/orientale.jpg' },
  { id: '4', name: 'Cannibale', price: 9, image: '/assets/pizzas/cannibale.jpg' },
];

// type Ingredient = {} // Juste typage...
// interface Pizza {} // Typage + implémentation possible
// class Box {} // Typage + instanciation possible

interface Pizza {
  id: string;
  name: string;
  price: number;
  image?: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  template: `
    <div class="mx-auto max-w-xl p-6">
      <h1 class="mb-4 text-3xl font-bold">{{ title() }}</h1>
      <h2 class="text-xl font-semibold text-orange-600">{{ pizza().name }}</h2>
      <div>
        <span class="font-medium">id :</span>
        {{ pizza().id }}
      </div>
      <div>
        <span class="font-medium">nom :</span>
        {{ pizza().name }}
      </div>
      <div>
        <span class="font-medium">prix :</span>
        {{ pizza().price }} €
      </div>
      <img class="my-4 rounded-lg" [src]="pizza().image" [alt]="pizza().name" />
      <input type="text" class="border" [(ngModel)]="pizza().name" />
      <input type="text" class="border"
        [value]="pizza().name"
        (input)="pizza.set({ ...pizza(), name: $event.target.value })"
      />

      <input type="text" class="border" [(ngModel)]="title" />
      <button (click)="changePrice()">
        Changer prix
      </button>
      <h2 class="mb-2 text-xl font-semibold">Les pizzas ({{ count() }})</h2>
      <ul class="grid grid-cols-2 gap-4">
        @for (pizza of cheapPizzas(); track pizza.id) {
          <li class="rounded-lg border p-2">
            <span>{{ pizza.id }} : {{ pizza.name }}</span>
            <span>prix : {{ pizza.price }} €</span>
            <img class="rounded" [src]="pizza.image" [alt]="pizza.name" />
            {{ $index + 1 }} / {{ $count }}
          </li>
        } @empty {
          <li>Aucune pizza</li>
        }
      </ul>
    </div>
  `,
})
export class App {
  title = signal('Pizza Party');
  pizza = signal<Pizza>({ id: '1', name: 'Reine', price: 12, image: '/assets/pizzas/reine.jpg' });
  pizzas = signal<Pizza[]>(PIZZAS);

  count = computed(() => {
    return this.title().length + Math.random();
  });
  cheapPizzas = computed(() => this.pizzas().filter(pizza => pizza.price < 12));

  pizzaCount() {
    return this.pizzas().length + Math.random();
  }

  changePrice() {
    this.pizzas.set(this.pizzas().map(pizza => ({ ...pizza, price: pizza.price - 1 })));
  }
}
