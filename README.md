# SystemThinking Website

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
