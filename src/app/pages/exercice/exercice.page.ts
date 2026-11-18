import { Component, signal } from '@angular/core';
import { Counter } from '../../components/counter/counter';
import { Author } from '../../components/author/author';
import { User } from '../../models/user';

@Component({
  imports: [Counter, Author],
  selector: 'app-exercice',
  templateUrl: './exercice.page.html',
})
export class ExercicePage {
  user = signal<User>({
    name: 'Mota',
    firstName: 'Matthieu',
    birthDate: '1991-11-18',
    avatarUrl: 'https://i.pravatar.cc/150?img=63',
  });
}
