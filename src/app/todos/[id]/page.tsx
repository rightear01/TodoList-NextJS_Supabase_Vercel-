// /todo/1, /todo/pizzo, /todo/anything 뒤에 모가 오든 이 페이지가 처리하겠다는 뜻
// SupaBase : 울가족7@
import { notFound } from 'next/navigation'; // Next.js에서 제공하는 404 페이지로 이동시키는 함수
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Next.js 15부터는 주소창의 동적 세그먼트를 비동기적으로 바뀌었다. 안그러면 에러 남
interface TodoDetailPageProps {
  params: Promise<{ id: string }>; // 비동기적으로 params에서 id 추출 <- <String>이 될 수도 있다. 예언하는 느낌이기 때문에 비동기로 적용됨.
}

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = await params; // 비동기로 url의 queryString에서 id를 비동기로 추출하여 동기처럼 사용하는 거임. await 꼭 붙여야 함.
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 border rounded-xl shadow-lg bg-white">
      <Link href="/todos" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">
        ← 목록으로 돌아가기
      </Link>
      <div className="mb-2">
        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {todo.id}</span>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-gray-800">{todo.title}</h1>

      <div className="p-6 bg-gray-50 rounded-xl text-gray-700 leading-relaxed min-h-30">
        {todo.description ? todo.description : <span className="text-gray-400 italic">상세 설명이 없습니다.</span>}
      </div>

      <div className="mt-8 pt-6 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">생성일: {new Date(todo.createdAt).toLocaleDateString('ko-KR')}</span>

        <span
          className={`px-4 py-2 rounded-full text-sm font-bold
          ${todo.isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
        `}
        >
          {todo.isCompleted ? '완료됨' : '진행 중'}
        </span>
      </div>
    </div>
  );
}
