"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  "가구",
  "거울",
  "테이블",
  "조명",
  "도자기",
  "소품",
  "기타",
];

export default function ConsignPage() {
  // 입력값들
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [era, setEra] = useState("");
  const [origin, setOrigin] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [conditionNote, setConditionNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // 진행 상태
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !sellerName.trim() || !sellerPhone.trim()) {
      setErrorMsg("작품 이름, 성함, 연락처는 꼭 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) 사진들을 보관함에 업로드하고 주소(URL)를 모은다.
      const photoUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("consignment-photos")
          .upload(path, file);
        if (upErr) throw new Error("사진 업로드 실패: " + upErr.message);
        const { data } = supabase.storage
          .from("consignment-photos")
          .getPublicUrl(path);
        photoUrls.push(data.publicUrl);
      }

      // 2) 신청 내용을 데이터베이스에 저장한다.
      const { error: insErr } = await supabase
        .from("consignment_requests")
        .insert({
          seller_name: sellerName,
          seller_phone: sellerPhone,
          seller_address: sellerAddress || null,
          pickup_date: pickupDate || null,
          item_title: title,
          item_description: description || null,
          category: category || null,
          era: era || null,
          origin: origin || null,
          dimensions: dimensions || null,
          condition_note: conditionNote || null,
          photos: photoUrls,
        });
      if (insErr) throw new Error("신청 저장 실패: " + insErr.message);

      setDone(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setSubmitting(false);
    }
  }

  // 신청 완료 화면
  if (done) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-stone-900">
          위탁 신청이 접수되었습니다
        </h1>
        <p className="mt-5 text-sm leading-7 text-stone-600">
          소중한 작품을 맡겨 주셔서 감사합니다.
          <br />
          퀸스앤틱이 보내주신 정보를 검토한 뒤,
          <br />
          입력하신 연락처(<b>{sellerPhone}</b>)로 연락드리겠습니다.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-block rounded bg-stone-900 px-6 py-3 text-sm text-white transition hover:bg-stone-700"
        >
          컬렉션 둘러보기
        </Link>
      </main>
    );
  }

  // 입력 폼
  const inputClass =
    "mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-stone-500 focus:outline-none";
  const labelClass = "block text-sm text-stone-600";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/shop"
        className="text-sm text-stone-500 transition hover:text-stone-900"
      >
        ← 컬렉션으로
      </Link>

      <header className="mt-6 mb-10">
        <h1 className="font-serif text-3xl text-stone-900">내 앤틱 위탁하기</h1>
        <p className="mt-3 text-sm leading-7 text-stone-500">
          물건은 댁에 그대로 두시면 됩니다. 사진과 정보만 보내주시면
          퀸스앤틱이 감정 후 판매를 진행하고, 판매되는 순간에만 한 번 배송됩니다.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 작품 정보 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg text-stone-900">작품 정보</h2>

          <label className={labelClass}>
            작품 이름 <span className="text-red-500">*</span>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 루이 16세 스타일 거울"
            />
          </label>

          <label className={labelClass}>
            설명
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="작품에 대한 설명, 구입 경위, 특징 등"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              카테고리
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">선택</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              시대
              <input
                className={inputClass}
                value={era}
                onChange={(e) => setEra(e.target.value)}
                placeholder="예) 19세기 후반"
              />
            </label>

            <label className={labelClass}>
              원산지
              <input
                className={inputClass}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="예) 프랑스"
              />
            </label>

            <label className={labelClass}>
              크기
              <input
                className={inputClass}
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="예) 높이 92cm × 폭 60cm"
              />
            </label>
          </div>

          <label className={labelClass}>
            컨디션 (상태) 메모
            <textarea
              className={inputClass}
              rows={3}
              value={conditionNote}
              onChange={(e) => setConditionNote(e.target.value)}
              placeholder="흠집, 보수 이력, 사용감 등 솔직하게 적어주세요."
            />
          </label>

          <label className={labelClass}>
            사진 (여러 장 선택 가능)
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-1 block w-full text-sm text-stone-600"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>
          {files.length > 0 && (
            <p className="text-xs text-stone-500">
              {files.length}장 선택됨
            </p>
          )}
        </section>

        {/* 판매자 정보 */}
        <section className="space-y-4 border-t border-stone-200 pt-8">
          <h2 className="font-serif text-lg text-stone-900">연락처 · 수거 정보</h2>

          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              성함 <span className="text-red-500">*</span>
              <input
                className={inputClass}
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </label>

            <label className={labelClass}>
              연락처 <span className="text-red-500">*</span>
              <input
                className={inputClass}
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
            </label>
          </div>

          <label className={labelClass}>
            주소 (작품이 있는 곳)
            <input
              className={inputClass}
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.target.value)}
            />
          </label>

          <label className={labelClass}>
            수거 희망일 (판매 시)
            <input
              type="date"
              className={inputClass}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </label>
        </section>

        {errorMsg && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-stone-900 py-3 text-sm text-white transition hover:bg-stone-700 disabled:opacity-50"
        >
          {submitting ? "보내는 중..." : "위탁 신청하기"}
        </button>
      </form>
    </main>
  );
}
