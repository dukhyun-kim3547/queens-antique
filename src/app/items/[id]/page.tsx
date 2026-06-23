import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/types";
import {
  formatPrice,
  formatDate,
  nextDropPrice,
  inspectionGradeLabel,
  storageStatusLabel,
} from "@/lib/labels";

export default async function ItemDetail({
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

  const photo = item.photos?.[0];

  // 정보표에 들어갈 항목들 (값이 있는 것만 보여준다)
  const specs: { label: string; value: string | null }[] = [
    { label: "카테고리", value: item.category },
    { label: "시대", value: item.era },
    { label: "원산지", value: item.origin },
    { label: "크기", value: item.dimensions },
    {
      label: "보관 상태",
      value: item.storage_status
        ? storageStatusLabel[item.storage_status]
        : null,
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* 뒤로 가기 */}
      <Link
        href="/"
        className="text-sm text-stone-500 transition hover:text-stone-900"
      >
        ← 작품 목록으로
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {/* 왼쪽: 사진 */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
              {item.category ?? "앤틱"}
            </div>
          )}
        </div>

        {/* 오른쪽: 정보 */}
        <div>
          {item.inspection_grade && (
            <span className="inline-block rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-600">
              {inspectionGradeLabel[item.inspection_grade]}
            </span>
          )}

          <h1 className="mt-4 font-serif text-3xl leading-snug text-stone-900">
            {item.title}
          </h1>

          {item.description && (
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {item.description}
            </p>
          )}

          {/* 가격 */}
          <p className="mt-8 text-3xl font-medium text-stone-900">
            {formatPrice(item.current_price)}
          </p>

          {/* 다음 인하 안내 */}
          {item.status === "selling" &&
            (item.current_price > item.reserve_price && item.next_drop_date ? (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                <p className="text-stone-700">
                  <span className="font-medium text-amber-700">
                    {formatDate(item.next_drop_date)}
                  </span>
                  , 가격이{" "}
                  <span className="font-medium text-amber-700">
                    {formatPrice(
                      nextDropPrice(
                        item.current_price,
                        item.step_percent,
                        item.reserve_price
                      )
                    )}
                  </span>
                  (으)로 내려갈 예정입니다.
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  최저가 {formatPrice(item.reserve_price)}까지 {item.step_interval_days}일마다
                  한 단계씩 내려갑니다. 지금 구매할지, 더 기다릴지는 선택입니다.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
                최저가 {formatPrice(item.reserve_price)}에 도달하여 더 이상 가격이
                내려가지 않습니다.
              </div>
            ))}

          {/* 구매 버튼 */}
          {item.status === "selling" ? (
            <Link
              href={`/items/${item.id}/order`}
              className="mt-6 block w-full rounded bg-stone-900 py-3 text-center text-sm text-white transition hover:bg-stone-700"
            >
              구매하기
            </Link>
          ) : (
            <div className="mt-6 w-full rounded border border-stone-300 py-3 text-center text-sm text-stone-500">
              {item.status === "sold" ? "판매완료" : "현재 구매할 수 없습니다"}
            </div>
          )}

          {/* 정보표 */}
          <dl className="mt-10 divide-y divide-stone-200 border-t border-stone-200 text-sm">
            {specs
              .filter((s) => s.value)
              .map((s) => (
                <div key={s.label} className="flex justify-between py-3">
                  <dt className="text-stone-400">{s.label}</dt>
                  <dd className="text-stone-800">{s.value}</dd>
                </div>
              ))}
          </dl>

          {/* 컨디션 리포트 */}
          {item.condition_note && (
            <div className="mt-8">
              <h2 className="font-serif text-lg text-stone-900">
                컨디션 리포트
              </h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                {item.condition_note}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
