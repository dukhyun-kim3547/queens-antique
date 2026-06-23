import { requireAdmin } from "@/lib/adminAuth";
import { getAdminClient } from "@/lib/supabaseAdmin";
import AdminNav from "@/components/AdminNav";
import { formatPrice } from "@/lib/labels";
import { confirmPayment } from "../actions";

export const dynamic = "force-dynamic";

type Order = {
  id: string;
  price: number;
  payment_status: string;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  created_at: string;
  items: { title: string } | null;
};

export default async function AdminOrders() {
  await requireAdmin();
  const admin = getAdminClient();

  const { data } = await admin
    .from("orders")
    .select("*, items(title)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <AdminNav />
      <h1 className="font-serif text-2xl text-stone-900">주문 관리</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-stone-400">아직 주문이 없습니다.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => {
            const paid = o.payment_status === "paid";
            return (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-stone-200 p-5"
              >
                <div className="text-sm">
                  <p className="font-serif text-lg text-stone-900">
                    {o.items?.title ?? "(삭제된 작품)"}
                  </p>
                  <p className="mt-1 text-stone-700">{formatPrice(o.price)}</p>
                  <p className="mt-1 text-stone-500">
                    받는 분: {o.shipping_name} ({o.shipping_phone})
                  </p>
                  <p className="text-stone-500">{o.shipping_address}</p>
                </div>

                <div className="text-right">
                  {paid ? (
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                      결제 완료
                    </span>
                  ) : (
                    <form action={confirmPayment}>
                      <input type="hidden" name="order_id" value={o.id} />
                      <span className="mr-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
                        입금 대기
                      </span>
                      <button
                        type="submit"
                        className="rounded bg-stone-900 px-4 py-2 text-sm text-white transition hover:bg-stone-700"
                      >
                        입금 확인
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
