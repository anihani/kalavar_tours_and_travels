import { Component, computed, inject, input } from '@angular/core';
import { Bus } from './data/models';
import { I18n } from './i18n/i18n';

/** Side view of a bus. Longer buses get more windows, so the size difference is visible. */
@Component({
  selector: 'app-bus-art',
  template: `
    <svg viewBox="0 0 320 130" role="img" [attr.aria-label]="label()">
      <rect x="10" y="14" [attr.width]="shape().width" height="76" rx="14" [attr.fill]="bus().color" />
      @for (x of shape().windowXs; track $index) {
        <rect [attr.x]="x" y="26" [attr.width]="shape().windowWidth" height="30" rx="4" fill="#CFE8E6" />
      }
      <path [attr.d]="shape().cabin" fill="#CFE8E6" />
      <rect x="10" y="66" [attr.width]="shape().width" height="6" fill="#0D3B42" opacity=".25" />
      <rect [attr.x]="shape().width + 6" y="70" width="8" height="10" rx="2" fill="#FBE29A" />
      @for (cx of shape().wheelXs; track $index) {
        <circle [attr.cx]="cx" cy="92" r="14" fill="#082A30" />
        <circle [attr.cx]="cx" cy="92" r="5.5" fill="#CFE0DE" />
      }
      <rect x="0" y="108" width="320" height="3" rx="1.5" fill="#fff" opacity=".12" />
    </svg>
  `,
})
export class BusArt {
  private readonly t = inject(I18n).t;
  readonly bus = input.required<Bus>();

  protected readonly label = computed(() => {
    const { name, seats, kind } = this.bus();
    return `${name}, ${this.t('fleet.type', { seats, kind: this.t('kind.' + kind) })}`;
  });

  protected readonly shape = computed(() => {
    const { seats } = this.bus();
    const width = Math.round(200 + (seats - 18) * 3.2); // 200 for the smallest bus, ~299 for 49 seats
    const windowCount = Math.round(seats / 6) + 1;
    const gap = (width - 70) / windowCount;
    return {
      width,
      windowWidth: gap - 8,
      windowXs: Array.from({ length: windowCount }, (_, i) => 24 + i * gap),
      wheelXs: [width * 0.2 + 10, width - 36],
      cabin: `M${width - 38} 26 h40 a10 10 0 0 1 10 10 v20 h-50Z`,
    };
  });
}
