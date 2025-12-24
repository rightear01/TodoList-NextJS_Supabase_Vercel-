import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { prisma } from '@/lib/prisma';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Todo } from '../types';

async function fetchTodos() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  // 👇 2. 내 ID(`userId`)를 가진 투두만 찾아오기
  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: 'desc' },
  });

  return todos as Todo[];
}

export default async function TodosPage() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const todos = await fetchTodos();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-shadow-lg text-white">Personal Todo List</h1>
        <div className="w-[80%] h-[1px] bg-gray-200 mb-20" />
        <div className="flex gap-4 items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-sm min-h-[80px] text-3xl px-4 py-2 bg-blue-500 font-bold text-white rounded hover:bg-blue-600 cursor-pointer shadow-lg text-shadow-lg transition">
                Login
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      <div className="flex flex-col items-center mb-8 w-full">
        <SignedIn>
          <h1 className="text-2xl font-bold mb-6 w-full flex justify-between items-center  text-shadow-lg text-gray-700">
            Todo List [Total : {todos.length}]{' '}
            <div className="transform scale-130 pr-6">
              <UserButton />
            </div>
          </h1>
          <TodoForm />
          <ul className="space-y-4 w-full">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </SignedIn>
      </div>
    </div>
  );
}
