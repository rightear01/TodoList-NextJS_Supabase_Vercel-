'use client';

import { Todo } from '../types';
import TodoItem from './TodoItem';
import { addTodoAction } from './action';
import { useOptimistic, useRef, useState, useTransition } from 'react';
import SubmitButton from './SubmitButton';
import Search from './Search';

export default function TodoList({ initialTodos, userId }: { initialTodos: Todo[]; userId: string | null }) {
  // 1st Param : 초기 상태 값
  // 2nd Param : 낙관적 업데이트를 처리하는 함수
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(initialTodos, (state, newTodo: Todo) => [
    newTodo,
    ...state,
  ]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpend] = useState(false);
  const [title, setTitle] = useState('');

  const [isPanding, startTransition] = useTransition();

  const handleInitialClick = () => {
    if (!title.trim()) {
      titleInputRef.current?.focus();
      alert('할 일 내용을 입력해주세요.');
      return;
    }

    setIsOpend(true);
  };

  const handleAddTodo = async (formData: FormData) => {
    const title = formData.get('title') as string;

    const newTodo: Todo = {
      id: Math.random().toString(),
      title,
      isCompleted: false,
      createdAt: new Date(),
      userId: userId ? userId : '',
      description: '',
    };

    startTransition(async () => {
      // 낙관적 업데이트 함수 호출 <- UI 즉시 반영
      addOptimisticTodo(newTodo);

      // 폼 초기화
      setTitle('');

      // 실제 서버 액션 호출 <- 데이터베이스에 반영
      await addTodoAction(formData);

      setIsOpend(false);
    });
  };

  return (
    <div className="mb-8 sm:w-full">
      <div className="fle-col gap-2 ">
        <div className="flex justify-between w-full gap-2 h-full max-sm:flex-col sm:flex-row">
          <Search />
          <div className="flex">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInitialClick();
              }}
              placeholder="Input your todo"
              className="flex-1 p-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-1 h-full"
            />
            <button
              type="button"
              onClick={handleInitialClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-sm hover:bg-blue-700 transition font-bold shadow-lg text-shadow-2xs h-full"
            >
              ADD
            </button>
          </div>
        </div>

        <ul className="mt-5">
          {optimisticTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg text-white text-shadow-lg">Description</h3>
                <button
                  onClick={() => !isPanding && setIsOpend(false)}
                  className={`text-gray-500 hover:text-red-500 text-xl ${
                    isPanding ? 'invisible' : 'hover:text-red-500'
                  }`}
                >
                  &times;
                </button>
              </div>
              <form action={handleAddTodo} className="p-6 flex flex-col gap-4">
                <input type="hidden" name="title" value={title} />
                <div className="text-xl font-bold text-blue-600 mb-2">{title}</div>
                <textarea
                  name="description"
                  placeholder="상세 설명을 입력하세요 (선택사항)"
                  className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    disabled={isPanding}
                    onClick={() => setIsOpend(false)}
                    className="px-6 py-3 rounded-lg font-bold transition text-red-600 hover:bg-gray-100"
                  >
                    CANCEL
                  </button>
                  <SubmitButton isPanding={isPanding} />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
