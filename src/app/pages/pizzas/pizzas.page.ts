import { Component, computed, inject, signal } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { MessageService } from '../../services/message.service';
import { Pizza } from '../../models/pizza';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { PizzaDetail } from '../../components/pizza-detail/pizza-detail';
import { Counter } from '../../components/counter/counter';
import { Author } from '../../components/author/author';
import { Search } from '../../components/search/search';

@Component({
  imports: [FormsModule, PizzaDetail, Counter, Author, Search],
  selector: 'app-pizzas',
  styleUrl: './pizzas.page.css',
  templateUrl: './pizzas.page.html',
})
export class PizzasPage {
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
