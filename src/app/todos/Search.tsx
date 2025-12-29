'use client';
// useRef를 사용하기 위해 클라이언트 컴포넌트로 설정 실행을 클라이언트에서 하도록 지정하여
import { useDebouncedCallback } from 'use-debounce';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  // Debounce : 사용자가 입력을 멈춘 후 일정 시간(300ms) 후에 검색어를 반영하도록 설정
  // External Library : use-debounce 라이브러리를 사용하여 디바운스 기능 구현
  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    // URL 도치 : /todos -> /todos?query=입력값
    replace(`${pathName}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex flex-1">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="w-full rounded-sm border border-gray-200 text-sm outline-1 max-sm:p-2"
        placeholder="Search Todo..."
        onChange={(e) => handleSearch(e.target?.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
