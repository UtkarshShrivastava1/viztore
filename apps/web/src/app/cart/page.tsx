import { CartView } from '@/features/cart/CartView';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-transparent pb-24 pt-4">
      <div className="mx-auto max-w-[1920px] rounded-t-3xl bg-white px-4 py-6 shadow-sm min-h-screen border-t">
        <CartView />
      </div>
    </main>
  );
}
