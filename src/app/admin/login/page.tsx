import { login } from "../actions";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-serif text-2xl text-stone-900">관리자 로그인</h1>
      <p className="mt-2 text-sm text-stone-500">
        퀸스앤틱 관리자 비밀번호를 입력하세요.
      </p>

      <form action={login} className="mt-6 space-y-4">
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
        />
        {error && (
          <p className="text-sm text-red-600">비밀번호가 올바르지 않습니다.</p>
        )}
        <button
          type="submit"
          className="w-full rounded bg-stone-900 py-2.5 text-sm text-white transition hover:bg-stone-700"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
