# SystemThinking Website

## Production deployment constraints (one.com)

This project is deployed under a subpath:

- `https://annia.no/systemthinking/`

Keep these settings stable unless there is an explicit migration plan:

- `vite.config.js` must keep `base: '/systemthinking/'`.
- The quick request form must post to `api/quick-request.php` (not `/api/quick-request`).
- Backend form handling runs through `public/api/quick-request.php` and is copied into `dist/api/quick-request.php` at build time.

### Deployment output checklist

After `npm run build`, upload the content of `dist/` so production includes:

- `index.html`
- `assets/`
- `images/`
- `api/quick-request.php`

## i18n source of truth

Spanish (`src/data/i18n/es.json`) is the source of truth for copy and structure. All other locales must include the same keys as Spanish.

Use:

```bash
npm run i18n:check
```

This validates that every key in `es.json` exists in `en.json`.

## Quality guardrails

Run these lightweight checks before merging:

```bash
npm run quality:accessibility
npm run quality:i18n
npm run quality:assets
```

What they do:

- `quality:accessibility`: fails on `<img>` tags missing `alt` and CSS files with animations but no `prefers-reduced-motion` fallback.
- `quality:i18n`: ensures every Spanish i18n key exists in the English locale.
- `quality:assets`: flags images larger than 1.5MB. Customize the threshold via `ASSET_MAX_BYTES`.

## E-Call module (independent from main SystemThinking page)

E-Call now lives in its own folder: `src/ecall/`.

- `src/ecall/ECallPage.jsx`: standalone page logic/UI.
- `src/ecall/i18n/*.json`: E-Call-only copy and language data.
- `src/ecall/i18n/useECallLanguage.js`: dedicated language state for E-Call.
- `src/ecall/config.js`: external URLs (room + back-to-origin link).

### Back to origin URL

By default, the "Back to ANNiA" links point to:

- `https://annia.no`

You can override this at deploy time with:

- `VITE_ECALL_BACK_URL`

### Local preview after this reorganization

Keep previewing exactly as today:

- Home: `/`
- E-Call: `/e-call`

So in Vercel preview, for example:

- `https://system-thinking-website.vercel.app/`
- `https://system-thinking-website.vercel.app/e-call`

This lets you keep E-Call within this repo while having independent text/config for later deployment at `annia.no/e-call`.
