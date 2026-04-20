# Módulo `registro` (#SystemThinking2026)

Módulo aislado para registro premium de ANNiA, desacoplado de rutas/páginas existentes.

## Ejecutar standalone

```bash
npx vite --config vite.registro.config.js
```

## Build standalone

```bash
npx vite build --config vite.registro.config.js
```

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

- **Validación:** `src/registro/lib/schema.js`
- **Persistencia:** `src/registro/services/registration.service.js`
- **Automatizaciones:** `src/registro/services/automation.service.js`
- **Templates:** `src/registro/templates/emailTemplates.js`


## Páginas legales (standalone)

El módulo incluye contenido listo para:

- `registro/privacy/index.html` (Política de Privacidad)
- `registro/community/index.html` (Lineamientos de comunidad)

Estos documentos usan estilo compartido en `registro/legal.css`.
