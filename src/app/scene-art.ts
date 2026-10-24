import { Component, computed, input } from '@angular/core';
import { TripType } from './data/models';

const SKY: Record<TripType, [string, string]> = {
  hills: ['#BFE3E0', '#F6E7C1'],
  beach: ['#FBD9A8', '#FDF1DA'],
  heritage: ['#F7D6A5', '#FBEBCF'],
  wildlife: ['#CFE8C8', '#F4F1CF'],
  pilgrimage: ['#F6C98E', '#FCE8C8'],
};

/** Small illustrated scene per trip type, so cards work without photos. The host element carries the sky gradient. */
@Component({
  selector: 'app-scene-art',
  host: { '[style.background]': 'sky()' },
  template: `
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      @switch (type()) {
        @case ('hills') {
          <circle cx="260" cy="42" r="16" fill="#F2A93B" />
          <path d="M0 150 L70 70 L120 120 L180 55 L260 135 L320 90 V180 H0Z" fill="#2B8C8C" />
          <path d="M0 165 L60 115 L130 150 L210 100 L320 160 V180 H0Z" fill="#0D3B42" />
        }
        @case ('beach') {
          <circle cx="200" cy="82" r="24" fill="#E2573D" />
          <rect y="96" width="320" height="84" fill="#2B8C8C" />
          <path d="M0 112 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V130 H0Z" fill="#3FA3A0" />
          <path d="M0 150 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 V180 H0Z" fill="#F2D49A" />
        }
        @case ('heritage') {
          <rect x="40" y="110" width="240" height="70" fill="#0D3B42" />
          <path d="M70 180 V120 a22 22 0 0 1 44 0 V180Z M138 180 V120 a22 22 0 0 1 44 0 V180Z M206 180 V120 a22 22 0 0 1 44 0 V180Z" fill="#F2A93B" />
          <path d="M150 110 L160 40 L170 110Z" fill="#E2573D" />
          <rect x="40" y="104" width="240" height="8" fill="#082A30" />
        }
        @case ('wildlife') {
          <circle cx="70" cy="46" r="18" fill="#F2A93B" />
          <rect y="130" width="320" height="50" fill="#2F6F4F" />
          <g fill="#0D3B42">
            <rect x="214" y="60" width="9" height="76" />
            <ellipse cx="218" cy="56" rx="36" ry="26" />
            <rect x="270" y="86" width="7" height="50" />
            <ellipse cx="273" cy="84" rx="24" ry="18" />
          </g>
          <path d="M0 150 q10 -16 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V180 H0Z" fill="#245A40" />
        }
        @case ('pilgrimage') {
          <path d="M110 180 V140 H210 V180Z" fill="#0D3B42" />
          <path d="M122 140 V112 H198 V140Z" fill="#164F57" />
          <path d="M136 112 V88 H184 V112Z" fill="#0D3B42" />
          <path d="M148 88 V68 H172 V88Z" fill="#164F57" />
          <path d="M160 68 L160 40" stroke="#F2A93B" stroke-width="3" />
          <path d="M160 40 l14 6 l-14 6Z" fill="#E2573D" />
          <rect x="152" y="152" width="16" height="28" fill="#F2A93B" />
        }
      }
    </svg>
  `,
})
export class SceneArt {
  readonly type = input.required<TripType>();

  protected readonly sky = computed(() => {
    const [top, bottom] = SKY[this.type()];
    return `linear-gradient(${top}, ${bottom})`;
  });
}
