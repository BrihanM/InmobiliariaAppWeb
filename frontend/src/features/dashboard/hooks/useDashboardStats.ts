import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/features/properties/api/propertiesApi';
import { paymentsApi } from '@/features/payments/api/paymentsApi';
import { usersApi } from '@/features/users/api/usersApi';

// ─── Chart data shapes ───────────────────────────────────────────────────────

export interface CityData {
  city: string;
  Disponibles: number;
  Vendidas: number;
  Arrendadas: number;
}

export interface SliceData {
  name: string;
  value: number;
}

export interface MonthData {
  month: string;
  revenue: number;
  count: number;
}

export interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalRevenue: number;
  completedPayments: number;
  byCity: CityData[];
  byStatus: SliceData[];
  byType: SliceData[];
  revenueByMonth: MonthData[];
  paymentsByStatus: SliceData[];
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  const propertiesQ = useQuery({
    queryKey: ['dashboard', 'properties'],
    queryFn: () => propertiesApi.getAll({ limit: 200, page: 1 }),
    staleTime: 2 * 60 * 1000,
  });

  const paymentsQ = useQuery({
    queryKey: ['dashboard', 'payments'],
    queryFn: () => paymentsApi.getHistory({ limit: 200, page: 1 }),
    staleTime: 2 * 60 * 1000,
  });

  const usersQ = useQuery({
    queryKey: ['dashboard', 'users'],
    queryFn: () => usersApi.getAll({ pageSize: 200, page: 1 }),
    staleTime: 2 * 60 * 1000,
  });

  const stats = useMemo<DashboardStats>(() => {
    const properties = propertiesQ.data?.data ?? [];
    const payments = paymentsQ.data?.data ?? [];
    const totalUsers = usersQ.data?.total ?? 0;

    const totalProperties = propertiesQ.data?.total ?? properties.length;

    // Revenue from completed payments
    const completedList = payments.filter((p) => p.status === 'completed');
    const totalRevenue = completedList.reduce((sum, p) => sum + p.amount, 0);

    // ── Properties by city (stacked) ─────────────────────────────────────────
    const cityMap: Record<string, { Disponibles: number; Vendidas: number; Arrendadas: number }> =
      {};
    for (const p of properties) {
      if (!cityMap[p.city]) cityMap[p.city] = { Disponibles: 0, Vendidas: 0, Arrendadas: 0 };
      if (p.status === 'available') cityMap[p.city].Disponibles++;
      else if (p.status === 'sold') cityMap[p.city].Vendidas++;
      else if (p.status === 'rented') cityMap[p.city].Arrendadas++;
    }
    const byCity: CityData[] = Object.entries(cityMap)
      .map(([city, v]) => ({ city, ...v }))
      .sort(
        (a, b) =>
          b.Disponibles + b.Vendidas + b.Arrendadas -
          (a.Disponibles + a.Vendidas + a.Arrendadas),
      );

    // ── Properties by status (pie) ────────────────────────────────────────────
    const byStatus: SliceData[] = [
      { name: 'Disponibles', value: properties.filter((p) => p.status === 'available').length },
      { name: 'Vendidas', value: properties.filter((p) => p.status === 'sold').length },
      { name: 'Arrendadas', value: properties.filter((p) => p.status === 'rented').length },
    ].filter((s) => s.value > 0);

    // ── Properties by type (bar) ──────────────────────────────────────────────
    const typeMap: Record<string, number> = {};
    for (const p of properties) typeMap[p.type] = (typeMap[p.type] ?? 0) + 1;
    const typeLabels: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      land: 'Terreno',
      commercial: 'Comercial',
    };
    const byType: SliceData[] = Object.entries(typeMap)
      .map(([type, value]) => ({ name: typeLabels[type] ?? type, value }))
      .sort((a, b) => b.value - a.value);

    // ── Revenue by month (chronological) ─────────────────────────────────────
    const monthMap = new Map<string, { revenue: number; count: number; sortKey: number }>();
    for (const p of completedList) {
      const d = new Date(p.createdAt);
      const sortKey = d.getFullYear() * 100 + d.getMonth();
      const label = d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short' });
      const prev = monthMap.get(label) ?? { revenue: 0, count: 0, sortKey };
      monthMap.set(label, { revenue: prev.revenue + p.amount, count: prev.count + 1, sortKey });
    }
    const revenueByMonth: MonthData[] = Array.from(monthMap.entries())
      .sort(([, a], [, b]) => a.sortKey - b.sortKey)
      .map(([month, v]) => ({ month, revenue: v.revenue, count: v.count }));

    // ── Payments by status (pie) ──────────────────────────────────────────────
    const pStatusMap: Record<string, number> = {};
    for (const p of payments) pStatusMap[p.status] = (pStatusMap[p.status] ?? 0) + 1;
    const pStatusLabels: Record<string, string> = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido',
      refunded: 'Reembolsado',
      processing: 'Procesando',
      cancelled: 'Cancelado',
    };
    const paymentsByStatus: SliceData[] = Object.entries(pStatusMap).map(([status, value]) => ({
      name: pStatusLabels[status] ?? status,
      value,
    }));

    return {
      totalProperties,
      totalUsers,
      totalRevenue,
      completedPayments: completedList.length,
      byCity,
      byStatus,
      byType,
      revenueByMonth,
      paymentsByStatus,
    };
  }, [propertiesQ.data, paymentsQ.data, usersQ.data]);

  return {
    stats,
    isLoading: propertiesQ.isLoading || paymentsQ.isLoading || usersQ.isLoading,
    isError: propertiesQ.isError || paymentsQ.isError || usersQ.isError,
  };
}
