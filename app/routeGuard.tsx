import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';

import { useEffect } from 'react';
import { useRouter,usePathname} from 'next/navigation';

export default function RouteGuard() {
  const router = useRouter();
  const auth_token = useAppSelector((state) => state.auth.token);
  const pathname = usePathname()
  useEffect(() => {
    const protectedRoutes = '/dashboard'
    const isProtectedRoute = pathname.includes(protectedRoutes);
    if (isProtectedRoute && !auth_token) {
      router.replace('/login');
    }
  }, [auth_token, pathname]);
  return (
   <div></div>
  );
}
