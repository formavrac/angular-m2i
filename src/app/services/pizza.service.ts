import { Service } from '@angular/core';
import { Pizza } from '../models/pizza';
import { httpResource } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../api-url';

@Service()
export class PizzaService {
  toto = Math.random();

  private apiUrl = `${inject(API_URL)}/pizzas`;

  getPizzas() {
    return httpResource<Pizza[]>(() => this.apiUrl, {
      defaultValue: [],
    });
  }

  async searchPizzas(query: string): Promise<Pizza[]> {
    return Promise.resolve([]);
    // const pizzas = await this.getPizzas();
    // console.log('CALL API');

    // return pizzas.filter(pizza => pizza.name.toLowerCase().includes(query.toLowerCase()));
  }
}
