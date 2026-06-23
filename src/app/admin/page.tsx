import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminClient } from "@/lib/supabaseAdmin";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();
  const admin = getAdminClient();

  // 처리할 일의 개수를 센다.
  const [pendingReq, awaitingPay, selling] = await Promise.all([
    admin
      .from("consignment_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "awaiting_payment"),
    admin
      .from("items")
      .select("id", { count: "exact", head: true })
      .eq("status", "selling"),
  ]);

  const cards = [
    {
      label: "검토 대기 위탁 신청",
      count: pendingReq.count ?? 0,
      href: "/admin/consignments",
    },
    {
      label: "입금 대기 주문",
      count: awaitingPay.count ?? 0,
      href: "/admin/orders",
    },
    {
      label: "판매중 작품",
      count: selling.count ?? 0,
      href: "/",
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <AdminNav />
      <h1 className="font-serif text-2xl text-stone-900">관리자 요약</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-stone-200 p-5 transition hover:border-stone-400"
          >
            <p className="text-sm text-stone-500">{c.label}</p>
            <p className="mt-2 text-3xl font-medium text-stone-900">
              {c.count}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
