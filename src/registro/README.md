# Módulo `registro` (#SystemThinking2026)

Módulo aislado para registro premium de ANNiA, desacoplado de rutas/páginas existentes.

## Ejecutar standalone (frontend)

```bash
npx vite --config vite.registro.config.js
```

## Build standalone

```bash
npx vite build --config vite.registro.config.js
```

## Preview standalone

```bash
npx vite preview --config vite.registro.config.js --port 4174
```

## Endpoint backend fase 1

Se agregó endpoint real en `api/registro.js`:

- Método: `POST`
- Content-Type: `application/json`
- Valida payload en servidor
- Persiste según `REGISTRO_STORAGE_MODE`
- Envía correo interno + correo de confirmación

## Persistencia fase 1 (honesta)

### Modo `mailbox_only` (default)
- No guarda archivo/DB.
- La traza operativa queda en el correo interno enviado al equipo.
- Es simple para deploy serverless, pero no reemplaza una base de datos.

### Modo `file_local`
- Guarda NDJSON en `data/registro-submissions.ndjson` (o `REGISTRO_FILE_PATH`).
- Útil para local/dev.
- **No confiable como persistencia durable en Vercel/serverless** (filesystem efímero).

## Variables de entorno requeridas

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE` (opcional)
- `SMTP_REQUIRE_TLS` (opcional)
- `MAIL_FROM`
- `REGISTRO_INTERNAL_TO` (fallback: `MAIL_TO` o `SMTP_USER`)
- `REGISTRO_STORAGE_MODE` (`mailbox_only` | `file_local`)
- `REGISTRO_FILE_PATH` (opcional, solo `file_local`)

## Integración futura al main web

```jsx
import { RegistroPage } from '@/src/registro';

<RegistroPage config={{ programName: '#SystemThinking2026', programKey: 'system-thinking-2026' }} />
```

Luego solo se conecta a la ruta `/registro` desde el router principal cuando se autorice.

## Configuración del evento

La configuración central está en `src/registro/config/event.js`:

- `eventNameShort`: `#SystemThinking2026`
- `eventNameFull`: `Encuentro fundacional de liderazgo sistémico`
- `eventLocationDate`: `Bergen, Noruega · Noviembre 2026`
- `eventKey`: `system-thinking-2026`

## Configuración soportada

`RegistroPage` recibe `config` con:

- `programName`
- `programKey`
- `event`
- `texts`
- `success messages`
- `emailTemplates`
- `urls`
- `featureFlags`

## Puntos de extensión

- **Validación cliente:** `src/registro/lib/schema.js`
- **Persistencia y orquestación cliente:** `src/registro/services/registration.service.js`
- **Automatizaciones cliente:** `src/registro/services/automation.service.js`
- **Backend fase 1:** `api/registro.js`

## Páginas legales (standalone)

El módulo incluye contenido listo para:

- `registro/privacy/index.html` (Política de Privacidad)
- `registro/community/index.html` (Lineamientos de comunidad)

Estos documentos usan estilo compartido en `registro/legal.css`.
