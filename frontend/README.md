# HOME LIVE MANAGER — Frontend

Interfaz web de **HomeLive Inmuebles**, la plataforma que centraliza la gestión de ventas, alquileres y administración de propiedades en Colombia.

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (sin `tailwind.config.js`, usa `@import "tailwindcss"`)
- **TanStack Query v5**, **Zustand**, **React Router DOM v6**
- **React Hook Form** + **Zod**
- **Framer Motion**, **@stripe/react-stripe-js**

---

## Requisitos previos

- Node.js 20+
- El backend (microservicios + PostgreSQL) corriendo — ver `../README.md`

---

## Puesta en marcha local (primer PC / entorno nuevo)

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con los valores correctos:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=HomeLive Manager
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Levantar el backend completo (primera vez)

Desde la raíz del proyecto (`../`):

```powershell
# 1. Copiar .env de cada servicio
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object {
  Copy-Item $_.FullName -Destination (Join-Path $_.DirectoryName ".env") -Force
}

# 2. Levantar PostgreSQL y demás servicios
docker compose up -d --build
```

### 4. Aplicar migraciones y seeds (solo la primera vez)

```bash
# auth-service: crear tablas + 3 usuarios (admin / agente / cliente)
cd auth-service
npx prisma migrate deploy
npm run seed

# property-service: crear tablas + 20 propiedades colombianas
cd ../property-service
npx prisma migrate deploy
npm run seed
```

Credenciales creadas por el seed:

| Email                      | Contraseña   | Rol    |
|----------------------------|--------------|--------|
| admin@inmobiliaria.co      | Admin123!    | ADMIN  |
| agente@inmobiliaria.co     | Agente123!   | AGENT  |
| cliente@inmobiliaria.co    | Cliente123!  | CLIENT |

### 5. Arrancar el frontend

```bash
cd frontend
npm run dev
```

Disponible en `http://localhost:5173`

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción (tsc + vite build)
npm run preview  # Vista previa del build de producción
npm run lint     # ESLint
```

---

## Ejecutar todo de una (desarrollo diario)

Suponiendo que el backend ya está corriendo con Docker:

```bash
cd frontend && npm run dev
```

Para ver los logs del backend:

```powershell
# Desde la raíz
docker compose logs -f api-gateway
docker compose logs -f auth-service
docker compose logs -f property-service
```

---

## Alias de paths

El alias `@` apunta a `./src`. Ejemplo:

```ts
import { useAuthStore } from '@/features/auth/store/authStore';
```

---

## Estructura principal

```
src/
├── app/          # Router, guards, providers
├── core/         # Axios instance, config, interceptors
└── features/
    ├── auth/
    ├── landing/
    ├── properties/
    ├── search/
    └── payments/
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
