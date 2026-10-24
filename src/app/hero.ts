import { Component, inject } from '@angular/core';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';

interface Route {
  /** SVG path on the 520 x 560 map. Every route starts at the Bengaluru hub, except the last, which continues from Chennai. */
  d: string;
  /** The main route is drawn in marigold, the others in a lighter teal. */
  main?: boolean;
  /** Seconds before the route starts drawing. */
  delay: number;
}

interface Stop {
  /** The shown name is in the translation files under city.<key>. */
  city: string;
  x: number;
  y: number;
  /** Where the label sits relative to the dot, and which side it grows from. */
  dx: number;
  dy: number;
  anchor: 'start' | 'middle' | 'end';
  kind: 'hub' | 'main' | 'end' | 'side';
  delay: number;
}

// A schematic map, not to scale: north is up, the west coast is on the left.
const ROUTES: Route[] = [
  // Bengaluru, Mysuru, Ooty, Munnar, Kochi
  { d: 'M280 230 C262 255 240 275 230 300 S228 345 235 370 S250 415 255 440 S225 480 190 495', main: true, delay: 0 },
  // Coorg
  { d: 'M280 230 C245 232 200 252 165 285', delay: 0.9 },
  // Hampi
  { d: 'M280 230 C288 190 258 155 230 120', delay: 1.2 },
  // Gokarna, then Goa
  { d: 'M280 230 C232 212 172 178 120 150 S98 118 95 95', delay: 1.5 },
  // Tirupati, then Chennai
  { d: 'M280 230 C312 246 336 256 365 262 S415 272 445 262', delay: 1.8 },
  // Chennai on to Rameswaram
  { d: 'M445 262 C456 340 424 430 370 500', delay: 2.3 },
];

const STOPS: Stop[] = [
  { city: 'bengaluru', x: 280, y: 230, dx: 16, dy: -12, anchor: 'start', kind: 'hub', delay: 0.1 },
  { city: 'mysuru', x: 230, y: 300, dx: 14, dy: 5, anchor: 'start', kind: 'main', delay: 0.6 },
  { city: 'ooty', x: 235, y: 370, dx: 14, dy: 5, anchor: 'start', kind: 'main', delay: 1.0 },
  { city: 'munnar', x: 255, y: 440, dx: 14, dy: 5, anchor: 'start', kind: 'main', delay: 1.5 },
  { city: 'kochi', x: 190, y: 495, dx: -14, dy: 5, anchor: 'end', kind: 'end', delay: 2.0 },
  { city: 'coorg', x: 165, y: 285, dx: -13, dy: 5, anchor: 'end', kind: 'side', delay: 1.6 },
  { city: 'hampi', x: 230, y: 120, dx: 14, dy: 5, anchor: 'start', kind: 'side', delay: 1.9 },
  { city: 'gokarna', x: 120, y: 150, dx: -13, dy: 5, anchor: 'end', kind: 'side', delay: 2.1 },
  { city: 'goa', x: 95, y: 95, dx: 14, dy: 5, anchor: 'start', kind: 'side', delay: 2.4 },
  { city: 'tirupati', x: 365, y: 262, dx: 0, dy: 26, anchor: 'middle', kind: 'side', delay: 2.4 },
  { city: 'chennai', x: 445, y: 262, dx: 0, dy: 26, anchor: 'middle', kind: 'side', delay: 2.6 },
  { city: 'rameswaram', x: 370, y: 500, dx: -14, dy: 5, anchor: 'end', kind: 'side', delay: 3.0 },
];

@Component({
  selector: 'app-hero',
  imports: [Icon],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <h1>{{ t('hero.title') }}</h1>
        <p class="lede">{{ t('hero.lede') }}</p>
        <div class="hero-actions">
          <a class="btn" href="#fleet">{{ t('hero.cta.buses') }}</a>
          <a class="btn btn-ghost" href="#enquire">{{ t('hero.cta.quote') }}</a>
        </div>
        <ul class="hero-facts">
          <li><app-icon name="bus" /><span><strong>{{ t('hero.f1.strong') }}</strong>{{ t('hero.f1.rest') }}</span></li>
          <li><app-icon name="shield-check" /><span><strong>{{ t('hero.f2.strong') }}</strong>{{ t('hero.f2.rest') }}</span></li>
          <li><app-icon name="headset" /><span><strong>{{ t('hero.f3.strong') }}</strong>{{ t('hero.f3.rest') }}</span></li>
        </ul>
      </div>

      <figure class="route" [attr.aria-label]="t('hero.route.label')">
        <svg viewBox="0 0 520 560" role="img" aria-hidden="true">
          <defs>
            <pattern id="route-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".07" /></pattern>
            <!-- One mask draws every route in turn: each white line is revealed along its own length. -->
            <mask id="reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="560">
              @for (route of routes; track $index) {
                <path class="reveal" [attr.d]="route.d" [style.animation-delay.s]="route.delay"
                      fill="none" stroke="#fff" stroke-width="12" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" />
              }
            </mask>
          </defs>
          <rect width="520" height="560" fill="url(#route-grid)" />
          <g mask="url(#reveal)">
            @for (route of routes; track $index) {
              <path [attr.d]="route.d" fill="none" stroke-linecap="round"
                    [attr.stroke]="route.main ? '#F2A93B' : '#8FC9C4'"
                    [attr.stroke-width]="route.main ? 5 : 4"
                    [attr.stroke-dasharray]="route.main ? '0.1 14' : '0.1 12'" />
            }
          </g>
          <g class="stops" fill="#F4F7F6">
            @for (stop of stops; track stop.city) {
              <g [style.animation-delay.s]="stop.delay">
                <circle [attr.cx]="stop.x" [attr.cy]="stop.y" stroke-width="3"
                        [attr.r]="stop.kind === 'hub' ? 10 : stop.kind === 'side' ? 6 : 7"
                        [attr.fill]="stop.kind === 'hub' ? '#F2A93B' : stop.kind === 'end' ? '#E2573D' : '#0D3B42'"
                        [attr.stroke]="stop.kind === 'hub' || stop.kind === 'main' ? '#F2A93B' : stop.kind === 'end' ? '#E2573D' : '#8FC9C4'" />
                <text [attr.x]="stop.x + stop.dx" [attr.y]="stop.y + stop.dy" [attr.text-anchor]="stop.anchor"
                      [attr.font-size]="stop.kind === 'hub' ? 19 : 16" [attr.font-weight]="stop.kind === 'hub' ? 700 : 500">{{ t('city.' + stop.city) }}</text>
              </g>
            }
          </g>
        </svg>
        <figcaption>{{ t('hero.route.caption') }}</figcaption>
      </figure>
    </section>
  `,
})
export class Hero {
  protected readonly t = inject(I18n).t;
  protected readonly routes = ROUTES;
  protected readonly stops = STOPS;
}
