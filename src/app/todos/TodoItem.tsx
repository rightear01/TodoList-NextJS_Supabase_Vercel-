'use client';

import { Todo } from '../types';
import Link from 'next/link';
import { useTransition } from 'react';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = () => {
    startTransition(() => {
      onToggle();
    });
  };

  const handleDelete = () => {
    startTransition(() => {
      onDelete();
    });
  };

  // 💡 날짜 포맷팅 (Pro Tip: 안전하게 new Date 한 번 더 감싸주기)
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <li className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleChange}
          disabled={isPending}
          className="w-5 h-5 accent-blue-600 cursor-pointer"
        />
        <Link href={`/todos/${todo.id}`} className="flex-1 min-w-0">
          <div className="flex flex-col">
            <span
              className={`truncate text-lg transition-colors ${
                todo.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
              }`}
            >
              {todo.title}
            </span>
            <span className="text-xs text-gray-400">{formatDate(todo.createdAt)}</span>
          </div>
        </Link>
      </div>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="ml-4 px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      >
        {isPending ? '삭제 중...' : '삭제'}
      </button>
    </li>
  );
}
