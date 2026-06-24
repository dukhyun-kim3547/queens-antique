import type { Metadata } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// 제목용 한국어 명조(세리프)
const serif = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

// 본문용 산세리프
const sans = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "퀸스앤틱 | 유럽 앤틱 위탁 마켓플레이스",
  description: "25년의 안목으로 큐레이션하는 유럽 앤틱 위탁 마켓플레이스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
