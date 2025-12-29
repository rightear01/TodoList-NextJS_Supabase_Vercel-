export default function Loading() {
  // react suspense에서 로딩 상태를 처리하기 위한 컴포넌트 <- 자동으로 인식
  return (
    <div className="max-w-2xl mx-auto mt-8 text-center">
      <h1 className="text-2xl font-bold mb-6">Loading...</h1>

      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
