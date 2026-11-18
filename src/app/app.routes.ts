import { Routes } from '@angular/router';
import { PizzasPage } from './pages/pizzas/pizzas.page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Pizza Party' },
  { path: 'pizzas', component: PizzasPage, title: 'Gestion des pizzas' },
];
