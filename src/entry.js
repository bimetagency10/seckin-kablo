// Site JS girisi — Vite bundle (sira onemli: consent -> i18n -> main -> events)
import '../js/cookie-consent.js';
import '../js/i18n.js';
import '../js/main.js';
import '../js/events.js';
import { inject } from '@vercel/analytics';
inject();
