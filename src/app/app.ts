import { Component, computed, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pizza } from './models/pizza';
import { PizzaDetail } from './components/pizza-detail/pizza-detail';
import { Counter } from './components/counter/counter';
import { User } from './models/user';
import { Author } from './components/author/author';
import { PizzaService } from './services/pizza.service';
import { MessageService } from './services/message.service';
import { Search } from './components/search/search';
import { HttpErrorResponse, httpResource } from '@angular/common/http';

// type Ingredient = {} // Juste typage...
// interface Pizza {} // Typage + implémentation possible
// class Box {} // Typage + instanciation possible

@Component({
  imports: [FormsModule, PizzaDetail, Counter, Author, Search],
  selector: 'app-root',
  template: `
    <div class="mx-auto max-w-xl p-6">
      <h1 class="mb-4 text-3xl font-bold">{{ title() }}</h1>
      @if (selectedPizza(); as pizza) {
        <app-pizza-detail
          [pizza]="pizza"
          (pizzaChange)="onUpdate($event)"
          (ordered)="onOrder($event)"
          (selectedIngredient)="onSelectIngredient($event)"
          (saved)="save($event)"
        />
        <button (click)="selectedPizza.set(undefined)">Desélection</button>
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
      @if (pizzas.isLoading()) {
        <p>Chargement des pizzas...</p>
      }
      <button (click)="pizzas.reload()">Reload</button>
      @if (pizzas.error()) {
        {{ getError(pizzas.error()).status }}
        <p class="text-red-600">Impossible de charger les pizzas.</p>
      }
      <ul class="grid grid-cols-2 gap-4">
        @for (pizza of pizzas.value(); track pizza.id) {
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
            @if (selectedIngredient()) {
              <span>Ingrédient sélectionné : {{ selectedIngredient() }}</span>
            }
            <button class="ml-2 text-red-600" (click)="delete(pizza); $event.stopPropagation()">
              Supprimer
            </button>
          </li>
        } @empty {
          <li>Aucune pizza</li>
        }
      </ul>

      <button (click)="add()">Ajouter une pizza</button>

      <app-counter />
      <app-counter [value]="5" />
      <app-counter [value]="15" />

      <app-author [author]="user()" />

      <app-search />

      <h2>Messages</h2>
      <ul class="space-y-2">
        @for (message of messageService.messages(); track $index) {
          <li [class]="{
              'bg-blue-100': message.type === 'info',
              'bg-red-100': message.type === 'error',
              'bg-green-100': message.type === 'success'
            }"
          >
            {{ message.content }}
            <button
              (click)="messageService.delete($index)"
              class="bg-red-500 text-white px-2 py-1 rounded-lg"
            >Supprimer</button>
          </li>
        } @empty {
          <li>Aucun message</li>
        }
      </ul>
    </div>
  `,
})
export class App {
  pizzaService = inject(PizzaService) // new PizzaService()
  messageService = inject(MessageService)

  constructor() {
    console.log(this.pizzaService);
  }

  title = signal('Pizza Party');
  selectedPizza = signal<Pizza | undefined>(undefined);
  pizzas = this.pizzaService.getPizzas();

  getError(error: any) {
    return error as HttpErrorResponse;
  }

  user = signal<User>({
    name: 'Mota',
    firstName: 'Matthieu',
    birthDate: '1991-11-18',
    avatarUrl: 'https://i.pravatar.cc/150?img=63',
  });

  orders = signal<Pizza[]>([]);
  selectedIngredient = signal<string | undefined>(undefined);

  onOrder(pizza: Pizza) {
    this.orders.update(orders => [...orders, pizza]);
  }

  onSelectIngredient(ingredient: string | undefined) {
    this.selectedIngredient.set(ingredient);
  }

  onUpdate(pizza: Pizza) {
    this.pizzas.update(pizzas => pizzas.map(p => (p.id === pizza.id ? pizza : p)));
    this.selectedPizza.set(pizza);
  }

  count = computed(() => {
    return this.title().length + Math.random();
  });
  cheapPizzas = computed(() => this.pizzas.value().filter(pizza => pizza.price < 12));

  pizzaCount() {
    return this.pizzas.value().length + Math.random();
  }

  changePrice() {
    this.pizzas.set(this.pizzas.value().map(pizza => ({ ...pizza, price: pizza.price - 1 })));
  }

  onSelect(pizza: Pizza) {
    console.log(pizza);
    this.selectedPizza.set(pizza); // On passe l'objet en référence
    this.selectedPizza.set({ ...pizza }); // On passe une copie de l'objet

    this.messageService.add({
      type: 'info',
      content: `Pizza sélectionnée : ${pizza.name}`
    });
  }

  async add() {
    const pizza = await this.pizzaService.create({
      name: 'Nouvelle Pizza',
      price: 10,
    });
    console.log(pizza);
    this.pizzas.reload(); // httpResource
  }

  async save(pizza: Pizza) {
    await this.pizzaService.update(pizza);
    this.selectedPizza.set(undefined);
    this.pizzas.reload();
  }

  async delete(pizza: Pizza) {
    try {
      await this.pizzaService.delete('90');
      this.pizzas.update(pizzas => pizzas.filter(p => p.id !== pizza.id));
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(`Erreur ${error.status} : ${error.message}`);
        alert('Erreur ' + error.status + ' : ' + error.message);
      }
    }
  }
}
