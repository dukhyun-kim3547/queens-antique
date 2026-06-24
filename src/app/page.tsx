import Link from "next/link";

const PRINCIPLES = [
  {
    no: "01",
    title: "선판매 후이동",
    body: "작품은 판매자 댁에 그대로 둡니다. 사진과 정보만 사이트에 올리고, 판매되는 순간에만 단 한 번 배송됩니다. 불필요한 이동도, 선불 배송비도 없습니다.",
  },
  {
    no: "02",
    title: "두 등급의 검수",
    body: "모든 작품은 원격 감정 또는 직접 검수를 거칩니다. 검수 방식을 작품마다 배지로 투명하게 표시하여, 안심하고 구매하실 수 있습니다.",
  },
  {
    no: "03",
    title: "단계 인하 가격",
    body: "큐레이터가 정한 시작가에서, 일정 주기마다 가격이 한 단계씩 내려가 최저가에서 멈춥니다. 지금 살지, 조금 더 기다릴지는 당신의 선택입니다.",
  },
];

export default function Home() {
  return (
    <main>
      {/* 히어로 */}
      <section className="mx-auto flex min-h-[78vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-[0.4em] text-brass">
          EST. 2001 · EUROPEAN ANTIQUES
        </p>
        <h1 className="mt-8 font-serif text-6xl font-medium tracking-tight text-stone-900 sm:text-7xl">
          퀸스앤틱
        </h1>
        <p className="mt-4 text-sm tracking-[0.3em] text-stone-400">
          QUEENS ANTIQUE
        </p>

        <div className="mx-auto mt-10 h-px w-16 bg-brass/40" />

        <p className="mt-10 max-w-xl text-base leading-8 text-stone-600">
          25년간 유럽의 시간을 큐레이션해 온 안목으로,
          <br className="hidden sm:block" />
          당신의 앤틱을 다음 주인에게 잇습니다.
          <br />
          맡기는 사람도, 들이는 사람도 편안한 상시 위탁 마켓플레이스.
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-full bg-stone-900 px-8 py-3 text-sm text-white transition hover:bg-stone-700"
          >
            컬렉션 둘러보기
          </Link>
          <Link
            href="/consign"
            className="rounded-full border border-stone-400 px-8 py-3 text-sm text-stone-800 transition hover:border-stone-900"
          >
            내 앤틱 위탁하기
          </Link>
        </div>
      </section>

      {/* 운영 방식 3원칙 */}
      <section className="border-t border-stone-200 bg-white/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-xs tracking-[0.3em] text-brass">
            HOW IT WORKS
          </p>
          <h2 className="mt-4 text-center font-serif text-3xl text-stone-900">
            퀸스앤틱의 운영 방식
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.no}>
                <p className="font-serif text-2xl text-brass">{p.no}</p>
                <h3 className="mt-3 font-serif text-xl text-stone-900">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 브랜드 소개 */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xs tracking-[0.3em] text-brass">OUR STORY</p>
          <p className="mt-8 font-serif text-2xl leading-relaxed text-stone-800">
            “좋은 물건은 시간을 견디고,
            <br />
            좋은 안목은 그 가치를 알아봅니다.”
          </p>
          <p className="mt-8 text-sm leading-8 text-stone-600">
            퀸스앤틱은 25년 동안 유럽의 앤틱 가구와 소품을 큐레이션해 왔습니다.
            이제 그 안목으로, 일반 가정의 앤틱을 감정하고 새로운 주인에게
            이어드립니다. 우리는 창고에 쌓아두지 않습니다. 오직 합당한 가치를
            지닌 작품만을, 정직한 컨디션 리포트와 함께 소개합니다.
          </p>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="border-t border-stone-200 bg-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl text-white">
            지금의 컬렉션을 만나보세요
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            오늘 둘러보지 않으면, 내일은 다른 가격일지도 모릅니다.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-block rounded-full bg-white px-8 py-3 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            컬렉션 둘러보기
          </Link>
        </div>
      </section>
    </main>
  );
}
