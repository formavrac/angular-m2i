import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PizzaPage } from './pizza.page';

describe('PizzaPage', () => {
  let component: PizzaPage;
  let fixture: ComponentFixture<PizzaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PizzaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
