import { Component, inject, signal } from '@angular/core';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';
import { LanguageSwitcher } from './language-switcher';

@Component({
  selector: 'app-site-header',
  imports: [Icon, LanguageSwitcher],
  template: `
    <header class="site-header">
      <a class="brand" href="/" [attr.aria-label]="t('nav.home')">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="#F2A93B" />
          <path d="M7 21c4-9 8-9 9-9s5 0 9 9" fill="none" stroke="#0D3B42" stroke-width="2.4" stroke-linecap="round" />
          <circle cx="16" cy="12" r="2.2" fill="#0D3B42" />
        </svg>
        <span>{{ t('brand.name') }}<small>{{ t('brand.sub') }}</small></span>
      </a>
      <app-language-switcher />
      <button class="nav-toggle" type="button" [attr.aria-expanded]="menuOpen()" aria-controls="nav" (click)="menuOpen.set(!menuOpen())">
        <app-icon [name]="menuOpen() ? 'close' : 'menu'" [size]="18" />
        <span class="nav-toggle-label">{{ t('nav.menu') }}</span>
      </button>
      <nav id="nav" class="nav" [attr.aria-label]="t('nav.main')" [class.open]="menuOpen()" (click)="onNavClick($event)">
        <a href="/#fleet">{{ t('nav.buses') }}</a>
        <a href="/#packages">{{ t('nav.packages') }}</a>
        <a href="/#services">{{ t('nav.services') }}</a>
        <a href="/#how">{{ t('nav.how') }}</a>
        <a href="/#contact">{{ t('nav.contact') }}</a>
        <a class="btn btn-small" href="/#enquire"><app-icon name="route" [size]="17" />{{ t('nav.plan') }}</a>
      </nav>
    </header>
  `,
})
export class SiteHeader {
  protected readonly t = inject(I18n).t;
  protected readonly menuOpen = signal(false);

  protected onNavClick(event: Event): void {
    if ((event.target as HTMLElement).closest('a')) this.menuOpen.set(false);
  }
}
