# Módulo `registro` (Egisto)

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

<RegistroPage config={{ programName: 'Egisto', programKey: 'egisto' }} />
```

Luego solo se conecta a la ruta `/registro` desde el router principal cuando se autorice.

## Configuración soportada

`RegistroPage` recibe `config` con:

- `programName`
- `programKey`
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
