import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Author } from './author';

describe('Author', () => {
  let component: Author;
  let fixture: ComponentFixture<Author>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Author],
    }).compileComponents();

    fixture = TestBed.createComponent(Author);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('author', {
      name: 'Mota',
      firstName: 'Matthieu',
      birthDate: '1991-11-18',
      avatarUrl: 'https://i.pravatar.cc/150?img=63',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
