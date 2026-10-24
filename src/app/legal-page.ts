import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CONTACT } from './data/contact';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';

/** The text of both pages changes only when the policy changes, so the date is set here, not by the clock. */
const LAST_UPDATED = '2026-10-24';

const DATE_LOCALE = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN' } as const;

/**
 * One layout for the privacy policy and the terms page.
 * The route says which one (data.doc), and every word comes from the translation files:
 *   privacy: priv.title, priv.<n>.h, priv.<n>.p        terms: terms.title, t.<n>.h, t.<n>.p
 */
@Component({
  selector: 'app-legal-page',
  imports: [RouterLink, Icon],
  template: `
    <main class="legal" id="top" tabindex="-1">
      <a class="legal-back" routerLink="/"><app-icon name="arrow-left" [size]="18" />{{ t('lg.back') }}</a>
      <h1>{{ t(titleKey) }}</h1>
      <p class="legal-updated">{{ t('lg.updated', { date: date() }) }}</p>

      @for (n of sections; track n) {
        <section>
          <h2>{{ t(prefix + '.' + n + '.h') }}</h2>
          <p>{{ t(prefix + '.' + n + '.p') }}</p>
          @if (doc === 'terms' && n === 5) {
            <table class="legal-table">
              <thead>
                <tr><th scope="col">{{ t('t.slab.when') }}</th><th scope="col">{{ t('t.slab.fee') }}</th></tr>
              </thead>
              <tbody>
                @for (row of slabs; track row) {
                  <tr><td>{{ t('t.slab.' + row + '.when') }}</td><td>{{ t('t.slab.' + row + '.fee') }}</td></tr>
                }
              </tbody>
            </table>
            <p>{{ t('t.5.after') }}</p>
          }
        </section>
      }

      <section>
        <h2>{{ t('lg.contact') }}</h2>
        <dl class="contact">
          <dt><app-icon name="phone" [size]="18" />{{ t('ct.phone') }}</dt>
          <dd><a [href]="'tel:' + contact.phoneTel">{{ contact.phoneDisplay }}</a></dd>
          <dt><app-icon name="mail" [size]="18" />{{ t('ct.email') }}</dt>
          <dd><a [href]="'mailto:' + contact.email">{{ contact.email }}</a></dd>
          <dt><app-icon name="map-pin" [size]="18" />{{ t('ct.office') }}</dt>
          <dd>{{ t('ct.address') }}</dd>
        </dl>
      </section>
    </main>
  `,
})
export class LegalPage {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly contact = CONTACT;

  protected readonly doc: 'priv' | 'terms' = inject(ActivatedRoute).snapshot.data['doc'];
  protected readonly isPrivacy = this.doc === 'priv';
  protected readonly prefix = this.isPrivacy ? 'priv' : 't';
  protected readonly titleKey = this.isPrivacy ? 'priv.title' : 'terms.title';
  protected readonly sections = Array.from({ length: this.isPrivacy ? 11 : 9 }, (_, i) => i + 1);
  protected readonly slabs = [1, 2, 3, 4];

  protected readonly date = computed(() =>
    new Date(`${LAST_UPDATED}T00:00:00`).toLocaleDateString(DATE_LOCALE[this.i18n.lang()], { day: 'numeric', month: 'long', year: 'numeric' }),
  );

  constructor() {
    this.i18n.setPage(this.isPrivacy ? 'priv.meta' : 'terms.meta', this.isPrivacy ? '/privacy' : '/terms');
  }
}
