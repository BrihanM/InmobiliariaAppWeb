import { Outlet } from 'react-router-dom';
import { GlobalPropertyModal } from '@/shared/components/GlobalPropertyModal';

export function RootLayout() {
  return (
    <>
      <Outlet />
      <GlobalPropertyModal />
    </>
  );
}
