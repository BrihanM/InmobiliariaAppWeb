# Usuarios de prueba y permisos por rol

Todos los usuarios fueron creados por el seed del `auth-service`. Las contraseñas son las originales antes del hash.

---

## Credenciales de acceso

| Rol | Nombre | Email | Contraseña |
|-----|--------|-------|------------|
| **ADMIN** | Admin Sistema | `admin@inmobiliaria.co` | `Admin123!` |
| **AGENT** | Carlos Ramírez | `agente@inmobiliaria.co` | `Agente123!` |
| **CLIENT** | María Gómez | `cliente@inmobiliaria.co` | `Cliente123!` |

> URL de login: **http://localhost:5173/login**

---

## Qué puede hacer cada rol

### ADMIN — Administrador del sistema

Acceso total a la plataforma.

**Rutas disponibles:**
- `/` — Landing page (pública)
- `/properties` — Catálogo de propiedades
- `/properties/:id` — Detalle de propiedad
- `/search` — Búsqueda avanzada
- `/dashboard` — Panel de control ✅ (bloqueado para CLIENT)
- `/properties/create` — Crear nueva propiedad ✅
- `/properties/:id/edit` — Editar propiedad ✅
- `/checkout` — Iniciar pago
- `/payment/history` — Historial de pagos
- `/payment/success` — Confirmación de pago

**Funcionalidades exclusivas:**
- Selector de vista (tarjetas / lista) en el catálogo de propiedades
- Botón **Eliminar** propiedad (delete permanente)
- Botón **Editar** propiedad
- Botón **Nueva propiedad** en el catálogo
- Acceso al Dashboard con métricas globales

---

### AGENT — Agente inmobiliario

Acceso a gestión de propiedades pero sin poder eliminar.

**Rutas disponibles:**
- `/` — Landing page (pública)
- `/properties` — Catálogo de propiedades
- `/properties/:id` — Detalle de propiedad
- `/search` — Búsqueda avanzada
- `/dashboard` — Panel de control ✅
- `/properties/create` — Crear nueva propiedad ✅
- `/properties/:id/edit` — Editar propiedad ✅
- `/checkout` — Iniciar pago
- `/payment/history` — Historial de pagos
- `/payment/success` — Confirmación de pago

**No puede:**
- ❌ Eliminar propiedades (botón delete oculto)
- ❌ Ver el selector de vista lista/tarjeta (exclusivo ADMIN)

---

### CLIENT — Comprador / Arrendatario

Solo navegación y compra. Sin acceso a gestión.

**Rutas disponibles:**
- `/` — Landing page (pública)
- `/properties` — Catálogo de propiedades (solo lectura)
- `/properties/:id` — Detalle de propiedad
- `/search` — Búsqueda avanzada
- `/checkout` — Iniciar pago
- `/payment/history` — Historial de sus propios pagos
- `/payment/success` — Confirmación de pago

**No puede:**
- ❌ Acceder a `/dashboard` → redirige a `/`
- ❌ Crear propiedades → ruta bloqueada por RoleGuard
- ❌ Editar propiedades → ruta bloqueada por RoleGuard
- ❌ Eliminar propiedades → opción no visible
- ❌ Ver botón "Nueva propiedad" en el catálogo

> Si un CLIENT intenta navegar manualmente a `/dashboard` o `/properties/create`, el `RoleGuard` lo redirige automáticamente a `/`.

---

## Resumen rápido

| Funcionalidad | ADMIN | AGENT | CLIENT |
|--------------|:-----:|:-----:|:------:|
| Ver catálogo y detalle | ✅ | ✅ | ✅ |
| Buscar propiedades | ✅ | ✅ | ✅ |
| Realizar pagos / checkout | ✅ | ✅ | ✅ |
| Ver historial de pagos | ✅ | ✅ | ✅ |
| Acceder al Dashboard | ✅ | ✅ | ❌ |
| Crear propiedad | ✅ | ✅ | ❌ |
| Editar propiedad | ✅ | ✅ | ❌ |
| Eliminar propiedad | ✅ | ❌ | ❌ |
| Vista lista/tarjeta (toggle) | ✅ | ❌ | ❌ |

---

## Registrar nuevos usuarios

El formulario en `/register` siempre crea usuarios con rol **CLIENT**. Para crear ADMIN o AGENT hay que hacerlo directamente en la base de datos o a través del seed.
