import { Component, computed, input } from '@angular/core';
import { ICONS, IconDef, IconName } from './icon-paths';

/** Inline SVG icon that takes its colour from the surrounding text, so it follows hover and theme colours. */
@Component({
  selector: 'app-icon',
  host: { class: 'icon' },
  template: `
    <svg
      [attr.viewBox]="def().viewBox ?? '0 0 24 24'"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.fill]="def().fill ? 'currentColor' : 'none'"
      [attr.stroke]="def().fill ? 'none' : 'currentColor'"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (d of def().paths; track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);

  protected readonly def = computed<IconDef>(() => ICONS[this.name()]);
}
