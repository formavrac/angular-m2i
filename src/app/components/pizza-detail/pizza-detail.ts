import { Component, input, model, output, ViewEncapsulation } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-pizza-detail',
  styleUrl: './pizza-detail.css',
  // encapsulation: ViewEncapsulation.None,
  imports: [FormField],
  template: `
    <div class="mt-6">
      <h2 class="text-xl font-semibold text-orange-600">{{ pizza().name }}</h2>
      <div><span class="font-medium">id :</span> {{ pizza().id }}</div>
      <div><span class="font-medium">prix :</span> {{ pizza().price }} €</div>
      <label class="block">
        <span class="font-medium">nom :</span>
        <input class="rounded border px-2 py-1" [formField]="pizzaForm.name" />
      </label>
      <img class="my-4 rounded-lg" [src]="pizza().image" [alt]="pizza().name" />
      <button class="rounded bg-orange-600 px-4 py-2 text-white" (click)="order()">
        Commander
      </button>
    </div>
  `,
  // templateUrl: './pizza-detail.html',
})
export class PizzaDetail {
  pizza = model.required<Pizza>();
  pizzaForm = form(this.pizza);
  ordered = output<Pizza>();

  order() {
    this.ordered.emit(this.pizza());
  }
}
