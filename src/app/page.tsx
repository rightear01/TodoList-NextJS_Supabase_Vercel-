export default function Home() {
  // [src/app/page.tsx] 바로 하위에 해당 파일이 위치해 있기 때문에, 이 파일은 루트 경로('/')에 해당하는 페이지 컴포넌트를 정의한다.
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">My own TodoList</h1>
      <p className="mt-4 text-xl">오늘 할 일을 기록해보세요.</p>
    </main>
  );
}
