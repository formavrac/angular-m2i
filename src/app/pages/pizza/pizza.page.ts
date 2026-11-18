import { Component, inject, input } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-pizza',
  styleUrl: './pizza.page.css',
  templateUrl: './pizza.page.html',
})
export class PizzaPage {
  private pizzaService = inject(PizzaService);

  id = input.required<string>();
  pizza = this.pizzaService.getPizza(this.id);
}
