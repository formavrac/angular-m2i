import { Component, input, signal, computed, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [FormsModule, FormField],
  selector: 'app-author',
  template: `
    <div>
      <p>{{ author().name }} {{ author().firstName }}</p>
      <p>Âge : {{ age() }}</p>
      <select [formField]="yearForm" class="border rounded p-1">
        @for (y of years; track y) {
          <option [value]="y">{{ y }}</option>
        }
      </select>
      @if (showAvatar()) {
        <img [src]="author().avatarUrl" [alt]="author().name" class="mt-4" />
      }
      <button
        (click)="showAvatar.set(!showAvatar())"
        class="px-4 py-2 bg-blue-500 text-white rounded mt-4"
      >
        {{ showAvatar() ? 'Cacher' : 'Afficher' }} l'avatar
      </button>
    </div>
  `,
})
export class Author {
  author = input.required<User>();
  showAvatar = signal(true);

  birthDate = computed(() => new Date(this.author().birthDate));
  years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  year = linkedSignal(() => this.birthDate().getFullYear().toString());
  yearForm = form(this.year);

  age = computed(() => {
    const today = new Date();
    let age = today.getFullYear() - Number(this.year());
    const monthDiff = today.getMonth() - this.birthDate().getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate().getDate())) {
      age--;
    }
    return age;
  });
}
