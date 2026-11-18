import { Service } from '@angular/core';
import { Pizza } from '../models/pizza';
import { httpResource, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../api-url';
import { firstValueFrom, Observable } from 'rxjs';

@Service()
export class PizzaService {
  toto = Math.random();

  private http = inject(HttpClient);
  private apiUrl = `${inject(API_URL)}/pizzas`;

  getPizzas() {
    return httpResource<Pizza[]>(() => this.apiUrl, {
      defaultValue: [],
    });
  }

  create(pizza: Omit<Pizza, 'id'>): Promise<Pizza> {
    return firstValueFrom(this.http.post<Pizza>(this.apiUrl, pizza));
  }

  update(pizza: Pizza): Promise<Pizza> {
    return firstValueFrom(this.http.put<Pizza>(`${this.apiUrl}/${pizza.id}`, pizza));
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

  search(query: string): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.apiUrl, { params: { 'name:contains': query } });
  }
}
