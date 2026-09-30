import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

/** Brand gold — #f5af52 as the primary 500 stop */
const brandPrimary = {
  50: '#fef8ee',
  100: '#fcefd9',
  200: '#f9ddb2',
  300: '#f7c882',
  400: '#f6bb6a',
  500: '#f5af52',
  600: '#e09a3a',
  700: '#bc7d2c',
  800: '#976328',
  900: '#7a5124',
  950: '#422a11',
};

const BlackAura = definePreset(Aura, {
  semantic: {
    primary: brandPrimary,
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        primary: {
          color: '{primary.400}',
          contrastColor: '#171717',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
      },
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#171717',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
      },
    },
  },
});

const isDev = process.env.NODE_ENV === 'development';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@vee-validate/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-security',
    '@nuxt/fonts',
  ],
  css: ['primeicons/primeicons.css', '~/assets/css/tailwind.css'],
  vite: {
    optimizeDeps: {
      include: ['cropperjs'],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/library-logo.png' },
        { rel: 'shortcut icon', type: 'image/jpeg', href: '/library-logo.png' },
        { rel: 'apple-touch-icon', href: '/library-logo.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [
        {
          children: `(function(){try{var t=localStorage.getItem('app-theme');var r=document.documentElement;if(t==='light')r.classList.remove('app-dark');else r.classList.add('app-dark');}catch(e){document.documentElement.classList.add('app-dark');}})();`,
        },
      ],
    },
  },
  primevue: {
    options: {
      theme: {
        preset: BlackAura,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    },
  },
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  // Site config used by @nuxtjs/robots and @nuxtjs/sitemap.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
  },
  // Public catalog: crawlers may index every page.
  robots: {
    allow: ['/'],
  },

  // API CORS allowlist includes http://localhost:8000 only.
  devServer: {
    port: 8000,
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_ENV_BASE_URL,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      paymentScreenshotMaxBytes: Number(
        process.env.NUXT_PUBLIC_PAYMENT_SCREENSHOT_MAX_BYTES || 409600,
      ),
    },
  },

  /**
   * Frontend security hardening via nuxt-security.
   * - SSR public catalog; no staff session and no auth cookies
   * - No v-html / innerHTML; no WebSockets; no iframes; no Nuxt server API routes
   * - System fonts only (Tahoma / Segoe UI) — do not allow Google Fonts CDNs
   * - API + signed payment proof images use NUXT_ENV_BASE_URL / https object storage
   * - HSTS + upgrade-insecure-requests only outside development (localhost is HTTP)
   */
  security: {
    strict: false,
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'frame-src': ["'none'"],
        'object-src': ["'none'"],
        'media-src': ["'self'", 'blob:', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
        'script-src-attr': ["'none'"],
        'connect-src': ["'self'", process.env.NUXT_ENV_BASE_URL, ...(isDev ? ['ws:', 'wss:'] : [])].filter(Boolean),
        'worker-src': ["'self'", 'blob:'],
        'upgrade-insecure-requests': !isDev,
      },
      crossOriginEmbedderPolicy: isDev ? 'unsafe-none' : 'credentialless',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      referrerPolicy: 'strict-origin-when-cross-origin',
      strictTransportSecurity: isDev
        ? false
        : {
            maxAge: 15_552_000,
            includeSubdomains: true,
          },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXSSProtection: '0',
      permissionsPolicy: {
        camera: ['self'],
        microphone: [],
        geolocation: ['self'],
        'display-capture': [],
        fullscreen: [],
      },
    },
    csrf: false,
    rateLimiter: isDev ? false : undefined,
    removeLoggers: !isDev,
    nonce: false,
    sri: true,
  },
});
