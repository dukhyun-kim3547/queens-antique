import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/types";
import OrderForm from "@/components/OrderForm";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  const item = data as Item;

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <Link
        href={`/items/${item.id}`}
        className="text-sm text-stone-500 transition hover:text-stone-900"
      >
        ← 작품으로 돌아가기
      </Link>

      <h1 className="mt-6 mb-8 font-serif text-3xl text-stone-900">주문하기</h1>

      {item.status === "selling" ? (
        <OrderForm
          itemId={item.id}
          itemTitle={item.title}
          price={item.current_price}
        />
      ) : (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-center text-sm text-stone-600">
          이 작품은 현재 구매할 수 없습니다 (이미 판매되었거나 판매 중이 아닙니다).
        </div>
      )}
    </main>
  );
}
