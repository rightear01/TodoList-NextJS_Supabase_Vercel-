// /todo/1, /todo/pizzo, /todo/anything 뒤에 모가 오든 이 페이지가 처리하겠다는 뜻
// SupaBase : 울가족7@

import { notFound } from 'next/navigation'; // Next.js에서 제공하는 404 페이지로 이동시키는 함수
import { prisma } from '@/lib/prisma';
import TodoDetailClient from './TodoDetailClient';

// Next.js 15부터는 주소창의 동적 세그먼트를 비동기적으로 바뀌었다. 안그러면 에러 남
interface TodoDetailPageProps {
  params: Promise<{ id: string | null }>; // 비동기적으로 params에서 id 추출 <- <String>이 될 수도 있다. 예언하는 느낌이기 때문에 비동기로 적용됨.
}

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = await params; // 비동기로 url의 queryString에서 id를 비동기로 추출하여 동기처럼 사용하는 거임. await 꼭 붙여야 함.
  const todo = id
    ? await prisma.todo.findUnique({
        where: { id },
      })
    : null;
  if (!todo) {
    notFound();
  }
  
  return (
    <TodoDetailClient todo={todo}/>
  );
}