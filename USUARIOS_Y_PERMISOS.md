# Usuarios de prueba y permisos por rol

Todos los usuarios fueron creados por los seeds de `auth-service` y `user-service`. Las contraseñas son las originales antes del hash.

---

## Credenciales de acceso

| Rol | Nombre | Email | Contraseña |
|-----|--------|-------|------------|
| **ADMIN** | Admin Sistema | `admin@inmobiliaria.co` | `Admin123!` |
| **AGENT** | Carlos Ramírez | `agente@inmobiliaria.co` | `Agente123!` |
| **AGENT** | Sandra López | `sandra@inmobiliaria.co` | `Sandra123!` |
| **CLIENT** | María Gómez | `cliente@inmobiliaria.co` | `Cliente123!` |
| **CLIENT** | Juan Pérez | `juan@inmobiliaria.co` | `Juan123!` |
| **CLIENT** | Laura Torres | `laura@inmobiliaria.co` | `Laura123!` |

> URL de login: **http://localhost:5173/login**

---

## Datos simulados disponibles

### Propiedades (20 en total)
Distribuidas en 6 ciudades colombianas: Bogotá, Medellín, Cali, Cartagena, Barranquilla y Santa Marta. Tipos: casas, apartamentos, locales comerciales y lotes. Estados: disponibles, vendidas y arrendadas.

### Pagos (12 en total)

| Cliente | # Pagos | Estados |
|---|---|---|
| María Gómez | 5 | 2 completados, 1 pendiente, 1 fallido, 1 reembolsado |
| Juan Pérez | 4 | 2 completados, 1 pendiente, 1 fallido |
| Laura Torres | 3 | 2 completados, 1 reembolsado |

Cada pago está vinculado a una propiedad real y muestra su título, dirección e imagen.

---

## Qué puede hacer cada rol

### ADMIN — Administrador del sistema

Acceso total a la plataforma.

**Rutas disponibles:**
- `/` — Landing page → redirige automáticamente a `/dashboard`
- `/dashboard` — Panel de control con métricas ✅
- `/dashboard/users` — Gestión completa de usuarios ✅
- `/dashboard/users/new-agent` — Crear nuevo agente ✅
- `/properties` — Catálogo de propiedades
- `/properties/:id` — Detalle de propiedad
- `/properties/create` — Crear nueva propiedad ✅
- `/properties/:id/edit` — Editar propiedad ✅
- `/search` — Búsqueda avanzada
- `/payment/history` — Historial de **todos** los pagos del sistema ✅
- `/profile` — Mi perfil

**Funcionalidades exclusivas:**
- Gestión de usuarios: editar datos, cambiar rol, eliminar
- Ver todos los pagos del sistema (no filtrado por usuario)
- Enlace "Usuarios" en el sidebar del dashboard
- Botón **Eliminar** propiedad (delete permanente)

---

### AGENT — Agente inmobiliario

Acceso a gestión de propiedades. Sin acceso a usuarios ni pagos globales.

**Rutas disponibles:**
- `/` — Landing page → redirige automáticamente a `/dashboard`
- `/dashboard` — Panel de control ✅
- `/properties` — Catálogo de propiedades
- `/properties/:id` — Detalle de propiedad
- `/properties/create` — Crear nueva propiedad ✅
- `/properties/:id/edit` — Editar propiedad ✅
- `/search` — Búsqueda avanzada
- `/payment/history` — Historial de sus propios pagos
- `/profile` — Mi perfil

**No puede:**
- ❌ Ver `/dashboard/users` (enlace oculto, ruta protegida por `RoleGuard`)
- ❌ Eliminar propiedades (botón oculto)
- ❌ Ver pagos de otros usuarios

---

### CLIENT — Comprador / Arrendatario

Solo navegación, búsqueda y pago. Sin acceso a gestión ni dashboard.

**Rutas disponibles:**
- `/` — Landing page con propiedades destacadas
- `/properties` — Catálogo de propiedades (solo lectura)
- `/properties/:id` — Detalle con botón **"Comprar / Pagar ahora"** si la propiedad está disponible ✅
- `/search` — Búsqueda avanzada (modal de detalle con botón de pago) ✅
- `/checkout` — Iniciar pago ✅
- `/payment/history` — Historial de sus **propios** pagos ✅
- `/payment/success` — Confirmación de pago
- `/profile` — Mi perfil

**No puede:**
- ❌ Acceder a `/dashboard` → redirige a `/`
- ❌ Ver `/dashboard/users` → bloqueado por `RoleGuard`
- ❌ Crear o editar propiedades → bloqueado por `RoleGuard`
- ❌ Ver pagos de otros usuarios (filtrado en la API)

> Si un CLIENT intenta navegar manualmente a `/dashboard` o rutas de gestión, el `RoleGuard` lo redirige automáticamente.

---

## Resumen rápido de permisos

| Funcionalidad | ADMIN | AGENT | CLIENT |
|---|:---:|:---:|:---:|
| Ver catálogo y detalle de propiedades | ✅ | ✅ | ✅ |
| Buscar propiedades | ✅ | ✅ | ✅ |
| Modal de propiedad desde landing/búsqueda | ✅ | ✅ | ✅ |
| Botón "Pagar ahora" en propiedad disponible | ✅ | ✅ | ✅ |
| Checkout / realizar pago | ✅ | ✅ | ✅ |
| Ver historial de pagos propio | ✅ | ✅ | ✅ |
| Ver **todos** los pagos del sistema | ✅ | ❌ | ❌ |
| Acceder al Dashboard | ✅ | ✅ | ❌ |
| Crear propiedad | ✅ | ✅ | ❌ |
| Editar propiedad | ✅ | ✅ | ❌ |
| Eliminar propiedad | ✅ | ❌ | ❌ |
| Gestión de usuarios (`/dashboard/users`) | ✅ | ❌ | ❌ |
| Crear nuevo agente | ✅ | ❌ | ❌ |

---

## Flujo de navegación por rol

```
ADMIN / AGENT  →  /  ──redirect──▶  /dashboard
CLIENT         →  /  ──muestra──▶   Landing page con propiedades
```

El `AppHeader` adapta sus enlaces según el rol activo:

| Sesión | Enlace en header |
|---|---|
| No autenticado | Inicio · Propiedades · Búsqueda · Iniciar sesión |
| CLIENT | Propiedades · Búsqueda · Mis Pagos |
| AGENT | Dashboard · Propiedades |
| ADMIN | Dashboard · Propiedades · Usuarios |

---

## Registrar nuevos usuarios

El formulario en `/register` siempre crea usuarios con rol **CLIENT**. Para crear AGENT, el ADMIN puede usar **"Nuevo agente"** en `/dashboard/users/new-agent`. Para cambiar un rol existente, el ADMIN puede editarlo desde la tabla de usuarios en `/dashboard/users`.