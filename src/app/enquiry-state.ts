import { Injectable, signal } from '@angular/core';

/**
 * Lets the package and fleet cards pre-fill the enquiry form without the components knowing about each other.
 * Each pick is a fresh object so choosing the same card twice still re-fills a form the visitor has changed.
 */
@Injectable({ providedIn: 'root' })
export class EnquiryState {
  readonly packagePick = signal<{ id: string } | null>(null);
  readonly busPick = signal<{ id: string } | null>(null);

  pickPackage(id: string): void {
    this.packagePick.set({ id });
  }

  pickBus(id: string): void {
    this.busPick.set({ id });
  }
}
