import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 관리자 로그인 여부를 담는 쿠키 이름.
export const ADMIN_COOKIE = "qa_admin";

// 현재 접속자가 관리자 비밀번호로 로그인한 상태인지 확인한다.
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return !!value && value === process.env.ADMIN_PASSWORD;
}

// 관리자가 아니면 로그인 페이지로 보낸다. (보호된 페이지 맨 위에서 호출)
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}
