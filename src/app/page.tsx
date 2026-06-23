import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/types";
import ItemCard from "@/components/ItemCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; era?: string; sort?: string }>;
}) {
  const { category, era, sort } = await searchParams;

  // 판매중인 작품을 모두 불러온다.
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "selling")
    .order("created_at", { ascending: false });

  const allItems = (data ?? []) as Item[];

  // 필터 선택지(카테고리·시대)는 실제 작품에서 뽑아낸다.
  const categories = [
    ...new Set(allItems.map((i) => i.category).filter(Boolean)),
  ] as string[];
  const eras = [...new Set(allItems.map((i) => i.era).filter(Boolean))] as string[];

  // 선택한 필터를 적용한다.
  let items = allItems;
  if (category) items = items.filter((i) => i.category === category);
  if (era) items = items.filter((i) => i.era === era);
  if (sort === "price_asc")
    items = [...items].sort((a, b) => a.current_price - b.current_price);
  if (sort === "price_desc")
    items = [...items].sort((a, b) => b.current_price - a.current_price);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* 머리말 */}
      <header className="mb-12 text-center">
        <p className="mb-4 text-xs tracking-[0.3em] text-stone-400">
          EST. 2001 · EUROPEAN ANTIQUES
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-stone-900 sm:text-5xl">
          퀸스앤틱
        </h1>
        <p className="mt-4 text-sm leading-7 text-stone-500">
          25년의 안목으로 큐레이션하는 유럽 앤틱 위탁 마켓플레이스.
        </p>
        <Link
          href="/consign"
          className="mt-6 inline-block rounded-full border border-stone-900 px-6 py-2 text-sm text-stone-900 transition hover:bg-stone-900 hover:text-white"
        >
          내 앤틱 위탁하기 →
        </Link>
      </header>

      {/* 필터 (선택 후 '적용'을 누르면 목록이 걸러집니다) */}
      <form
        method="get"
        className="mb-10 flex flex-wrap items-end justify-center gap-4 border-y border-stone-200 py-5"
      >
        <label className="flex flex-col text-xs text-stone-500">
          카테고리
          <select
            name="category"
            defaultValue={category ?? ""}
            className="mt-1 rounded border border-stone-300 px-3 py-2 text-sm text-stone-800"
          >
            <option value="">전체</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-xs text-stone-500">
          시대
          <select
            name="era"
            defaultValue={era ?? ""}
            className="mt-1 rounded border border-stone-300 px-3 py-2 text-sm text-stone-800"
          >
            <option value="">전체</option>
            {eras.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-xs text-stone-500">
          정렬
          <select
            name="sort"
            defaultValue={sort ?? ""}
            className="mt-1 rounded border border-stone-300 px-3 py-2 text-sm text-stone-800"
          >
            <option value="">최신순</option>
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
          </select>
        </label>

        <button
          type="submit"
          className="rounded bg-stone-900 px-5 py-2 text-sm text-white transition hover:bg-stone-700"
        >
          적용
        </button>
      </form>

      {/* 작품 목록 */}
      {error ? (
        <p className="text-center text-sm text-red-600">
          작품을 불러오지 못했습니다: {error.message}
        </p>
      ) : items.length === 0 ? (
        <p className="py-20 text-center text-sm text-stone-400">
          조건에 맞는 작품이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
