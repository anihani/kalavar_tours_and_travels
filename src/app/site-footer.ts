import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from './data/contact';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';

@Component({
  selector: 'app-site-footer',
  imports: [Icon, RouterLink],
  template: `
    <footer class="site-footer">
      <p><strong>{{ t('brand.full') }}</strong></p>
      <p>{{ t('ft.tagline') }}</p>
      <p class="line"><app-icon name="map-pin" [size]="18" />{{ t('ct.address') }}</p>
      <p class="line"><app-icon name="phone" [size]="18" /><a [href]="'tel:' + contact.phoneTel">{{ contact.phoneDisplay }}</a></p>
      <nav class="footer-links" [attr.aria-label]="t('lg.privacy') + ', ' + t('lg.terms')">
        <a routerLink="/privacy">{{ t('lg.privacy') }}</a>
        <a routerLink="/terms">{{ t('lg.terms') }}</a>
      </nav>
      <p class="fine">{{ t('ft.rights', { year }) }}</p>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly t = inject(I18n).t;
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();
}
