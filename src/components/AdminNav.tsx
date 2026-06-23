import Link from "next/link";
import { logout } from "@/app/admin/actions";

// 관리자 화면 상단 공통 메뉴.
export default function AdminNav() {
  return (
    <nav className="mb-10 flex items-center justify-between border-b border-stone-200 pb-4">
      <div className="flex gap-5 text-sm">
        <Link href="/admin" className="text-stone-700 hover:text-stone-900">
          요약
        </Link>
        <Link
          href="/admin/consignments"
          className="text-stone-700 hover:text-stone-900"
        >
          위탁 신청
        </Link>
        <Link
          href="/admin/orders"
          className="text-stone-700 hover:text-stone-900"
        >
          주문
        </Link>
        <Link href="/" className="text-stone-400 hover:text-stone-700">
          사이트 보기 ↗
        </Link>
      </div>
      <form action={logout}>
        <button className="text-sm text-stone-400 hover:text-stone-700">
          로그아웃
        </button>
      </form>
    </nav>
  );
}
