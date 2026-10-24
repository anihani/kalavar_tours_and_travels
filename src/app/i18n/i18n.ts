import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL } from '../data/contact';
import { en } from './en';
import { hi } from './hi';
import { kn } from './kn';
import { ml } from './ml';
import { ta } from './ta';
import { te } from './te';

/** Each language is shown in its own script, so visitors can find theirs without reading English. */
export const LANGUAGES = [
  { code: 'en', label: 'English', english: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'hi', label: 'हिन्दी', english: 'Hindi' },
  { code: 'ta', label: 'தமிழ்', english: 'Tamil' },
  { code: 'te', label: 'తెలుగు', english: 'Telugu' },
  { code: 'ml', label: 'മലയാളം', english: 'Malayalam' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

const DICTIONARIES: Record<Lang, Record<string, string>> = { en, kn, hi, ta, te, ml };

/** The page fonts only cover Latin, so each Indian script loads its own font the first time it is chosen. */
const SCRIPT_FONT: Partial<Record<Lang, string>> = {
  kn: 'Noto+Sans+Kannada',
  hi: 'Noto+Sans+Devanagari',
  ta: 'Noto+Sans+Tamil',
  te: 'Noto+Sans+Telugu',
  ml: 'Noto+Sans+Malayalam',
};

const STORAGE_KEY = 'kalavar-lang';

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lang = signal<Lang>('en');

  /** Which page is showing: its translation key prefix for the title and description, and its address. */
  private readonly page = signal({ prefix: 'meta', path: '/' });

  /**
   * Looks up a string and fills in {placeholders}. It reads the language signal,
   * so any template that calls it re-renders when the language changes.
   */
  readonly t = (key: string, params?: Record<string, string | number>): string => {
    let text = DICTIONARIES[this.lang()][key] ?? en[key as keyof typeof en] ?? key;
    if (params) {
      for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  };

  constructor() {
    if (this.isBrowser) this.lang.set(this.detect());

    effect(() => {
      const lang = this.lang();
      this.doc.documentElement.lang = lang === 'en' ? 'en-IN' : lang;
      this.applyHead();
      this.loadFont(lang);
    });
  }

  /** Each page calls this once, so the title, description and canonical link match the page being shown. */
  setPage(prefix: string, path: string): void {
    this.page.set({ prefix, path });
    this.applyHead();
  }

  /** Updates everything in <head> that depends on the page and language (also runs while prerendering). */
  private applyHead(): void {
    const { prefix, path } = this.page();
    const title = this.t(`${prefix}.title`);
    const description = this.t(`${prefix}.description`);
    const url = SITE_URL + path;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.doc.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage can be blocked (private windows); the language still changes for this visit.
    }
  }

  /** Loads every script's font, so the language list shows each name in its own script. */
  preloadFonts(): void {
    for (const language of LANGUAGES) this.loadFont(language.code);
  }

  /** Order of preference: ?lang=kn in the link, the visitor's last choice, then their browser language. */
  private detect(): Lang {
    const isLang = (value: string | null | undefined): value is Lang => LANGUAGES.some((l) => l.code === value);
    try {
      const fromUrl = new URLSearchParams(location.search).get('lang');
      if (isLang(fromUrl)) return fromUrl;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLang(saved)) return saved;
    } catch {
      // Fall through to the browser language.
    }
    for (const tag of navigator.languages ?? []) {
      const code = tag.slice(0, 2).toLowerCase();
      if (isLang(code)) return code;
    }
    return 'en';
  }

  private loadFont(lang: Lang): void {
    const family = SCRIPT_FONT[lang];
    if (!family || !this.isBrowser) return;
    const id = `font-${lang}`;
    if (this.doc.getElementById(id)) return;
    const link = this.doc.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800&display=swap`;
    this.doc.head.appendChild(link);
  }
}
