import { Routes } from '@angular/router';
import { PizzasPage } from './pages/pizzas/pizzas.page';
import { HomePage } from './pages/home/home.page';
import { PizzaPage } from './pages/pizza/pizza.page';
import { RegisterPage } from './pages/register/register.page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Pizza Party' },
  { path: 'pizzas', component: PizzasPage, title: 'Gestion des pizzas' },
  { path: 'pizza/:id', component: PizzaPage },
  { path: 'register', component: RegisterPage, title: 'Inscription' },
  {
    path: 'exercice',
    loadComponent: () => import('./pages/exercice/exercice.page').then(m => m.ExercicePage),
    title: 'Exercice',
  },
];
