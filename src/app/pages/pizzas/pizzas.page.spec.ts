import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PizzasPage } from './pizzas.page';

describe('PizzasPage', () => {
  let fixture: ComponentFixture<PizzasPage>;
  let el: HTMLElement;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzasPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PizzasPage);
    el = fixture.nativeElement;
    TestBed.tick();

    // L'API mockée renvoie 2 pizzas au chargement
    httpMock.expectOne({ method: 'GET', url: 'http://localhost:3000/pizzas' }).flush([
      { id: '1', name: 'Reine', price: 12 },
      { id: '2', name: 'Calzone', price: 14 },
    ]);
    await fixture.whenStable();
  });

  afterEach(() => {
    // On ignore les requêtes du composant de recherche, hors périmètre du CRUD
    httpMock.match(req => req.params.has('name:contains'));
    httpMock.verify();
  });

  it('liste les pizzas', () => {
    const items = el.querySelectorAll('ul.grid > li');

    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('1 : Reine');
    expect(items[1].textContent).toContain('2 : Calzone');
  });

  it('crée une pizza avec le bouton', async () => {
    const addButton = [...el.querySelectorAll('button')].find(b => b.textContent?.includes('Ajouter une pizza'))!;
    addButton.click();

    const post = httpMock.expectOne({ method: 'POST', url: 'http://localhost:3000/pizzas' });
    expect(post.request.body).toEqual({ name: 'Nouvelle Pizza', price: 10 });
    post.flush({ id: '3', name: 'Nouvelle Pizza', price: 10 });

    const reload = await vi.waitFor(() => httpMock.expectOne({ method: 'GET', url: 'http://localhost:3000/pizzas' }));
    reload.flush([
      { id: '1', name: 'Reine', price: 12 },
      { id: '2', name: 'Calzone', price: 14 },
      { id: '3', name: 'Nouvelle Pizza', price: 10 },
    ]);
    await fixture.whenStable();

    const items = el.querySelectorAll('ul.grid > li');
    expect(items).toHaveLength(3);
    expect(items[2].textContent).toContain('3 : Nouvelle Pizza');
  });

  it('modifie une pizza après sélection', async () => {
    el.querySelector<HTMLElement>('ul.grid > li')!.click();
    await fixture.whenStable();

    const nameInput = el.querySelector<HTMLInputElement>('app-pizza-detail input')!;
    nameInput.value = 'Reine Margherita';
    nameInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const saveButton = [...el.querySelectorAll('app-pizza-detail button')].find(b => b.textContent?.includes('Enregistrer')) as HTMLButtonElement;
    saveButton.click();

    const put = httpMock.expectOne({ method: 'PUT', url: 'http://localhost:3000/pizzas/1' });
    expect(put.request.body).toEqual({ id: '1', name: 'Reine Margherita', price: 12 });
    put.flush(put.request.body);

    // Le détail se ferme et la liste est rechargée (on attend que la requête parte)
    const reload = await vi.waitFor(() => httpMock.expectOne({ method: 'GET', url: 'http://localhost:3000/pizzas' }));
    reload.flush([
      { id: '1', name: 'Reine Margherita', price: 12 },
      { id: '2', name: 'Calzone', price: 14 },
    ]);
    await fixture.whenStable();

    expect(el.querySelector('app-pizza-detail')).toBeNull();
    expect(el.querySelector('ul.grid > li')!.textContent).toContain('1 : Reine Margherita');
  });

  it('supprime une pizza', async () => {
    const calzone = el.querySelectorAll('ul.grid > li')[1];
    const deleteButton = [...calzone.querySelectorAll('button')].find(b => b.textContent?.includes('Supprimer'))!;
    deleteButton.click();

    httpMock.expectOne({ method: 'DELETE', url: 'http://localhost:3000/pizzas/2' }).flush(null);
    await fixture.whenStable();

    const items = el.querySelectorAll('ul.grid > li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('1 : Reine');
    // La suppression ne sélectionne pas la pizza
    expect(el.querySelector('app-pizza-detail')).toBeNull();
  });

  it('affiche une alerte si la suppression échoue', async () => {
    // On remplace alert() pour vérifier son appel sans bloquer le test
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const calzone = el.querySelectorAll('ul.grid > li')[1];
    const deleteButton = [...calzone.querySelectorAll('button')].find(b => b.textContent?.includes('Supprimer'))!;
    deleteButton.click();

    httpMock
      .expectOne({ method: 'DELETE', url: 'http://localhost:3000/pizzas/2' })
      .flush(null, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur 404'));
    // La pizza reste dans la liste
    expect(el.querySelectorAll('ul.grid > li')).toHaveLength(2);

    alertSpy.mockRestore();
  });

  it('affiche une erreur si le chargement de la liste échoue', async () => {
    const reloadButton = [...el.querySelectorAll('button')].find(b => b.textContent?.includes('Reload'))!;
    reloadButton.click();

    const reload = await vi.waitFor(() => httpMock.expectOne({ method: 'GET', url: 'http://localhost:3000/pizzas' }));
    reload.flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(el.textContent).toContain('500');
    expect(el.textContent).toContain('Impossible de charger les pizzas.');
  });
});
