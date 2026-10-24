import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactDock } from './contact-dock';
import { I18n } from './i18n/i18n';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, ContactDock],
  templateUrl: './app.html',
})
export class App {
  protected readonly t = inject(I18n).t;
  private readonly doc = inject(DOCUMENT);

  /** A plain #top link would navigate away from the legal pages (the page has <base href="/">), so focus the content directly. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.doc.getElementById('top')?.focus();
  }
}
