'use client';

import { Todo } from '../types';
import toast from 'react-hot-toast';
import TodoItem from './TodoItem';
import { addTodoAction, toggleTodoAction, deleteTodoAction } from './action';
import { useOptimistic, useRef, useState, useTransition } from 'react';
import SubmitButton from './SubmitButton';
import Search from './Search';
import { useSearchParams } from 'next/navigation';
import TodoFilter from './components/TodoFilter';
import { UserButton } from '@clerk/nextjs';

type OptimisticAction =
  | { type: 'ADD'; payload: Todo }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'DELETE'; payload: string }

export default function TodoList({ initialTodos, userId }: { initialTodos: Todo[]; userId: string | null }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpend] = useState(false);
  const [title, setTitle] = useState('');
  const [isPanding, startTransition] = useTransition();

  // 1st Param : 초기 상태 값
  // 2nd Param : 낙관적 업데이트를 처리하는 함수
  // const [optimisticTodos, addOptimisticTodo] = useOptimistic(initialTodos, (state, newTodo: Todo) => [
  //   newTodo,
  //   ...state,
  // ]);
  const [optimisticTodos, dispatchOptimisticTodo] = useOptimistic(initialTodos, (state, action: OptimisticAction) => {
    {
      switch (action.type) {
        case 'ADD':
          return [action.payload, ...state];
        case 'TOGGLE':
          return state.map((todo) => (todo.id === action.payload ? { ...todo, isCompleted: !todo.isCompleted } : todo));
        case 'DELETE':
          return state.filter((todo) => todo.id !== action.payload);
        default:
          return state;
      }
    }
  });

  const handleInitialClick = () => {
    if (!title.trim()) {
      titleInputRef.current?.focus();
      toast.error('제목을 입력해주세요.');
      return;
    }
    setIsOpend(true);
  };

  // TypeScript는 자동 추론이 내재되어 있다.
  // 만약 지정한 타입에서 벗어나는 경우의 수가 생기는 경우에는 문제가 발생한다.
  // 때문에, 문제가 될 수 있는 경우의 수는 분기 처리와 같은 방법으로 해결해야한다.
  const handleAddTodo = async (formData: FormData) => {
    const title = formData.get('title');
    if(typeof title !== 'string' || !title.trim()){
      toast.error('제목에 문제가 있습니다.');
      return;
    }

    const newTodo: Todo = {
      id: Math.random().toString(),
      title: title,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      userId: userId ? userId : '',
      description: '',
    };

    startTransition(async () => {
      // 낙관적 업데이트 함수 호출 <- UI 즉시 반영
      dispatchOptimisticTodo({ type: 'ADD', payload: newTodo });

      // 실제 서버 액션 호출 <- 데이터베이스에 반영
      const result = await addTodoAction(formData);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('할 일이 추가되었습니다!');
        setTitle('');
        setIsOpend(false);
      }
    });
  };

  const handleToggleTodo = async (id: string) => {
    const todo = optimisticTodos.find((t) => t.id === id);
    if (!todo) return;
    startTransition(async () => {
      dispatchOptimisticTodo({ type: 'TOGGLE', payload: id });
      // 실제 서버 액션 호출 <- 데이터베이스에 반영
      const result = await toggleTodoAction(id, !todo.isCompleted);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  };

  // Todo 삭제 핸들러
  const handleDelete = async (id: string) => {
    startTransition(async () => {
      dispatchOptimisticTodo({ type: 'DELETE', payload: id });
      const result = await deleteTodoAction(id);
      if (!result.success) {
        toast.error(result.error);
      }else toast.success('삭제가 완료되었습니다.');
    });
  };

  return (
    <div className="mb-8 sm:w-full">
      <div className='flex justify-between'>
        <TodoFilter/>
        <UserButton />
      </div>
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
          {optimisticTodos.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg border border-gray-300 mt-5'>
              {query ? (
                <p className='text-gray-500 text-lg'>
                  <span className='font-bold text-gray-700'>`{query}`</span>에 대한 검색 결과가 없습니다.
                </p>
              ) : (
                <p className='text-gray-500 text-lg'>
                  할 일이 아직 없습니다.<br/>
                  새로운 Todo를 생성해 보세요!
                </p>
              )}
            </div>
          ) : (
            <ul className='mt-5'>
              {
                optimisticTodos.map(todo => (
                  // handleDelete(todo.id) 의미: "리액트야, 지금 당장 이 함수를 실행하고, 그 결과값을 onDelete에 넣어줘"
                  // . () => handleDelete(todo.id) 의미: "리액트야, 사용자가 이 버튼을 클릭하면 나중에 이 함수를 실행해 줘"
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onDelete={() => handleDelete(todo.id)} 
                    onToggle={() => handleToggleTodo(todo.id)}/>
                ))
              }
            </ul>
          )
          }
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
