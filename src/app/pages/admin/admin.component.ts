import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminApiService } from '../../services/admin-api.service';
import {
  Category,
  ContentPage,
  MediaItem,
  Product,
  SiteContent,
  priceLabel,
} from '../../models/content';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  @ViewChild('picker') picker!: ElementRef<HTMLDialogElement>;
  @ViewChild('confirmationDialog')
  confirmationDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('productEditorDialog')
  productEditorDialog!: ElementRef<HTMLDialogElement>;
  email = '';
  password = '';
  user = '';
  ready = false;
  busy = false;
  dirty = false;
  message = '';
  error = '';
  revision = 0;
  content: SiteContent | null = null;
  media: MediaItem[] = [];
  tab = 'products';
  search = '';
  mediaSearch = '';
  selectedProduct: Product | null = null;
  selectedPage: ContentPage | null = null;
  uploadAlt = '';
  confirmation = {
    title: '',
    message: '',
    confirmLabel: 'Bestätigen',
    tone: 'primary' as 'primary' | 'danger',
  };
  private imageProduct: Product | null = null;
  private imagePage: ContentPage | null = null;
  private imageSetting = '';
  private confirmationResolver: ((confirmed: boolean) => void) | null = null;
  readonly priceLabel = priceLabel;
  readonly tabs = [
    { id: 'products', title: 'Produkte' },
    { id: 'categories', title: 'Kategorien' },
    { id: 'media', title: 'Bilder' },
    { id: 'home', title: 'Startseite & Speisekarte' },
    { id: 'pages', title: 'Seiten & SEO' },
    { id: 'settings', title: 'Betriebsdaten' },
  ];
  readonly labels: Record<string, string> = {
    businessName: 'Name',
    tagline: 'Unterzeile',
    logoImage: 'Logo',
    street: 'Straße',
    postalCode: 'Postleitzahl',
    city: 'Ort',
    phone: 'Telefon',
    email: 'E-Mail',
    hours: 'Öffnungszeiten · eine Zeile je Eintrag',
    facebookUrl: 'Facebook',
    instagramUrl: 'Instagram',
    tiktokUrl: 'TikTok',
    footerText: 'Text im Fußbereich',
    heroEyebrow: 'Startseite · Einleitung',
    heroTitle: 'Startseite · Haupttitel',
    heroAccent: 'Startseite · Hervorgehobener Titel',
    heroText: 'Startseite · Beschreibung',
    heroImage: 'Startseite · Hauptbild',
    heroImageAlt: 'Startseite · Bildbeschreibung',
    heroCaption: 'Startseite · Bildunterschrift',
    heroCaptionLabel: 'Startseite · Bildunterzeile',
    welcomeText: 'Angebotsleiste · ein Eintrag je Zeile',
    featuredEyebrow: 'Empfehlungen · Einleitung',
    featuredTitle: 'Empfehlungen · Titel',
    breakfastEyebrow: 'Frühstück · Einleitung',
    breakfastTitle: 'Frühstück · Titel',
    breakfastText: 'Frühstück · Beschreibung',
    breakfastImage: 'Frühstück · Foto',
    breakfastImageAlt: 'Frühstück · Bildbeschreibung',
    deliEyebrow: 'Feinkost · Einleitung',
    deliTitle: 'Feinkost · Titel',
    deliText: 'Feinkost · Beschreibung',
    storyEyebrow: 'Geschichte · Einleitung',
    storyTitle: 'Geschichte · Titel',
    storyText: 'Geschichte · Text',
    visitEyebrow: 'Besuch · Einleitung',
    visitTitle: 'Besuch · Titel',
    menuEyebrow: 'Speisekarte · Einleitung',
    menuTitle: 'Speisekarte · Titel',
    menuAccent: 'Speisekarte · Hervorgehobener Titel',
    menuText: 'Speisekarte · Beschreibung',
    menuImage: 'Speisekarte · Hauptbild',
    menuImageAlt: 'Speisekarte · Bildbeschreibung',
    menuDetailImage: 'Speisekarte · Zweites Bild',
    menuDetailImageAlt: 'Speisekarte · Zweite Bildbeschreibung',
    menuCaption: 'Speisekarte · Bildunterschrift',
    menuDetailCaption: 'Speisekarte · Zweite Bildunterschrift',
    menuNoteTitle: 'Speisekarte · Hinweisüberschrift',
    menuNoteText: 'Speisekarte · Hinweistext',
  };
  private readonly businessKeys = [
    'businessName',
    'tagline',
    'logoImage',
    'street',
    'postalCode',
    'city',
    'phone',
    'email',
    'hours',
    'facebookUrl',
    'instagramUrl',
    'tiktokUrl',
    'footerText',
  ];

  async ngOnInit(): Promise<void> {
    await this.run(async () => {
      const session = await this.api.session();
      if (session.user) {
        this.user = session.user.email;
        await this.loadDraft();
      }
    });
    this.ready = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent): void {
    if (this.dirty) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  get products(): Product[] {
    return (
      this.content?.products.filter((product) =>
        `${product.name} ${product.description}`
          .toLocaleLowerCase()
          .includes(this.search.toLocaleLowerCase()),
      ) ?? []
    );
  }
  get filteredMedia(): MediaItem[] {
    return this.media.filter((image) =>
      `${image.name} ${image.alt}`
        .toLocaleLowerCase()
        .includes(this.mediaSearch.toLocaleLowerCase()),
    );
  }
  get settingKeys(): string[] {
    return Object.keys(this.content?.settings ?? {}).filter((key) =>
      this.tab === 'settings'
        ? this.businessKeys.includes(key)
        : !this.businessKeys.includes(key),
    );
  }

  async login(): Promise<void> {
    await this.run(async () => {
      await this.api.session();
      const session = await this.api.login(this.email, this.password);
      this.password = '';
      this.user = session.user!.email;
      await this.loadDraft();
    });
  }
  async logout(): Promise<void> {
    if (
      this.dirty &&
      !(await this.askConfirmation({
        title: 'Abmelden?',
        message:
          'Ungespeicherte Änderungen werden verworfen. Möchten Sie sich trotzdem abmelden?',
        confirmLabel: 'Abmelden',
        tone: 'danger',
      }))
    )
      return;
    await this.run(async () => {
      await this.api.logout();
      this.closeProductEditor();
      this.user = '';
      this.content = null;
      this.dirty = false;
    });
  }
  async reload(): Promise<void> {
    if (
      this.dirty &&
      !(await this.askConfirmation({
        title: 'Änderungen verwerfen?',
        message:
          'Der aktuelle Entwurf wird durch die zuletzt gespeicherte Version ersetzt.',
        confirmLabel: 'Änderungen verwerfen',
        tone: 'danger',
      }))
    )
      return;
    await this.run(() => this.loadDraft());
  }
  async save(): Promise<void> {
    await this.run(async () => {
      await this.saveDraft();
      this.message =
        'Entwurf gespeichert. Die Website wird erst beim Veröffentlichen aktualisiert.';
    });
  }
  async publish(): Promise<void> {
    if (
      !(await this.askConfirmation({
        title: 'Änderungen veröffentlichen?',
        message:
          'Der gespeicherte Entwurf wird auf der öffentlichen Website sichtbar.',
        confirmLabel: 'Jetzt veröffentlichen',
      }))
    )
      return;
    await this.run(async () => {
      await this.saveDraft();
      const result = await this.api.publish(this.revision);
      this.revision = result.revision;
      this.message =
        'Veröffentlicht. Besucher sehen die Änderungen beim nächsten Laden der Website.';
    });
  }
  async preview(): Promise<void> {
    const preview = window.open('about:blank', '_blank');
    if (preview) preview.opener = null;
    const success = await this.run(async () => {
      await this.saveDraft();
      if (preview) preview.location.href = '/?preview=1';
      else
        this.message =
          'Entwurf gespeichert. Bitte Pop-ups für die Vorschau erlauben.';
    });
    if (!success) preview?.close();
  }
  exportDraft(): void {
    if (!this.content) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(this.content, null, 2)], {
        type: 'application/json',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mediterrano-entwurf.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  addProduct(): void {
    if (!this.content?.categories.length) {
      this.error = 'Bitte zuerst eine Kategorie anlegen.';
      return;
    }
    const product: Product = {
      id: 'product-' + crypto.randomUUID(),
      categoryId: this.content.categories[0].id,
      name: 'Neues Produkt',
      description: '',
      priceMode: 'fixed',
      priceCents: 0,
      image: '',
      imageAlt: '',
      visible: true,
      featured: false,
      deli: false,
      breakfast: false,
    };
    this.content.products.push(product);
    this.selectedProduct = product;
    this.dirty = true;
    this.openProductEditor();
  }
  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.openProductEditor();
  }
  selectTab(id: string): void {
    if (id !== 'products') this.closeProductEditor();
    this.tab = id;
  }
  closeProductEditor(): void {
    const dialog = this.productEditorDialog.nativeElement;
    if (dialog.open) dialog.close();
    this.selectedProduct = null;
  }
  cancelProductEditor(event: Event): void {
    event.preventDefault();
    this.closeProductEditor();
  }
  private openProductEditor(): void {
    const dialog = this.productEditorDialog.nativeElement;
    if (dialog.open) return;
    if (window.matchMedia('(max-width: 1050px)').matches) dialog.showModal();
    else dialog.show();
  }
  async removeProduct(product: Product): Promise<void> {
    if (
      !this.content ||
      !(await this.askConfirmation({
        title: 'Produkt entfernen?',
        message: `„${product.name}“ wird aus dem Entwurf entfernt. Die Änderung wird erst nach dem Speichern übernommen.`,
        confirmLabel: 'Produkt entfernen',
        tone: 'danger',
      }))
    )
      return;
    this.content.products = this.content.products.filter(
      (item) => item.id !== product.id,
    );
    this.closeProductEditor();
    this.dirty = true;
  }
  addCategory(): void {
    this.content?.categories.push({
      id: 'category-' + crypto.randomUUID(),
      title: 'Neue Kategorie',
      description: '',
      visible: true,
    });
    this.dirty = true;
  }
  async removeCategory(category: Category): Promise<void> {
    if (
      this.content?.products.some(
        (product) => product.categoryId === category.id,
      )
    ) {
      this.error =
        'Bitte die Produkte dieser Kategorie zuerst verschieben oder entfernen.';
      return;
    }
    if (
      !this.content ||
      !(await this.askConfirmation({
        title: 'Kategorie entfernen?',
        message: `„${category.title}“ wird aus dem Entwurf entfernt. Die Änderung wird erst nach dem Speichern übernommen.`,
        confirmLabel: 'Kategorie entfernen',
        tone: 'danger',
      }))
    )
      return;
    this.content.categories = this.content.categories.filter(
      (item) => item.id !== category.id,
    );
    this.dirty = true;
  }
  move<T>(items: T[], item: T, offset: number): void {
    const index = items.indexOf(item);
    const target = index + offset;
    if (index < 0 || target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    this.dirty = true;
  }
  setPrice(product: Product, value: number | null): void {
    product.priceCents =
      value === null ? null : Math.round(Number(value) * 100);
    this.dirty = true;
  }
  chooseProductImage(product: Product): void {
    this.imageProduct = product;
    this.imagePage = null;
    this.imageSetting = '';
    this.picker.nativeElement.showModal();
  }
  chooseSettingImage(key: string): void {
    this.imageProduct = null;
    this.imagePage = null;
    this.imageSetting = key;
    this.picker.nativeElement.showModal();
  }
  choosePageImage(page: ContentPage): void {
    this.imageProduct = null;
    this.imagePage = page;
    this.imageSetting = '';
    this.picker.nativeElement.showModal();
  }
  resolveConfirmation(confirmed: boolean): void {
    const resolve = this.confirmationResolver;
    if (!resolve) return;
    this.confirmationResolver = null;
    const dialog = this.confirmationDialog.nativeElement;
    if (dialog.open) dialog.close();
    resolve(confirmed);
  }
  cancelConfirmation(event: Event): void {
    event.preventDefault();
    this.resolveConfirmation(false);
  }
  dismissConfirmationOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget)
      this.resolveConfirmation(false);
  }
  selectImage(image: MediaItem): void {
    if (this.imageProduct) {
      this.imageProduct.image = image.path;
      this.imageProduct.imageAlt = image.alt;
    }
    if (this.imageSetting && this.content)
      this.content.settings[this.imageSetting] = image.path;
    if (this.imagePage) {
      const alt = image.alt
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
      const path = image.path
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;');
      this.imagePage.body += `\n<figure><img src="${path}" alt="${alt}" loading="lazy"></figure>`;
    }
    this.dirty = true;
    this.picker.nativeElement.close();
  }
  async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    await this.run(async () => {
      const result = await this.api.upload(file, this.uploadAlt);
      this.media.unshift(result.item);
      this.message = 'Bild hochgeladen und in der Mediathek verfügbar.';
      this.uploadAlt = '';
    });
    input.value = '';
  }

  private async loadDraft(): Promise<void> {
    const [draft, media] = await Promise.all([
      this.api.draft(),
      this.api.media(),
    ]);
    this.content = draft.content;
    this.revision = draft.revision;
    this.media = media.items;
    if (this.productEditorDialog?.nativeElement.open)
      this.productEditorDialog.nativeElement.close();
    this.selectedProduct = null;
    this.selectedPage = draft.content.pages[0];
    this.dirty = false;
  }
  private async saveDraft(): Promise<void> {
    if (!this.content) return;
    const result = await this.api.save(this.content, this.revision);
    // Keep editor references intact. The server validates and normalizes on each save.
    this.revision = result.revision;
    this.dirty = false;
  }
  private askConfirmation(
    confirmation: {
      title: string;
      message: string;
      confirmLabel: string;
      tone?: 'primary' | 'danger';
    },
  ): Promise<boolean> {
    if (this.confirmationResolver) return Promise.resolve(false);
    this.confirmation = {
      ...confirmation,
      tone: confirmation.tone ?? 'primary',
    };
    return new Promise((resolve) => {
      this.confirmationResolver = resolve;
      this.confirmationDialog.nativeElement.showModal();
    });
  }
  private async run(action: () => Promise<void>): Promise<boolean> {
    if (this.busy) return false;
    this.busy = true;
    this.error = '';
    this.message = '';
    try {
      await action();
      return true;
    } catch (error) {
      this.error =
        error instanceof HttpErrorResponse
          ? error.error?.message ||
            'Der Server ist nicht erreichbar. Bitte die API-Konfiguration prüfen.'
          : 'Die Aktion konnte nicht abgeschlossen werden.';
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        this.user
      ) {
        this.error +=
          ' Ihre Eingaben bleiben in dieser Ansicht. Melden Sie sich in einem zweiten Tab erneut an und speichern Sie dann hier.';
      }
      return false;
    } finally {
      this.busy = false;
    }
  }
}
