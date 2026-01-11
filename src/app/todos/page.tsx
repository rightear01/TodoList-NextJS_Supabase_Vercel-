import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import TodoList from './TodoList';
// page.tsx는 기본적으로 서버 컴포넌트로 동작한다.
// 무거운 데이터베이스 쿼리 작업을 서버에서 처리하여 클라이언트로 필요한 데이터만 전송할 수 있다.

// searchParams도 이제 Promise (Next.js 15)
interface TodosPageProps {
  // 인덱스 시그니처 사용
  // [key: string] 덕분에 속성 이름(key)이 문자열이기만 하면, 어떤 이름이든 허용한다.
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/*
  { searchParams }: TodosPageProps
  왼쪽 ({ searchParams }): "들어오는 짐 보따리를 열어서 searchParams만 꺼내 쓸게." (구조 분해 할당)
  오른쪽 (: TodosPageProps): "이 짐 보따리 전체의 타입은 TodosPageProps야."

  { searchParams }: { searchParams: TodosPageProps }
  오른쪽 (: { searchParams: TodosPageProps }): "이 짐 보따리 안에는 searchParams가 있는데, 그 searchParams의 타입이 TodosPageProps야."
    searchParams :{
      searchParams : Promise<...> <- 해당 구조로 인식함
    }
*/

export default async function TodosPage({ searchParams }: TodosPageProps ) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { userId } = await auth();
  const params = await searchParams;

  // TodosPageProps의 인덱스 시그니처 때문에 query | filter와 같은 없는 필드도 추론으로 사용 가능함.
  const query = typeof params.query === 'string' ? params.query : '';
  const filter = typeof params.filter === 'string' ? params.filter : 'all';

  // Prisma 조건(where) 만들기
  // 'WhereInput'은 Prisma가 검색 조건을 위해 만들어둔 특별한 타입이다.
  const whereCondition: Prisma.TodoWhereInput = {
    userId: userId ?? '', // 로그인 안 했으면 빈 문자열(결과 없음)
    title: {
      contains: query,    // 검색어 포함
      mode: 'insensitive',// 대소문자 구분 X
    },
  };

  // 필터 조건 추가
  if (filter === 'completed') {
    whereCondition.isCompleted = true;
  } else if (filter === 'active') {
    whereCondition.isCompleted = false;
  }

  // DB 조회
  const todos = userId
    ? await prisma.todo.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
      })
    : [];

  // 직렬화 (Date -> string)
  const safeTodos = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <div className="flex flex-col items-center">
        <h1 className="max-sm:text-3xl sm:text-5xl font-bold sm:mb-4 text-shadow-lg text-white">Personal Todo List</h1>
        <div className="sm:w-[80%] h-px bg-gray-200 sm:mb-20 max-sm:mb-10" />
        <div className="flex gap-4 items-center max-sm:w-full max-sm:justify-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="max-sm:w-[80%] max-sm:text-2xl sm:w-sm sm:text-3xl px-4 py-2 bg-blue-500 font-bold text-white rounded hover:bg-blue-600 cursor-pointer shadow-lg text-shadow-lg transition">
                Login
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      <div className="flex flex-col items-center mb-8 sm:w-full max-sm:w-[90%] mx-auto">
        <SignedIn>
          <ul className="space-y-4 w-full">
            <TodoList initialTodos={safeTodos} userId={userId} />
          </ul>
        </SignedIn>
      </div>
    </div>
  );
}
