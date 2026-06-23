import Link from "next/link";
import type { Item } from "@/lib/types";
import { formatPrice, inspectionGradeLabel } from "@/lib/labels";

// 목록에 보이는 작품 한 장의 카드.
export default function ItemCard({ item }: { item: Item }) {
  const photo = item.photos?.[0];

  return (
    <Link href={`/items/${item.id}`} className="group block">
      {/* 사진 자리 (아직 사진이 없으면 회색 박스에 카테고리 표시) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={item.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
            {item.category ?? "앤틱"}
          </div>
        )}
        {item.inspection_grade && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs text-stone-700 shadow-sm">
            {inspectionGradeLabel[item.inspection_grade]}
          </span>
        )}
      </div>

      <div className="mt-3">
        {item.era && (
          <p className="text-xs tracking-wide text-stone-400">{item.era}</p>
        )}
        <h3 className="mt-1 font-serif text-lg leading-snug text-stone-900">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-stone-700">
          {formatPrice(item.current_price)}
        </p>
      </div>
    </Link>
  );
}
