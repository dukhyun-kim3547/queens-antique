"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();
  // 관리자 화면에는 자체 메뉴(AdminNav)가 있으므로 공통 헤더를 숨긴다.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[var(--background)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-stone-900"
        >
          퀸스앤틱
        </Link>
        <nav className="flex items-center gap-7 text-sm text-stone-600">
          <Link href="/shop" className="transition hover:text-stone-900">
            컬렉션
          </Link>
          <Link href="/consign" className="transition hover:text-stone-900">
            위탁하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
