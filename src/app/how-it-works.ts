import { Component, inject } from '@angular/core';
import { I18n } from './i18n/i18n';

@Component({
  selector: 'app-how-it-works',
  template: `
    <section class="section" id="how">
      <div class="section-head">
        <h2>{{ t('how.title') }}</h2>
      </div>
      <ol class="steps">
        @for (n of steps; track n) {
          <li>
            <h3>{{ t('how.' + n + '.title') }}</h3>
            <p>{{ t('how.' + n + '.text') }}</p>
          </li>
        }
      </ol>
    </section>
  `,
})
export class HowItWorks {
  protected readonly t = inject(I18n).t;
  protected readonly steps = [1, 2, 3, 4];
}
