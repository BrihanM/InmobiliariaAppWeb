import type { UserRole } from '../types';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  error?: string;
}

const ROLES: { value: UserRole; label: string; description: string; icon: string }[] = [
  { value: 'CLIENT', label: 'Comprador', description: 'Busco propiedades', icon: '🏠' },
  { value: 'AGENT', label: 'Agente', description: 'Vendo propiedades', icon: '🤝' },
  { value: 'ADMIN', label: 'Admin', description: 'Gestión total', icon: '⚙️' },
];

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Tipo de cuenta</p>
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              value === role.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl leading-none">{role.icon}</span>
            <span className="text-xs font-semibold">{role.label}</span>
            <span className="text-[10px] leading-tight text-gray-500">{role.description}</span>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
