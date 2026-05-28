import type { ReactNode } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useSession } from '@/features/auth/hooks/useSession';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import type { SliceData } from '../../hooks/useDashboardStats';

// ─── Palette ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Disponibles: '#10b981',
  Vendidas: '#ef4444',
  Arrendadas: '#0ea5e9',
};

const PAYMENT_COLORS: Record<string, string> = {
  Completado: '#10b981',
  Pendiente:  '#f59e0b',
  Fallido:    '#ef4444',
  Reembolsado:'#8b5cf6',
  Procesando: '#3b82f6',
  Cancelado:  '#6b7280',
};

const TYPE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtCOPShort(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function fmtCOPFull(n: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Shared chart containers ──────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className ?? ''}`} />;
}

// ─── Pie with legend ──────────────────────────────────────────────────────────

interface DonutChartProps {
  data: SliceData[];
  colorMap: Record<string, string>;
  fallbackColors: string[];
}

function DonutChart({ data, colorMap, fallbackColors }: DonutChartProps) {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={colorMap[entry.name] ?? fallbackColors[i % fallbackColors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [String(v), '']} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <ul className="mt-3 space-y-1.5">
        {data.map((entry, i) => (
          <li key={entry.name} className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    colorMap[entry.name] ?? fallbackColors[i % fallbackColors.length],
                }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-gray-800">{entry.value}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useSession();
  const { stats, isLoading } = useDashboardStats();

  // Stat cards definition
  const statCards = [
    {
      label: 'Propiedades',
      value: isLoading ? '—' : String(stats.totalProperties),
      sub: isLoading ? '' : `${stats.byStatus.find((s) => s.name === 'Disponibles')?.value ?? 0} disponibles`,
      icon: '🏠',
      accent: 'border-indigo-400',
    },
    {
      label: 'Usuarios',
      value: isLoading ? '—' : String(stats.totalUsers),
      sub: 'Registrados en la plataforma',
      icon: '👥',
      accent: 'border-violet-400',
    },
    {
      label: 'Ingresos totales',
      value: isLoading ? '—' : fmtCOPShort(stats.totalRevenue),
      sub: isLoading ? '' : fmtCOPFull(stats.totalRevenue),
      icon: '💰',
      accent: 'border-emerald-400',
    },
    {
      label: 'Pagos completados',
      value: isLoading ? '—' : String(stats.completedPayments),
      sub: isLoading ? '' : `de ${stats.paymentsByStatus.reduce((s, p) => s + p.value, 0)} totales`,
      icon: '✅',
      accent: 'border-sky-400',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user?.name} 👋</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Resumen en tiempo real de tu plataforma inmobiliaria
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) =>
          isLoading ? (
            <Skeleton key={card.label} className="h-28" />
          ) : (
            <div
              key={card.label}
              className={`bg-white rounded-2xl border-l-4 ${card.accent} p-5 shadow-sm`}
            >
              <span className="text-2xl">{card.icon}</span>
              <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">{card.label}</p>
              {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
            </div>
          ),
        )}
      </div>

      {/* ── Row 1: Properties by city + by status ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Stacked bar — by city */}
        <div className="lg:col-span-2">
          <ChartCard title="Propiedades por ciudad">
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.byCity} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="city"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar dataKey="Disponibles" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Arrendadas"  stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Vendidas"    stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Donut — by status */}
        <ChartCard title="Estado de propiedades">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <DonutChart
              data={stats.byStatus}
              colorMap={STATUS_COLORS}
              fallbackColors={['#10b981', '#ef4444', '#0ea5e9']}
            />
          )}
        </ChartCard>
      </div>

      {/* ── Row 2: Revenue by month + payments by status ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Bar — revenue by month */}
        <div className="lg:col-span-2">
          <ChartCard title="Ingresos mensuales (pagos completados)">
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : stats.revenueByMonth.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                Sin pagos completados aún
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={stats.revenueByMonth}
                  margin={{ top: 4, right: 8, left: 16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => fmtCOPShort(v)}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtCOPFull(typeof v === 'number' ? v : Number(v ?? 0)),
                      'Ingresos',
                    ]}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Donut — payments by status */}
        <ChartCard title="Estado de pagos">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <DonutChart
              data={stats.paymentsByStatus}
              colorMap={PAYMENT_COLORS}
              fallbackColors={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
            />
          )}
        </ChartCard>
      </div>

      {/* ── Row 3: Properties by type ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Propiedades por tipo">
            {isLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  layout="vertical"
                  data={stats.byType}
                  margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(v) => [String(v), 'Propiedades']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Propiedades">
                    {stats.byType.map((_, i) => (
                      <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Quick summary panel */}
        <ChartCard title="Resumen rápido">
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <ul className="space-y-3 text-sm">
              {[
                {
                  label: 'Tasa de venta',
                  value:
                    stats.totalProperties > 0
                      ? `${Math.round(
                          ((stats.byStatus.find((s) => s.name === 'Vendidas')?.value ?? 0) /
                            stats.totalProperties) *
                            100,
                        )}%`
                      : '0%',
                  color: 'text-red-500',
                },
                {
                  label: 'Tasa de arriendo',
                  value:
                    stats.totalProperties > 0
                      ? `${Math.round(
                          ((stats.byStatus.find((s) => s.name === 'Arrendadas')?.value ?? 0) /
                            stats.totalProperties) *
                            100,
                        )}%`
                      : '0%',
                  color: 'text-sky-500',
                },
                {
                  label: 'Tasa de disponibilidad',
                  value:
                    stats.totalProperties > 0
                      ? `${Math.round(
                          ((stats.byStatus.find((s) => s.name === 'Disponibles')?.value ?? 0) /
                            stats.totalProperties) *
                            100,
                        )}%`
                      : '0%',
                  color: 'text-emerald-500',
                },
                {
                  label: 'Ingreso promedio / pago',
                  value:
                    stats.completedPayments > 0
                      ? fmtCOPShort(stats.totalRevenue / stats.completedPayments)
                      : '—',
                  color: 'text-indigo-500',
                },
                {
                  label: 'Ciudad con más propiedades',
                  value: stats.byCity[0]?.city ?? '—',
                  color: 'text-violet-500',
                },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
                >
                  <span className="text-gray-500">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>{item.value}</span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
