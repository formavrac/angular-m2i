import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PizzasPage } from './pizzas.page';

describe('PizzasPage', () => {
  let component: PizzasPage;
  let fixture: ComponentFixture<PizzasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PizzasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
