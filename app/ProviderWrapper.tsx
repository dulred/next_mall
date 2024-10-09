// app/ProviderWrapper.tsx
"use client";
import { Provider } from 'react-redux';
import store, { persistor } from '@/app/lib/store';
import { PersistGate } from 'redux-persist/integration/react';
import RouteGuard from '@/app/routeGuard';
export default function ProviderWrapper({ children }: { children: React.ReactNode }) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <RouteGuard/>
      </PersistGate>
    </Provider>
  );
}
