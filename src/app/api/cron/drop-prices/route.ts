import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 매일 한 번 Vercel Cron 이 이 주소를 호출한다.
// CRON_SECRET 으로 잠가두어, 올바른 암호를 가진 호출만 통과시킨다.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }

  // 데이터베이스 함수를 호출해 가격 인하를 실행한다.
  const { data, error } = await supabase.rpc("apply_price_drops");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, dropped: data });
}
