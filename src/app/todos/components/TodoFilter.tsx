'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function TodoFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL에서 현재 필터 값을 가져온다. (없으면 'all'로 취급)
  const currentFilter = searchParams.get('filter') || 'all';

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === 'all') {
      params.delete('filter'); // 'all'이면 굳이 URL에 표시 안 함
    } else {
      params.set('filter', filter);
    }
    // URL을 업데이트 (새로고침 없이)
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-2 max-w-62.5">
      {['all', 'active', 'completed'].map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterChange(filter)}
          className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${
            currentFilter === filter
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}