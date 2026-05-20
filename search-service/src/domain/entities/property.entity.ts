export type PropertySummary = {
  id: string;
  title: string;
  price: number;
  city: string;
  propertyType: string;
  transactionType: string;
  status: string;
  image?: string | null;
  createdAt: string;
};

/**
 * Resumen ligero de `Property` usado por el servicio de búsqueda.
 * Contiene solo campos necesarios para listados rápidos y paginados.
 */
