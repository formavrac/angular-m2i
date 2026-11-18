import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PizzaDetail } from './pizza-detail';

describe('PizzaDetail', () => {
  let component: PizzaDetail;
  let fixture: ComponentFixture<PizzaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PizzaDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pizza', { id: '1', name: 'Reine', price: 12 });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
