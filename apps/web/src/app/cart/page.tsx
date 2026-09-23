import { CartView } from '@/features/cart/CartView';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-transparent pb-24 pt-4">
      <div className="mx-auto max-w-[1920px] rounded-t-3xl bg-white px-4 py-6 shadow-sm min-h-screen border-t">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#192168]">My Cart</h1>
          <p className="text-sm text-gray-500 mt-1">Review your items and proceed to checkout</p>
        </div>
        
        <CartView />
      </div>
    </main>
  );
}
