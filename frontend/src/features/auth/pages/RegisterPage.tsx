import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 py-10">
      <AuthCard>
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
            <svg width="24" height="24" fill="white" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">Únete a HomeLive Inmuebles</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
