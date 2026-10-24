import { Component, ElementRef, HostListener, Injector, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { I18n, LANGUAGES, Lang } from './i18n/i18n';
import { Icon } from './icon';

/**
 * A custom dropdown instead of a native <select>, so the open list matches the site.
 * It follows the standard listbox keyboard pattern: arrows move, Enter or Space picks, Escape closes.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [Icon],
  template: `
    <div class="lang">
      <button
        #trigger
        type="button"
        class="lang-btn"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="i18n.t('lang.label') + ': ' + current().label"
        (click)="toggle()"
        (keydown)="onTriggerKey($event)"
      >
        <app-icon name="globe" [size]="18" />
        <span [attr.lang]="current().code">{{ current().label }}</span>
        <app-icon class="chev" name="chevron-down" [size]="14" />
      </button>

      @if (open()) {
        <ul
          #menu
          class="lang-menu"
          role="listbox"
          tabindex="-1"
          [attr.aria-label]="i18n.t('lang.label')"
          [attr.aria-activedescendant]="'lang-option-' + languages[active()].code"
          (keydown)="onMenuKey($event)"
        >
          @for (language of languages; track language.code; let i = $index) {
            <li
              role="option"
              [id]="'lang-option-' + language.code"
              [class.active]="i === active()"
              [attr.aria-selected]="language.code === i18n.lang()"
              (click)="choose(language.code)"
              (mouseenter)="active.set(i)"
            >
              <span class="lang-native" [attr.lang]="language.code">{{ language.label }}</span>
              <span class="lang-english">{{ language.english }}</span>
              @if (language.code === i18n.lang()) {
                <app-icon class="lang-check" name="check" [size]="18" />
              }
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class LanguageSwitcher {
  protected readonly i18n = inject(I18n);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly menu = viewChild<ElementRef<HTMLElement>>('menu');

  protected readonly languages = LANGUAGES;
  protected readonly open = signal(false);
  /** Index of the highlighted option while the list is open. */
  protected readonly active = signal(0);
  protected readonly current = computed(() => LANGUAGES.find((l) => l.code === this.i18n.lang()) ?? LANGUAGES[0]);

  protected toggle(): void {
    this.open() ? this.close() : this.openMenu();
  }

  private openMenu(): void {
    this.active.set(LANGUAGES.findIndex((l) => l.code === this.i18n.lang()));
    this.i18n.preloadFonts();
    this.open.set(true);
    // Move focus into the list so the arrow keys work straight away.
    afterNextRender(() => this.menu()?.nativeElement.focus(), { injector: this.injector });
  }

  private close(returnFocus = false): void {
    this.open.set(false);
    if (returnFocus) this.trigger()?.nativeElement.focus();
  }

  protected choose(code: Lang): void {
    this.i18n.setLang(code);
    this.close(true);
  }

  protected onTriggerKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open()) this.openMenu();
    }
  }

  protected onMenuKey(event: KeyboardEvent): void {
    const last = LANGUAGES.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        this.active.update((i) => Math.min(i + 1, last));
        break;
      case 'ArrowUp':
        this.active.update((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        this.active.set(0);
        break;
      case 'End':
        this.active.set(last);
        break;
      case 'Enter':
      case ' ':
        this.choose(LANGUAGES[this.active()].code);
        break;
      case 'Escape':
        this.close(true);
        break;
      case 'Tab':
        this.close();
        return;
      default:
        return;
    }
    event.preventDefault();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }
}
