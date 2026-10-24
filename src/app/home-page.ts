import { Component, inject } from '@angular/core';
import { EnquiryForm } from './enquiry-form';
import { Fleet } from './fleet';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { I18n } from './i18n/i18n';
import { PackageList } from './package-list';
import { Services } from './services';

@Component({
  selector: 'app-home-page',
  imports: [Hero, Fleet, PackageList, Services, HowItWorks, EnquiryForm],
  template: `
    <main id="top" tabindex="-1">
      <app-hero />
      <app-fleet />
      <app-package-list />
      <app-services />
      <app-how-it-works />
      <app-enquiry-form />
    </main>
  `,
})
export class HomePage {
  constructor() {
    inject(I18n).setPage('meta', '/');
  }
}
