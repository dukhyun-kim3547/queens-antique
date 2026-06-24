"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-stone-200 bg-[var(--background)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div>
          <p className="font-serif text-lg text-stone-900">퀸스앤틱</p>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            25년의 안목으로 큐레이션하는
            <br />
            유럽 앤틱 위탁 마켓플레이스
          </p>
        </div>
        <div className="flex gap-10 text-sm text-stone-500">
          <div className="space-y-2">
            <Link href="/shop" className="block transition hover:text-stone-900">
              컬렉션
            </Link>
            <Link
              href="/consign"
              className="block transition hover:text-stone-900"
            >
              위탁하기
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-stone-400">문의</p>
            <p>queens.antique@example.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-200 py-5">
        <p className="text-center text-xs tracking-wide text-stone-400">
          © {new Date().getFullYear()} Queens Antique · EST. 2001
        </p>
      </div>
    </footer>
  );
}
