import { Component, inject } from '@angular/core';
import { BusArt } from './bus-art';
import { BUSES } from './data/buses';
import { EnquiryState } from './enquiry-state';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';

@Component({
  selector: 'app-fleet',
  imports: [BusArt, Icon],
  template: `
    <section class="section" id="fleet">
      <div class="section-head">
        <h2>{{ t('fleet.title') }}</h2>
        <p>{{ t('fleet.intro') }}</p>
      </div>
      <div class="fleet">
        @for (bus of buses; track bus.id) {
          <article class="bus-card">
            <div class="bus-art"><app-bus-art [bus]="bus" /></div>
            <div class="bus-body">
              <h3>{{ bus.name }}</h3>
              <p class="seats">{{ bus.seats }}<small>{{ t('fleet.seats') }}</small></p>
              <p class="bus-type">
                <app-icon name="users" [size]="16" />{{ t('fleet.type', { seats: bus.seats, kind: t('kind.' + bus.kind) }) }}
              </p>
              <ul class="bus-feats">
                @for (n of featureNumbers; track n) {
                  <li>{{ t('bus.' + bus.id + '.f' + n) }}</li>
                }
              </ul>
              <div class="bus-foot">
                <p class="price">{{ t('fleet.from', { rate: bus.rate }) }}<small>{{ t('fleet.perkm') }}</small></p>
                <a class="btn" href="#enquire" [attr.aria-label]="t('fleet.hire.aria', { name: bus.name })" (click)="state.pickBus(bus.id)">{{ t('fleet.hire') }}</a>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class Fleet {
  protected readonly t = inject(I18n).t;
  protected readonly buses = BUSES;
  protected readonly featureNumbers = [1, 2, 3];
  protected readonly state = inject(EnquiryState);
}
