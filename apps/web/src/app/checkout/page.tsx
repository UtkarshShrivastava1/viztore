import { CheckoutView } from '@/features/checkout/CheckoutView';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-transparent pb-32 pt-4 flex flex-col">
      <div className="mx-auto max-w-[1920px] px-4 md:px-6 flex-1 w-full">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-[22px] font-bold text-[#192168]">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Review and place your order</p>
        </div>
        
        <CheckoutView />
      </div>
    </main>
  );
}
