import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { prisma } from '@/lib/prisma';

export default async function TodosPage() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }, // 최신 글이 위로 오게
  });
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Todo List [Total : {todos.length}]</h1>
      <TodoForm />
      <ul className="space-y-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
