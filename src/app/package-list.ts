import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TripType } from './data/models';
import { PACKAGES, TRIP_TYPES } from './data/packages';
import { EnquiryState } from './enquiry-state';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';
import { IconName } from './icon-paths';
import { SceneArt } from './scene-art';

type Filter = 'all' | TripType;

const FILTER_ICON: Record<Filter, IconName> = {
  all: 'compass',
  hills: 'mountain',
  beach: 'sun-wave',
  heritage: 'landmark',
  wildlife: 'tree',
  pilgrimage: 'temple',
};

@Component({
  selector: 'app-package-list',
  imports: [DecimalPipe, SceneArt, Icon],
  template: `
    <section class="section" id="packages">
      <div class="section-head">
        <h2>{{ t('pk.title') }}</h2>
        <p>{{ t('pk.intro') }}</p>
      </div>
      <div class="filters" role="group" [attr.aria-label]="t('pk.filter.aria')">
        @for (key of filters; track key) {
          <button type="button" class="chip" [attr.aria-pressed]="active() === key" (click)="active.set(key)">
            <app-icon [name]="icon[key]" [size]="18" />{{ key === 'all' ? t('pk.all') : t('type.' + key) }}
          </button>
        }
      </div>
      <div class="grid" aria-live="polite">
        @for (pkg of shown(); track pkg.id) {
          <article class="card">
            <app-scene-art class="card-art" [type]="pkg.type" />
            <div class="card-body">
              <h3>{{ t('pkg.' + pkg.id + '.name') }}</h3>
              <p class="meta">
                <span>
                  <app-icon name="clock" [size]="16" />{{ t(pkg.nights === 1 ? 'pk.duration1' : 'pk.duration', { days: pkg.days, nights: pkg.nights }) }}
                </span>
                <span><app-icon name="map-pin" [size]="16" />{{ t('pk.pickup', { city: t('city.' + pkg.from) }) }}</span>
              </p>
              <p class="blurb">{{ t('pkg.' + pkg.id + '.blurb') }}</p>
              <div class="card-foot">
                <p class="price">₹{{ pkg.price | number }}<small>{{ t('pk.per') }}</small></p>
                <a class="btn" href="#enquire" [attr.aria-label]="t('pk.enquire.aria', { name: t('pkg.' + pkg.id + '.name') })" (click)="state.pickPackage(pkg.id)">
                  {{ t('pk.enquire') }}
                </a>
              </div>
            </div>
          </article>
        } @empty {
          <p class="empty">{{ t('pk.empty') }}</p>
        }
      </div>
    </section>
  `,
})
export class PackageList {
  protected readonly t = inject(I18n).t;
  protected readonly state = inject(EnquiryState);
  protected readonly icon = FILTER_ICON;
  protected readonly filters: Filter[] = ['all', ...TRIP_TYPES];
  protected readonly active = signal<Filter>('all');
  protected readonly shown = computed(() => PACKAGES.filter((p) => this.active() === 'all' || p.type === this.active()));
}
