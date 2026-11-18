import { Component, input, inject, model, output, ViewEncapsulation } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PizzaService } from '../../services/pizza.service';
import { Pizza } from '../../models/pizza';
import { form, FormField } from '@angular/forms/signals';
import { MessageService } from '../../services/message.service';

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

      <button class="rounded bg-orange-600 px-4 py-2 text-white" (click)="saved.emit(pizza())">
        Enregistrer
      </button>

      <div>
        @for (ingredient of ingredients; track ingredient) {
          <label>
            {{ ingredient }}
            <input type="radio" name="ingredient" (change)="selectedIngredient.emit(ingredient === NO_INGREDIENT ? undefined : ingredient)" [checked]="ingredient === NO_INGREDIENT" />
          </label>
        }
      </div>

      <button class="rounded bg-orange-600 px-4 py-2 text-white" (click)="order()">
        Commander
      </button>
    </div>
  `,
  // templateUrl: './pizza-detail.html',
  // providers: [PizzaService],
})
export class PizzaDetail {
  pizzaService = inject(PizzaService)
  messageService = inject(MessageService)

  constructor() {
    console.log(this.pizzaService);

    interval(1000)
      .pipe(takeUntilDestroyed()) // Désabonnement automatique à la destruction du composant
      .subscribe(value => console.log(value));
  }

  readonly NO_INGREDIENT = 'Aucun';
  pizza = model.required<Pizza>();
  pizzaForm = form(this.pizza);
  ordered = output<Pizza>();
  saved = output<Pizza>();

  ingredients = ['Tomates', 'Champignons', 'Olives', this.NO_INGREDIENT];
  selectedIngredient = output<string | undefined>();

  order() {
    this.messageService.add({
      type: 'success',
      content: `Pizza commandée : ${this.pizza().name}`
    });

    this.ordered.emit(this.pizza());
  }
}
