import { Component, inject } from '@angular/core';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';
import { IconName } from './icon-paths';

@Component({
  selector: 'app-services',
  imports: [Icon],
  template: `
    <section class="section band" id="services">
      <div class="section-head">
        <h2>{{ t('sv.title') }}</h2>
        <p>{{ t('sv.intro') }}</p>
      </div>
      <div class="services">
        @for (service of services; track service.n) {
          <article>
            <span class="service-icon"><app-icon [name]="service.icon" [size]="24" /></span>
            <h3>{{ t('sv.' + service.n + '.title') }}</h3>
            <p>{{ t('sv.' + service.n + '.text') }}</p>
          </article>
        }
      </div>
    </section>
  `,
})
export class Services {
  protected readonly t = inject(I18n).t;
  protected readonly services: { n: number; icon: IconName }[] = [
    { n: 1, icon: 'bus' },
    { n: 2, icon: 'compass' },
    { n: 3, icon: 'briefcase' },
    { n: 4, icon: 'bed' },
  ];
}
