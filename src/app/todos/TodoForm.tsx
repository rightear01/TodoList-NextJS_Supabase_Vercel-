'use client'; // useRef를 사용하기 위해 클라이언트 컴포넌트로 설정

import { useRef, useState } from 'react';
import { addTodoAction } from './action';
import SubmitButton from './SubmitButton';

export default function TodoForm() {
  // 상태 관리
  const [isOpen, setIsOpend] = useState(false);
  const [title, setTitle] = useState('');

  // 제네릭 폼 참조 생성
  // 제네릭 : HTMLFormElement 타입을 지정하여 폼 요소에 대한 참조를 얻음
  // 해당 함수가 다룰 데이터 타입을 미리 정해놓는 것
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleInitialClick = () => {
    if (!title.trim()) {
      titleInputRef.current?.focus();
      alert('할 일 내용을 입력해주세요.');
      return;
    }

    setIsOpend(true);
  };

  const handleFinalSubmit = async (formData: FormData) => {
    await addTodoAction(formData);

    setIsOpend(false);
    setTitle('');
  };

  return (
    <div className="mb-8 w-full">
      <div className="flex gap-2">
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleInitialClick();
          }}
          placeholder="Input your todo"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleInitialClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold shadow-lg text-lg text-shadow-2xs"
        >
          ADD
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">상세 내용 입력</h3>
                <button onClick={() => setIsOpend(false)} className="text-gray-500 hover:text-red-500 text-xl">
                  &times;
                </button>
              </div>
              <form action={handleFinalSubmit} className="p-6 flex flex-col gap-4">
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
                    onClick={() => setIsOpend(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    취소
                  </button>
                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
