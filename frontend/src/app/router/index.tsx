import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';
import { Spinner } from '@/shared/components/ui/Spinner';

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const PropertiesPage = lazy(() => import('@/features/properties/pages/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('@/features/properties/pages/PropertyDetailsPage'));
const CreatePropertyPage = lazy(() => import('@/features/properties/pages/CreatePropertyPage'));
const EditPropertyPage = lazy(() => import('@/features/properties/pages/EditPropertyPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/presentation/pages/DashboardPage'));
const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'));
const CheckoutPage = lazy(() => import('@/features/payments/pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('@/features/payments/pages/PaymentSuccessPage'));
const PaymentHistoryPage = lazy(() => import('@/features/payments/pages/PaymentHistoryPage'));
const NotFoundPage = lazy(() => import('@/shared/components/pages/NotFoundPage'));

// Users feature
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const UserDetailsPage = lazy(() => import('@/features/users/pages/UserDetailsPage'));
const EditUserPage = lazy(() => import('@/features/users/pages/EditUserPage'));
const CreateAgentPage = lazy(() => import('@/features/users/pages/CreateAgentPage'));
const ProfilePage = lazy(() => import('@/features/users/pages/ProfilePage'));

const loader = (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Suspense fallback={loader}><LandingPage /></Suspense> },
  { path: '/login', element: <Suspense fallback={loader}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={loader}><RegisterPage /></Suspense> },
  { path: '/forgot-password', element: <Suspense fallback={loader}><ForgotPasswordPage /></Suspense> },
  { path: '/properties', element: <Suspense fallback={loader}><PropertiesPage /></Suspense> },
  { path: '/properties/:id', element: <Suspense fallback={loader}><PropertyDetailsPage /></Suspense> },
  { path: '/search', element: <Suspense fallback={loader}><SearchPage /></Suspense> },

  // Protected routes
  {
    element: <AuthGuard />,
    children: [
      // Any authenticated user
      { path: '/checkout', element: <Suspense fallback={loader}><CheckoutPage /></Suspense> },
      { path: '/payment/success', element: <Suspense fallback={loader}><PaymentSuccessPage /></Suspense> },
      { path: '/payment/history', element: <Suspense fallback={loader}><PaymentHistoryPage /></Suspense> },
      { path: '/profile', element: <Suspense fallback={loader}><ProfilePage /></Suspense> },
      {
        element: <RoleGuard allowedRoles={['ADMIN', 'AGENT']} />,
        children: [
          { path: '/dashboard', element: <Suspense fallback={loader}><DashboardPage /></Suspense> },
          { path: '/properties/create', element: <Suspense fallback={loader}><CreatePropertyPage /></Suspense> },
          { path: '/properties/:id/edit', element: <Suspense fallback={loader}><EditPropertyPage /></Suspense> },
          // Profile — any authenticated agent/admin
          { path: '/dashboard/profile', element: <Suspense fallback={loader}><ProfilePage /></Suspense> },
        ],
      },
      {
        element: <RoleGuard allowedRoles={['ADMIN']} />,
        children: [
          { path: '/dashboard/users', element: <Suspense fallback={loader}><UsersPage /></Suspense> },
          { path: '/dashboard/users/new-agent', element: <Suspense fallback={loader}><CreateAgentPage /></Suspense> },
          { path: '/dashboard/users/:id', element: <Suspense fallback={loader}><UserDetailsPage /></Suspense> },
          { path: '/dashboard/users/:id/edit', element: <Suspense fallback={loader}><EditUserPage /></Suspense> },
        ],
      },
    ],
  },

  { path: '*', element: <Suspense fallback={loader}><NotFoundPage /></Suspense> },
]);
