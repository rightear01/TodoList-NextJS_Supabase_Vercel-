import './globals.css';
import Link from 'next/link';
/**
 * 액자와 같다. 액자 틀(헤더, 푸터)은 고정되어 있고 안에 들어가는 내용(페이지 컴포넌트)만 바뀐다.
 * 모든 페이지에 공통으로 적용되는 레이아웃을 정의할 때 사용한다.
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  // 리액트 컴포넌트 태그 사이에 들어가는 모든 자식 요소들(텍스트, 태그, 다른 컴포넌트 등)을 뜻한다.
  // React.ReactNode는 리액트가 화면에 그릴 수 있는 모든 것(숫자, 문자열, 요소, NULL 등)을 포함한는 가장 포괄적인 타입이다.
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning={true}>
        <nav className="border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              TodoApp
            </Link>
            <ul className="flex gap-6 text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/todos" className="hover:text-blue-600 transition">
                  TODO-MENU
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-4 mt-4">{children}</main>
      </body>
    </html>
  );
}
