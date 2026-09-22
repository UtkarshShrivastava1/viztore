import { OrderSuccessView } from '@/features/checkout/OrderSuccessView';

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-transparent pb-32 pt-4 flex flex-col">
      <div className="mx-auto max-w-[1920px] px-4 md:px-6 flex-1 w-full bg-white rounded-t-3xl shadow-sm border-t">
        <OrderSuccessView />
      </div>
    </main>
  );
}
