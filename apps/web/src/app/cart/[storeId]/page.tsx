import { StoreCartView } from '@/features/cart/StoreCartView';

export default function StoreCartPage({ params }: { params: { storeId: string } }) {
  return (
    <main className="min-h-screen bg-transparent pb-24 pt-4">
      <div className="mx-auto max-w-[1920px] rounded-t-3xl bg-[#f8fafc] px-4 py-6 shadow-sm min-h-screen border-t">
        <StoreCartView storeId={params.storeId} />
      </div>
    </main>
  );
}
