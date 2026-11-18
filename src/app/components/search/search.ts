import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, delay, tap, catchError, of } from 'rxjs';
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

    @if (error()) {
      <p class="text-red-600">Recherche indisponible.</p>
    }
  `,
})
export class Search {
  private pizzaService = inject(PizzaService);

  query = signal('');
  error = signal(false);
  // test = toSignal(
  //   toObservable(this.query).pipe(
  //     switchMap(query => this.pizzaService.searchPizzas(query))
  //   )
  // )
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300), // On attend 300 ms sans frappe
      distinctUntilChanged(), // On ignore si la recherche n'a pas changé
      switchMap(query =>
        this.pizzaService.search(query).pipe(
          tap(() => this.error.set(false)),
          catchError(() => {
            this.error.set(true);
            return of([]); // On remplace l'erreur par une liste vide
          })
        )
      ) // On annule la recherche précédente
    ),
    { initialValue: [] }
  );
}
