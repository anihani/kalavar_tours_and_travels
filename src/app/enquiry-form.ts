import { Component, ElementRef, Injector, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { BUSES } from './data/buses';
import { CONTACT, GREETING_LINK, whatsappLink } from './data/contact';
import { PACKAGES } from './data/packages';
import { EnquiryState } from './enquiry-state';
import { I18n } from './i18n/i18n';
import { Icon } from './icon';

type Field = 'name' | 'phone' | 'destination' | 'date' | 'people';

/** Today as yyyy-mm-dd in the visitor's own time zone (toISOString would use UTC and be a day behind before 5:30 am in India). */
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const nameValidator: ValidatorFn = (c) => (String(c.value ?? '').trim().length < 2 ? { name: true } : null);
const phoneValidator: ValidatorFn = (c) => (String(c.value ?? '').replace(/\D/g, '').length < 10 ? { phone: true } : null);
const dateValidator: ValidatorFn = (c) => (!c.value ? { required: true } : c.value < localToday() ? { past: true } : null);

/** Form-level rule: the chosen bus must have enough seats for the group. */
const busCapacityValidator: ValidatorFn = (group): ValidationErrors | null => {
  const bus = BUSES.find((b) => b.id === group.get('bus')?.value);
  return bus && Number(group.get('people')?.value) > bus.seats ? { busCapacity: { name: bus.name, seats: bus.seats } } : null;
};

@Component({
  selector: 'app-enquiry-form',
  imports: [ReactiveFormsModule, RouterLink, Icon],
  template: `
    <section class="section enquire" id="enquire">
      <div class="enquire-intro">
        <h2>{{ t('eq.title') }}</h2>
        <p>{{ t('eq.intro') }}</p>
        <dl class="contact" id="contact">
          <dt><app-icon name="phone" [size]="18" />{{ t('ct.phone') }}</dt>
          <dd><a [href]="'tel:' + contact.phoneTel">{{ contact.phoneDisplay }}</a></dd>
          <dt><app-icon name="whatsapp" [size]="18" />{{ t('ct.whatsapp') }}</dt>
          <dd><a [href]="greetingLink" target="_blank" rel="noopener">{{ t('ct.chat') }}</a></dd>
          <dt><app-icon name="mail" [size]="18" />{{ t('ct.email') }}</dt>
          <dd><a [href]="'mailto:' + contact.email">{{ contact.email }}</a></dd>
          <dt><app-icon name="map-pin" [size]="18" />{{ t('ct.office') }}</dt>
          <dd>
            {{ t('ct.address') }}<br />
            <a [href]="contact.mapsUrl" target="_blank" rel="noopener">{{ t('ct.maps') }}</a><br />
            {{ t('ct.hours') }}
          </dd>
        </dl>
      </div>

      <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="field" [class.invalid]="error('name')">
          <label for="name">{{ t('f.name') }}</label>
          <input id="name" formControlName="name" autocomplete="name" [attr.aria-invalid]="error('name') ? true : null" />
          <p class="error">{{ error('name') }}</p>
        </div>
        <div class="field" [class.invalid]="error('phone')">
          <label for="phone">{{ t('f.phone') }}</label>
          <input id="phone" formControlName="phone" type="tel" inputmode="tel" autocomplete="tel" [attr.aria-invalid]="error('phone') ? true : null" />
          <p class="error">{{ error('phone') }}</p>
        </div>
        <div class="field full" [class.invalid]="error('destination')">
          <label for="destination">{{ t('f.dest') }}</label>
          <select id="destination" formControlName="destination" [attr.aria-invalid]="error('destination') ? true : null">
            <option value="">{{ t('f.dest.choose') }}</option>
            @for (pkg of packages; track pkg.id) {
              <option [value]="pkg.id">{{ t('pkg.' + pkg.id + '.name') }}</option>
            }
            <option value="custom">{{ t('f.dest.custom') }}</option>
          </select>
          <p class="error">{{ error('destination') }}</p>
        </div>
        <div class="field full" [class.invalid]="busError()">
          <label for="bus">{{ t('f.bus') }}</label>
          <select id="bus" formControlName="bus" [attr.aria-invalid]="busError() ? true : null">
            <option value="">{{ t('f.bus.suggest') }}</option>
            @for (bus of buses; track bus.id) {
              <option [value]="bus.id">{{ t('f.bus.option', { name: bus.name, seats: bus.seats }) }}</option>
            }
          </select>
          <p class="hint">{{ busHint() }}</p>
          <p class="error">{{ busError() }}</p>
        </div>
        <div class="field" [class.invalid]="error('date')">
          <label for="date">{{ t('f.date') }}</label>
          <input id="date" formControlName="date" type="date" [min]="today" [attr.aria-invalid]="error('date') ? true : null" />
          <p class="error">{{ error('date') }}</p>
        </div>
        <div class="field" [class.invalid]="error('people')">
          <label for="people">{{ t('f.people') }}</label>
          <input id="people" formControlName="people" type="number" min="1" max="60" [attr.aria-invalid]="error('people') ? true : null" />
          <p class="error">{{ error('people') }}</p>
        </div>
        <div class="field full">
          <label for="notes">{{ t('f.notes') }} <span class="optional">{{ t('f.optional') }}</span></label>
          <textarea id="notes" formControlName="notes" rows="3"></textarea>
        </div>
        <div class="form-actions full">
          <button class="btn" type="submit">{{ t('f.submit') }}</button>
          <p class="form-note">{{ t('f.note') }}</p>
          <p class="form-consent">
            @for (part of consentParts(); track $index) {
              @switch (part) {
                @case ('{privacy}') { <a routerLink="/privacy" target="_blank">{{ t('lg.privacy') }}</a> }
                @case ('{terms}') { <a routerLink="/terms" target="_blank">{{ t('lg.terms') }}</a> }
                @default { {{ part }} }
              }
            }
          </p>
        </div>
        @if (confirmation(); as c) {
          <div class="confirm full" #confirmBox tabindex="-1" role="status">
            <p class="confirm-title">
              <app-icon name="check-circle" [size]="22" />
              <strong>{{ t('c.thanks', { name: c.name, trip: c.packageId ? t('pkg.' + c.packageId + '.name') : t('trip.custom') }) }}</strong>
            </p>
            <p><a [href]="c.url" target="_blank" rel="noopener">{{ t('c.send') }}</a>{{ t('c.rest') }}</p>
          </div>
        }
      </form>
    </section>
  `,
})
export class EnquiryForm {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly state = inject(EnquiryState);

  protected readonly t = inject(I18n).t;
  protected readonly contact = CONTACT;
  protected readonly greetingLink = GREETING_LINK;
  protected readonly packages = PACKAGES;
  protected readonly buses = BUSES;
  protected readonly today = localToday();

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      name: ['', nameValidator],
      phone: ['', phoneValidator],
      destination: ['', Validators.required],
      bus: [''],
      date: ['', dateValidator],
      people: [2, [Validators.required, Validators.min(1), Validators.max(60)]],
      notes: [''],
    },
    { validators: busCapacityValidator },
  );

  /** The consent sentence split around its {privacy} and {terms} placeholders, so each can become a link in any word order. */
  protected readonly consentParts = computed(() => this.t('f.consent').split(/(\{privacy\}|\{terms\})/));

  private readonly submitted = signal(false);
  protected readonly confirmation = signal<{ name: string; packageId: string | null; url: string } | null>(null);
  private readonly confirmBox = viewChild<ElementRef<HTMLElement>>('confirmBox');

  private readonly values = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue(),
  });

  /** Tells the visitor right away whether their group fits the chosen bus. */
  protected readonly busHint = computed(() => {
    const { bus: busId, people } = this.values();
    const n = Number(people);
    const bus = BUSES.find((b) => b.id === busId);
    if (bus) {
      const spare = bus.seats - n;
      if (n > bus.seats) return this.t('h.toosmall', { name: bus.name, seats: bus.seats });
      return spare === 1
        ? this.t('h.spare1', { name: bus.name, seats: bus.seats })
        : this.t('h.spareN', { name: bus.name, seats: bus.seats, spare });
    }
    const smallestFirst = [...BUSES].sort((a, b) => a.seats - b.seats);
    const fit = smallestFirst.find((b) => b.seats >= n);
    if (n > 0 && fit) return this.t('h.suggest', { n, name: fit.name, seats: fit.seats });
    const biggest = smallestFirst[smallestFirst.length - 1].seats;
    if (n > biggest) return this.t('h.two', { n, seats: biggest });
    return this.t('h.default');
  });

  constructor() {
    // Cards elsewhere on the page pre-fill the form through the shared state.
    effect(() => {
      const pick = this.state.packagePick();
      if (pick) this.form.controls.destination.setValue(pick.id);
    });
    effect(() => {
      const pick = this.state.busPick();
      if (pick) this.form.controls.bus.setValue(pick.id);
    });
  }

  private shouldShow(field: Field | 'bus'): boolean {
    const control = this.form.controls[field];
    return this.submitted() || control.touched || control.dirty;
  }

  protected error(field: Field): string {
    const control = this.form.controls[field];
    if (!this.shouldShow(field) || !control.errors) return '';
    switch (field) {
      case 'name':
        return this.t('e.name');
      case 'phone':
        return this.t('e.phone');
      case 'destination':
        return this.t('e.dest');
      case 'date':
        return this.t(control.errors['past'] ? 'e.past' : 'e.date');
      case 'people':
        return this.t('e.people');
    }
  }

  protected busError(): string {
    const capacity = this.form.errors?.['busCapacity'];
    if (!capacity || !(this.shouldShow('bus') || this.shouldShow('people'))) return '';
    return this.t('e.bus', { name: capacity.name, seats: capacity.seats });
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      const root = this.host.nativeElement;
      const target =
        root.querySelector<HTMLElement>('input.ng-invalid, select.ng-invalid') ??
        (this.form.errors?.['busCapacity'] ? root.querySelector<HTMLElement>('#bus') : null);
      target?.focus();
      return;
    }

    const v = this.form.getRawValue();
    const pkg = PACKAGES.find((p) => p.id === v.destination);
    const bus = BUSES.find((b) => b.id === v.bus);
    const notes = v.notes.trim();
    // The message that reaches the business is always in English, whatever language the visitor used.
    const message = [
      "Hello Kalavar Tour and Travels, I'd like a quote.",
      `Name: ${v.name.trim()}`,
      `Phone: ${v.phone.trim()}`,
      `Trip: ${pkg ? pkg.name : 'Custom trip'}`,
      `Bus: ${bus ? `${bus.name} (${bus.seats} seats)` : 'Please suggest one'}`,
      `Date: ${v.date}`,
      `Travellers: ${v.people}`,
      notes ? `Notes: ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    this.confirmation.set({ name: v.name.trim(), packageId: pkg?.id ?? null, url: whatsappLink(message) });
    afterNextRender(() => this.confirmBox()?.nativeElement.focus(), { injector: this.injector });
  }
}
