# search-service

Microservicio `search-service` — búsqueda avanzada de propiedades con arquitectura hexagonal estricta.

Endpoints principales
- GET /search/properties — filtros dinámicos, paginación y ordenamiento.

SQL / Índices recomendados
- Índice por `price` (btree): `CREATE INDEX idx_properties_price ON properties(price);`
- Índice por `status_id`, `property_type_id`, `transaction_type_id`:
  - `CREATE INDEX idx_properties_status ON properties(status_id);`
  - `CREATE INDEX idx_properties_type ON properties(property_type_id);`
  - `CREATE INDEX idx_properties_transaction ON properties(transaction_type_id);`
- Índice en `addresses.city`: `CREATE INDEX idx_addresses_city ON addresses(city);`
- GIN full-text index para búsquedas textuales en `title||description` (Spanish tsvector):
  - `CREATE INDEX idx_properties_search ON properties USING GIN(to_tsvector('spanish', title || ' ' || description));`
- Partial index para disponibilidad (si `deleted_at IS NULL`):
  - `CREATE INDEX idx_properties_available ON properties (id) WHERE deleted_at IS NULL AND status_id = '<available-status-id>';`

Buenas prácticas implementadas
- Hexagonal: `domain` / `application` / `infrastructure`.
- Repositorio Prisma con selects limitados para reducir I/O.
- Paginación con `skip`/`take` y límites máximos (`pageSize<=100`). Usar keyset pagination para mejor escala.
- Validación de entrada con Zod.
- Evitar SELECT *: elegir campos necesarios.
- Recomendar caching (Redis) para queries calientes y pub/sub para invalidación en tiempo real.

Rendimiento
- Para mantener <3s: índices apropiados, limitar columnas, keyset pagination y cache.
- Usar `EXPLAIN ANALYZE` en queries reales y añadir índices basado en plan.
