import { TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AdminApiService } from '../../services/admin-api.service';
import initialContent from '../../data/initial-content.json';
import { SiteContent } from '../../models/content';

describe('Admin navigation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [{ provide: AdminApiService, useValue: {} }],
    }).compileComponents();
  });

  it('switches through every tab repeatedly after the conditional editor is destroyed', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    const component = fixture.componentInstance;
    spyOn(component, 'ngOnInit');
    component.user = 'admin@example.test';
    component.ready = true;
    component.content = structuredClone(initialContent) as SiteContent;
    fixture.detectChanges();
    for (let round = 0; round < 2; round++) {
      component.selectTab('products');
      fixture.detectChanges();
      component.selectProduct(component.content.products[0]);
      fixture.detectChanges();
      expect(component.productEditorDialog?.nativeElement.open).toBeTrue();
      for (const tab of component.tabs.filter((item) => item.id !== 'products')) {
        expect(() => { component.selectTab(tab.id); fixture.detectChanges(); }).not.toThrow();
        expect(component.selectedProduct).toBeNull();
        expect(component.productEditorDialog).toBeUndefined();
      }
    }
    fixture.destroy();
  });

  it('can close the editor before login or after logout', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    expect(() => fixture.componentInstance.closeProductEditor()).not.toThrow();
    fixture.destroy();
  });

  it('edits the canonical legal pages from Betriebsdaten and keeps inquiry changes guarded', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    const component = fixture.componentInstance;
    spyOn(component, 'ngOnInit');
    component.user = 'admin@example.test'; component.ready = true;
    component.content = structuredClone(initialContent) as SiteContent;
    component.selectTab('settings'); fixture.detectChanges();
    expect(component.legalPages.map(p => p.id).sort()).toEqual(['agb','datenschutz','impressum']);
    const legal = component.legalPages[0];
    expect(component.content.pages.find(p => p.id === legal.id)).toBe(legal);
    const field = fixture.nativeElement.querySelector('.legal-settings textarea[maxlength="100000"]') as HTMLTextAreaElement;
    field.value = '<p>Updated legal information</p>'; field.dispatchEvent(new Event('input', {bubbles:true})); fixture.detectChanges();
    expect(legal.body).toBe(field.value); expect(component.dirty).toBeTrue();
    component.dirty = false; component.inquiriesDirty = true;
    const event = {preventDefault: jasmine.createSpy(), returnValue: undefined} as unknown as BeforeUnloadEvent;
    component.beforeUnload(event); expect(event.preventDefault).toHaveBeenCalled(); fixture.destroy();
  });
});
