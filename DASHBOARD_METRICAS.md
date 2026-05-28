# Dashboard — Métricas y Gráficas

Documentación de los datos que se muestran en `/dashboard`. Todos los valores se obtienen en tiempo real desde las APIs del backend y se actualizan con un stale time de 2 minutos.

---

## Fuentes de datos

| Origen | Endpoint | Datos que aporta |
|---|---|---|
| `property-service` | `GET /properties?limit=200` | Lista completa de propiedades (tipo, estado, ciudad, precio) |
| `payment-service` | `GET /payments/history?limit=200` | Todos los pagos del sistema (ADMIN) con estado y fecha |
| `user-service` | `GET /users?pageSize=200` | Total de usuarios registrados |

> Solo los usuarios con rol **ADMIN** o **AGENT** tienen acceso al dashboard.  
> El `payment-service` filtra automáticamente: ADMIN ve todos los pagos, AGENT/CLIENT solo los suyos.

---

## Tarjetas de resumen (KPIs)

| Tarjeta | Valor | Subtítulo |
|---|---|---|
| **Propiedades** | `total` de la respuesta paginada de propiedades | Cuántas tienen estado `available` |
| **Usuarios** | `total` de la respuesta de usuarios | — |
| **Ingresos totales** | Suma de `amount` en pagos con `status = completed` (en COP) | Valor completo formateado |
| **Pagos completados** | Conteo de pagos con `status = completed` | `de N totales` |

---

## Gráfica 1 — Propiedades por ciudad (barras apiladas)

**Tipo:** `BarChart` con `stackId` → cada ciudad muestra 3 segmentos apilados.

| Segmento | Color | Condición |
|---|---|---|
| Disponibles | Verde `#10b981` | `property.status === 'available'` |
| Arrendadas | Azul `#0ea5e9` | `property.status === 'rented'` |
| Vendidas | Rojo `#ef4444` | `property.status === 'sold'` |

Las ciudades se ordenan de mayor a menor total de propiedades. El eje Y muestra conteos enteros.

---

## Gráfica 2 — Estado de propiedades (dona)

**Tipo:** `PieChart` con `innerRadius` → dona. Muestra la distribución global de los tres estados.

| Segmento | Color |
|---|---|
| Disponibles | `#10b981` |
| Vendidas | `#ef4444` |
| Arrendadas | `#0ea5e9` |

Acompañada de una leyenda con el conteo absoluto por estado.

---

## Gráfica 3 — Ingresos mensuales (barras verticales)

**Tipo:** `BarChart` sobre pagos con `status = completed`, agrupados por mes calendario.

- **Eje X:** mes en formato `mes año` (ej. `mar 2026`)
- **Eje Y:** ingresos en COP, mostrados en formato compacto (`$1.2B`, `$480M`)
- **Tooltip:** muestra el valor completo formateado en COP
- Las barras se ordenan cronológicamente de más antiguo a más reciente
- Si no hay pagos completados se muestra un mensaje vacío

---

## Gráfica 4 — Estado de pagos (dona)

**Tipo:** `PieChart` con `innerRadius`. Muestra todos los pagos del sistema agrupados por estado.

| Estado | Color |
|---|---|
| Completado | `#10b981` |
| Pendiente | `#f59e0b` |
| Fallido | `#ef4444` |
| Reembolsado | `#8b5cf6` |
| Procesando | `#3b82f6` |
| Cancelado | `#6b7280` |

> El valor `paid` del enum de la base de datos se mapea a `completed` en el repositorio del payment-service antes de enviarse al frontend.

---

## Gráfica 5 — Propiedades por tipo (barras horizontales)

**Tipo:** `BarChart` con `layout="vertical"`. Muestra cuántas propiedades hay de cada tipo.

| Tipo interno | Etiqueta visible |
|---|---|
| `house` | Casa |
| `apartment` | Apartamento |
| `land` | Terreno |
| `commercial` | Comercial |

Cada barra tiene un color distinto del conjunto `['#6366f1', '#10b981', '#f59e0b', '#ec4899']`.

---

## Panel — Resumen rápido

Métricas calculadas en el frontend a partir de los datos ya cargados:

| Métrica | Fórmula |
|---|---|
| **Tasa de venta** | `propiedades vendidas / total propiedades × 100` |
| **Tasa de arriendo** | `propiedades arrendadas / total propiedades × 100` |
| **Tasa de disponibilidad** | `propiedades disponibles / total propiedades × 100` |
| **Ingreso promedio / pago** | `ingresos totales / pagos completados` |
| **Ciudad con más propiedades** | Primera ciudad del array `byCity` (ya ordenado por total descendente) |

---

## Comportamiento de carga

- Mientras las tres queries están pendientes, todas las tarjetas y gráficas muestran un **esqueleto animado** (`animate-pulse`).
- Las queries son independientes: si una falla las otras siguen mostrándose.
- El dato de ingresos usa formato compacto (`$X.XB`) en la tarjeta y formato completo COP en el tooltip y subtítulo.

---

## Archivos clave

| Archivo | Rol |
|---|---|
| [src/features/dashboard/hooks/useDashboardStats.ts](../frontend/src/features/dashboard/hooks/useDashboardStats.ts) | Hook: 3 queries paralelas + cálculo de todos los datos con `useMemo` |
| [src/features/dashboard/presentation/pages/DashboardPage.tsx](../frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx) | Página: renderiza tarjetas, gráficas y panel de resumen |
