import { createClient } from "@supabase/supabase-js";

// 서버에서만 사용하는 관리자용 연결.
// service_role 키는 모든 보안 규칙을 통과하는 강력한 키라, 절대 브라우저로 보내면 안 된다.
// (이 파일은 서버 코드에서만 import 된다.)
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey || serviceKey.startsWith("여기에")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
