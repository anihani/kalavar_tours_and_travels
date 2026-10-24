export const CONTACT = {
  phoneDisplay: '+91 97404 45392',
  phoneTel: '+919740445392',
  /** Country code first, no + or spaces. */
  whatsapp: '919740445392',
  email: 'hello@kalavartravels.example', // placeholder, replace with your real email
  // The office address and opening hours are in the translation files (ct.address, ct.hours).
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kalavar+Tour+and+Travels+HSR+Layout+Bengaluru',
};

/** Replace with your real address before launch. It is used for the canonical link and share previews. */
export const SITE_URL = 'https://www.kalavartravels.example';

export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const GREETING_LINK = whatsappLink("Hello Kalavar Tour and Travels, I'd like to enquire about a trip.");
