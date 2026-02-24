'use client';

import {CartProvider} from '@/components/shop/cart-provider';
import {CartReminder} from '@/components/shop/cart-reminder';

export function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <CartProvider>
      {children}
      <CartReminder />
    </CartProvider>
  );
}
