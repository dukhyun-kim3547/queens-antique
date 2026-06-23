import { requireAdmin } from "@/lib/adminAuth";
import { getAdminClient } from "@/lib/supabaseAdmin";
import AdminNav from "@/components/AdminNav";
import { acceptConsignment, rejectConsignment } from "../actions";

export const dynamic = "force-dynamic";

type Req = {
  id: string;
  item_title: string;
  item_description: string | null;
  category: string | null;
  era: string | null;
  origin: string | null;
  dimensions: string | null;
  condition_note: string | null;
  photos: string[];
  seller_name: string | null;
  seller_phone: string | null;
  seller_address: string | null;
  pickup_date: string | null;
  status: string;
  created_at: string;
};

export default async function AdminConsignments() {
  await requireAdmin();
  const admin = getAdminClient();

  const { data } = await admin
    .from("consignment_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = (data ?? []) as Req[];
  const pending = requests.filter((r) => r.status === "pending");
  const processed = requests.filter((r) => r.status !== "pending");

  const inputClass =
    "mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm";

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <AdminNav />
      <h1 className="font-serif text-2xl text-stone-900">위탁 신청 검토</h1>

      {pending.length === 0 ? (
        <p className="mt-6 text-sm text-stone-400">검토 대기 중인 신청이 없습니다.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {pending.map((r) => (
            <div key={r.id} className="rounded-lg border border-stone-200 p-5">
              {/* 신청 내용 */}
              <div className="flex flex-wrap gap-6">
                {r.photos?.length > 0 && (
                  <div className="flex gap-2">
                    {r.photos.slice(0, 3).map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={p}
                        src={p}
                        alt=""
                        className="h-24 w-24 rounded object-cover"
                      />
                    ))}
                  </div>
                )}
                <div className="flex-1 text-sm">
                  <h2 className="font-serif text-lg text-stone-900">
                    {r.item_title}
                  </h2>
                  {r.item_description && (
                    <p className="mt-1 text-stone-600">{r.item_description}</p>
                  )}
                  <p className="mt-2 text-stone-500">
                    {[r.category, r.era, r.origin, r.dimensions]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {r.condition_note && (
                    <p className="mt-1 text-stone-500">
                      컨디션: {r.condition_note}
                    </p>
                  )}
                  <p className="mt-2 text-stone-500">
                    신청자: {r.seller_name} ({r.seller_phone})
                    {r.seller_address ? ` · ${r.seller_address}` : ""}
                    {r.pickup_date ? ` · 수거희망 ${r.pickup_date}` : ""}
                  </p>
                </div>
              </div>

              {/* 수락 → 작품 등록 폼 */}
              <form
                action={acceptConsignment}
                className="mt-5 border-t border-stone-100 pt-4"
              >
                <input type="hidden" name="request_id" value={r.id} />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <label className="text-xs text-stone-500">
                    검수 등급
                    <select name="inspection_grade" className={inputClass}>
                      <option value="remote">원격 감정</option>
                      <option value="in_person">직접 검수</option>
                    </select>
                  </label>
                  <label className="text-xs text-stone-500">
                    보관 상태
                    <select name="storage_status" className={inputClass}>
                      <option value="seller">판매자 보관</option>
                      <option value="queens">퀸스앤틱 보관</option>
                    </select>
                  </label>
                  <label className="text-xs text-stone-500">
                    시작가 (원)
                    <input
                      type="number"
                      name="start_price"
                      className={inputClass}
                      placeholder="1800000"
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    최저가 (원)
                    <input
                      type="number"
                      name="reserve_price"
                      className={inputClass}
                      placeholder="1000000"
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    인하주기 (일)
                    <input
                      type="number"
                      name="step_interval_days"
                      defaultValue={7}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    인하폭 (%)
                    <input
                      type="number"
                      name="step_percent"
                      defaultValue={10}
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    className="rounded bg-stone-900 px-5 py-2 text-sm text-white transition hover:bg-stone-700"
                  >
                    수락 · 작품 등록
                  </button>
                </div>
              </form>

              {/* 거절 */}
              <form action={rejectConsignment} className="mt-2">
                <input type="hidden" name="request_id" value={r.id} />
                <button
                  type="submit"
                  className="text-sm text-stone-400 hover:text-red-600"
                >
                  거절하기
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* 처리 완료된 신청 */}
      {processed.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-lg text-stone-900">처리 완료</h2>
          <ul className="mt-3 divide-y divide-stone-100 text-sm">
            {processed.map((r) => (
              <li key={r.id} className="flex justify-between py-2">
                <span className="text-stone-700">{r.item_title}</span>
                <span
                  className={
                    r.status === "accepted"
                      ? "text-emerald-600"
                      : "text-stone-400"
                  }
                >
                  {r.status === "accepted" ? "수락됨" : "거절됨"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
