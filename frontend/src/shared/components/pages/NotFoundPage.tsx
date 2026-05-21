import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-blue-100 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-8">La página que buscas no existe o fue movida.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
