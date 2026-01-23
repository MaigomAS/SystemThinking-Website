# SystemThinking Website

## i18n source of truth

Spanish (`src/data/i18n/es.json`) is the source of truth for copy and structure. All other locales must include the same keys as Spanish.

Use:

```bash
npm run i18n:check
```

This validates that every key in `es.json` exists in `en.json`.
