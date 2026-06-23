"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getAdminClient } from "@/lib/supabaseAdmin";

// 관리자 로그인: 비밀번호가 맞으면 쿠키를 심고 관리자 첫 화면으로 보낸다.
export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8시간
  });
  redirect("/admin");
}

// 관리자 로그아웃
export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// 안전장치: 관리자만 아래 작업을 실행할 수 있게 한다.
async function assertAdmin() {
  if (!(await isAdmin())) {
    throw new Error("관리자 권한이 없습니다.");
  }
}

// 위탁 신청 거절
export async function rejectConsignment(formData: FormData) {
  await assertAdmin();
  const requestId = String(formData.get("request_id"));
  const admin = getAdminClient();
  const { error } = await admin
    .from("consignment_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/consignments");
}

// 위탁 신청 수락 → 작품으로 등록 + 가격 설정
export async function acceptConsignment(formData: FormData) {
  await assertAdmin();
  const admin = getAdminClient();

  const requestId = String(formData.get("request_id"));
  const inspectionGrade = String(formData.get("inspection_grade"));
  const storageStatus = String(formData.get("storage_status"));
  const startPrice = Number(formData.get("start_price"));
  const reservePrice = Number(formData.get("reserve_price"));
  const stepIntervalDays = Number(formData.get("step_interval_days"));
  const stepPercent = Number(formData.get("step_percent"));

  if (
    !startPrice ||
    !reservePrice ||
    !stepIntervalDays ||
    !stepPercent ||
    reservePrice > startPrice
  ) {
    throw new Error(
      "가격 정보를 올바르게 입력하세요 (최저가는 시작가보다 클 수 없습니다)."
    );
  }

  // 신청 내용을 가져온다.
  const { data: req, error: reqErr } = await admin
    .from("consignment_requests")
    .select("*")
    .eq("id", requestId)
    .single();
  if (reqErr || !req) throw new Error("신청을 찾을 수 없습니다.");

  // 다음 인하일 = 오늘 + 인하주기
  const nextDrop = new Date();
  nextDrop.setDate(nextDrop.getDate() + stepIntervalDays);
  const nextDropDate = nextDrop.toISOString().slice(0, 10);

  // 작품 등록 (판매중 상태로)
  const { data: item, error: itemErr } = await admin
    .from("items")
    .insert({
      consignment_request_id: req.id,
      title: req.item_title,
      description: req.item_description,
      category: req.category,
      era: req.era,
      origin: req.origin,
      dimensions: req.dimensions,
      condition_note: req.condition_note,
      inspection_grade: inspectionGrade,
      storage_status: storageStatus,
      photos: req.photos ?? [],
      start_price: startPrice,
      current_price: startPrice,
      reserve_price: reservePrice,
      step_interval_days: stepIntervalDays,
      step_percent: stepPercent,
      next_drop_date: nextDropDate,
      status: "selling",
    })
    .select("id")
    .single();
  if (itemErr || !item) throw new Error(itemErr?.message ?? "작품 등록 실패");

  // 신청을 '수락' 으로 변경
  await admin
    .from("consignment_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  // 최초 가격 이력 기록
  await admin
    .from("price_history")
    .insert({ item_id: item.id, price: startPrice });

  revalidatePath("/admin/consignments");
  revalidatePath("/");
}

// 주문 입금 확인 (입금대기 → 결제완료)
export async function confirmPayment(formData: FormData) {
  await assertAdmin();
  const orderId = String(formData.get("order_id"));
  const admin = getAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ payment_status: "paid" })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
