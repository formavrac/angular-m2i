import { Component, input } from '@angular/core';
import { Pizza } from '../../models/pizza';

@Component({
  selector: 'app-pizza-detail',
  template: `
    <div class="mt-6">
      <h2 class="text-xl font-semibold text-orange-600">{{ pizza().name }}</h2>
      <div><span class="font-medium">id :</span> {{ pizza().id }}</div>
      <div><span class="font-medium">prix :</span> {{ pizza().price }} €</div>
      <img class="my-4 rounded-lg" [src]="pizza().image" [alt]="pizza().name" />
    </div>
  `,
  // templateUrl: './pizza-detail.html',
})
export class PizzaDetail {
  pizza = input.required<Pizza>();
}
