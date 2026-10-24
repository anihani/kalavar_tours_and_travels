import { Component, inject } from '@angular/core';
import { CONTACT, GREETING_LINK } from './data/contact';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';

/**
 * Quick ways to reach the business from anywhere on the page.
 * On desktop it is a single floating WhatsApp button. On phones it becomes a bar pinned
 * to the bottom with Call and WhatsApp side by side, so a visitor is always one tap from a conversation.
 */
@Component({
  selector: 'app-contact-dock',
  imports: [Icon],
  template: `
    <div class="contact-dock">
      <a class="dock-btn dock-call" [href]="'tel:' + contact.phoneTel" [attr.aria-label]="t('dock.call.aria', { phone: contact.phoneDisplay })">
        <app-icon name="phone" [size]="20" />
        <span>{{ t('dock.call') }}</span>
      </a>
      <a class="dock-btn dock-wa" [href]="whatsapp" target="_blank" rel="noopener" [attr.aria-label]="t('wa.aria')">
        <app-icon name="whatsapp" [size]="22" />
        <span class="dock-long">{{ t('wa.label') }}</span>
        <span class="dock-short">{{ t('ct.whatsapp') }}</span>
      </a>
    </div>
  `,
})
export class ContactDock {
  protected readonly t = inject(I18n).t;
  protected readonly contact = CONTACT;
  protected readonly whatsapp = GREETING_LINK;
}
