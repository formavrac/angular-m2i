import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pizza } from './models/pizza';
import { PizzaDetail } from './components/pizza-detail/pizza-detail';
import { Counter } from './components/counter/counter';
import { User } from './models/user';
import { Author } from './components/author/author';

const PIZZAS: Pizza[] = [
  { id: '1', name: 'Reine', price: 12, image: '/assets/pizzas/reine.jpg' },
  { id: '2', name: '4 fromages', price: 13, image: '/assets/pizzas/4-fromages.jpg' },
  { id: '3', name: 'Orientale', price: 11, image: '/assets/pizzas/orientale.jpg' },
  { id: '4', name: 'Cannibale', price: 9, image: '/assets/pizzas/cannibale.jpg' },
];

// type Ingredient = {} // Juste typage...
// interface Pizza {} // Typage + implémentation possible
// class Box {} // Typage + instanciation possible

@Component({
  imports: [FormsModule, PizzaDetail, Counter, Author],
  selector: 'app-root',
  template: `
    <div class="mx-auto max-w-xl p-6">
      <h1 class="mb-4 text-3xl font-bold">{{ title() }}</h1>
      @if (selectedPizza(); as pizza) {
        <app-pizza-detail
          [pizza]="pizza"
          (pizzaChange)="onUpdate($event)"
          (ordered)="onOrder($event)"
        />
        <input type="text" class="border" [(ngModel)]="pizza.name" />
        <input type="text" class="border"
          [value]="pizza.name"
          (input)="selectedPizza.set({ ...pizza, name: $event.target.value })"
        />
      } @else {
        <p class="mt-6 text-gray-500">Cliquez sur une pizza pour voir le détail.</p>
      }

      @if (orders().length) {
        <p class="mt-4">Commandes : {{ orders().length }}</p>
        @for (order of orders(); track order.id) {
          <p>{{ order.name }}</p>
        }
      }

      <input type="text" class="border" [(ngModel)]="title" />
      <button (click)="changePrice()">
        Changer prix
      </button>
      <h2 class="mb-2 text-xl font-semibold">Les pizzas ({{ count() }})</h2>
      <ul class="grid grid-cols-2 gap-4">
        @for (pizza of pizzas(); track pizza.id) {
          @let priceWithTax = (pizza.price * 1.2).toFixed(2);
          <li
            class="cursor-pointer rounded-lg border p-2 hover:bg-orange-50"
            [class.bg-orange-100]="pizza.id === selectedPizza()?.id"
            [class]="{
              'text-orange-800': pizza.price > 12,
              'text-green-800': pizza.price <= 12,
            }"
            (click)="onSelect(pizza)"
          >
            <span>{{ pizza.id }} : {{ pizza.name }}</span>
            <span>prix : {{ pizza.price }} €</span>
            <span>prix TTC : {{ priceWithTax }} €</span>
            <img class="rounded" [src]="pizza.image" [alt]="pizza.name" />
            {{ $index + 1 }} / {{ $count }}
          </li>
        } @empty {
          <li>Aucune pizza</li>
        }
      </ul>

      <app-counter />
      <app-counter [value]="5" />
      <app-counter [value]="15" />

      <app-author [author]="user()" />
    </div>
  `,
})
export class App {
  title = signal('Pizza Party');
  selectedPizza = signal<Pizza | undefined>(undefined);
  pizzas = signal<Pizza[]>(PIZZAS);

  user = signal<User>({
    name: 'Mota',
    firstName: 'Matthieu',
    birthDate: '1991-11-18',
    avatarUrl: 'https://i.pravatar.cc/150?img=63',
  });

  orders = signal<Pizza[]>([]);

  onOrder(pizza: Pizza) {
    this.orders.update(orders => [...orders, pizza]);
  }

  onUpdate(pizza: Pizza) {
    this.pizzas.update(pizzas => pizzas.map(p => (p.id === pizza.id ? pizza : p)));
    this.selectedPizza.set(pizza);
  }

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

  onSelect(pizza: Pizza) {
    console.log(pizza);
    this.selectedPizza.set(pizza); // On passe l'objet en référence
    this.selectedPizza.set({ ...pizza }); // On passe une copie de l'objet
  }
}
