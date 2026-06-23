"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/labels";
import { BANK_INFO } from "@/lib/config";

type Props = {
  itemId: string;
  itemTitle: string;
  price: number;
};

export default function OrderForm({ itemId, itemTitle, price }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg("받는 분 성함, 연락처, 주소를 모두 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("place_order", {
        p_item_id: itemId,
        p_shipping_name: name,
        p_shipping_phone: phone,
        p_shipping_address: address,
      });
      if (error) throw new Error(error.message);
      setOrderId(data as string);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setSubmitting(false);
    }
  }

  // 주문 완료 화면 (입금 안내)
  if (orderId) {
    return (
      <div className="rounded-lg border border-stone-200 p-6">
        <h2 className="font-serif text-2xl text-stone-900">
          주문이 접수되었습니다
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          아래 계좌로 입금해 주시면, 입금 확인 후 배송을 준비합니다.
          <br />
          입금 시 <b>받는 분 성함</b>으로 보내주시면 확인이 빠릅니다.
        </p>

        <dl className="mt-6 space-y-2 rounded-md bg-stone-50 p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">작품</dt>
            <dd className="text-stone-800">{itemTitle}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">입금 금액</dt>
            <dd className="font-medium text-stone-900">{formatPrice(price)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">입금 계좌</dt>
            <dd className="text-stone-800">
              {BANK_INFO.bankName} {BANK_INFO.accountNumber}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">예금주</dt>
            <dd className="text-stone-800">{BANK_INFO.accountHolder}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">주문 번호</dt>
            <dd className="text-stone-500">{orderId.slice(0, 8)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-stone-500">
          현재 상태: <b className="text-amber-700">입금 대기</b> · 입금이 확인되면
          결제 완료로 변경되고 배송이 시작됩니다.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded bg-stone-900 px-6 py-3 text-sm text-white transition hover:bg-stone-700"
        >
          작품 둘러보기
        </Link>
      </div>
    );
  }

  // 주문 입력 폼
  const inputClass =
    "mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-stone-500 focus:outline-none";
  const labelClass = "block text-sm text-stone-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 주문 요약 */}
      <div className="rounded-lg bg-stone-50 p-4">
        <p className="text-sm text-stone-500">주문 작품</p>
        <p className="mt-1 font-serif text-lg text-stone-900">{itemTitle}</p>
        <p className="mt-1 text-xl font-medium text-stone-900">
          {formatPrice(price)}
        </p>
      </div>

      {/* 배송지 */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg text-stone-900">배송 정보</h2>
        <label className={labelClass}>
          받는 분 성함 <span className="text-red-500">*</span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className={labelClass}>
          연락처 <span className="text-red-500">*</span>
          <input
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
          />
        </label>
        <label className={labelClass}>
          배송 주소 <span className="text-red-500">*</span>
          <input
            className={inputClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </section>

      {/* 계좌이체 안내 */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
        <p className="font-medium text-amber-800">계좌이체 안내</p>
        <p className="mt-2 leading-6 text-stone-700">
          주문하시면 아래 계좌가 안내됩니다. 입금 확인 후 배송이 시작됩니다.
          <br />
          {BANK_INFO.bankName} {BANK_INFO.accountNumber} (예금주{" "}
          {BANK_INFO.accountHolder})
        </p>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-stone-900 py-3 text-sm text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        {submitting ? "주문 접수 중..." : `${formatPrice(price)} 주문하기`}
      </button>
    </form>
  );
}
