import { prisma } from '@/lib/prisma';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Search from './Search';
import TodoList from './TodoList';
// page.tsx는 기본적으로 서버 컴포넌트로 동작한다.
// 무거운 데이터베이스 쿼리 작업을 서버에서 처리하여 클라이언트로 필요한 데이터만 전송할 수 있다.

export default async function TodosPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { userId } = await auth();
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || '';

  const todos = userId
    ? await prisma.todo.findMany({
        where: {
          userId: userId,
          title: {
            contains: query, // 검색어 포함
            mode: 'insensitive', // 대소문자 구분 없이 검색
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : [];

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
          <h1 className="max-sm:text-xl sm:text-2xl font-bold mb-6 w-full flex justify-between items-center text-shadow-lg text-gray-700">
            Todo List [Total : {todos.length}]
            <div className="transform scale-130 pr-6">
              <UserButton />
            </div>
          </h1>

          <ul className="space-y-4 w-full">
            <TodoList initialTodos={todos} userId={userId} />
          </ul>
        </SignedIn>
      </div>
    </div>
  );
}
