import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { API_URL } from '../../api-url';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormField, FormRoot, JsonPipe],
  template: `
    <section class="max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-md" aria-labelledby="register-title">
      <h2 id="register-title" class="mb-4 text-xl font-semibold">Inscription</h2>
      <form class="flex flex-col gap-4" [formRoot]="registerForm">
        <label class="flex flex-col">
          Pseudo
          <input class="rounded border px-2 py-1" [formField]="registerForm.username" />
          @if (registerForm.username().touched()) {
            @for (error of registerForm.username().errors(); track error.kind) {
              <span class="text-sm text-red-600">{{ error.message }}</span>
            }
          }
        </label>

        <label class="flex flex-col">
          Email
          <input type="email" class="rounded border px-2 py-1" [formField]="registerForm.email" />
          @if (registerForm.email().touched()) {
            @for (error of registerForm.email().errors(); track error.kind) {
              <span class="text-sm text-red-600">{{ error.message }}</span>
            }
          }
        </label>

        <button class="rounded-lg bg-orange-700 px-4 py-2 font-medium text-white transition hover:bg-orange-800 disabled:opacity-50"
          [disabled]="registerForm().submitting()"
        >
          S'inscrire
        </button>
      </form>
    </section>

    <pre class="mt-4">{{ user() | json }}</pre>
  `,
})
export class RegisterPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(API_URL);

  user = signal({
    username: '',
    email: '',
  });

  registerForm = form(this.user, path => {
    required(path.username, { message: 'Le pseudo est obligatoire' });
    minLength(path.username, 3, { message: 'Le pseudo doit faire au moins 3 caractères' });

    required(path.email, { message: "L'email est obligatoire" });
    email(path.email, { message: "L'email n'est pas valide" });
  }, {
    submission: {
      action: async form => {
        await firstValueFrom(this.http.post(`${this.apiUrl}/users`, form().value()));
        await new Promise(resolve => setTimeout(() => resolve(null), 200));
        await this.router.navigate(['/']);
      }
    }
  });
}
