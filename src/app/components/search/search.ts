import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, delay } from 'rxjs';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'app-search',
  template: `
    <input #search placeholder="Rechercher une pizza..." (input)="query.set(search.value)" />
    <ul>
      @for (pizza of results(); track pizza.id) {
        <li>{{ pizza.name }}</li>
      }
    </ul>
  `,
})
export class Search {
  private pizzaService = inject(PizzaService);

  query = signal('');
  // test = toSignal(
  //   toObservable(this.query).pipe(
  //     switchMap(query => this.pizzaService.searchPizzas(query))
  //   )
  // )
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300), // On attend 300 ms sans frappe
      distinctUntilChanged(), // On ignore si la recherche n'a pas changé
      switchMap(query => this.pizzaService.searchPizzas(query)) // On annule la recherche précédente
    ),
    { initialValue: [] }
  );
}
