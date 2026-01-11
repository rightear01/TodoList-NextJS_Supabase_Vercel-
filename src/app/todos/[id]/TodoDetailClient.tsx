'use client';

import { Todo } from '@prisma/client';
import Link from 'next/link';
import useTodoEdit from '../Hooks/useTodoEdit';

export default function TodoDetailClient({ todo }: { todo: Todo }) {
  const {
    editingId,
    editTitle,
    editDesc,
    setEditTitle,
    startEditing,
    setEditDesc,
    cancelEditing,
    saveEdit,
  } = useTodoEdit();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 border rounded-xl shadow-lg bg-white">
      <div className="flex justify-between">
        <Link
          href="/todos"
          className="text-gray-500 hover:text-blue-600 mb-6 inline-block"
        >
          ← 목록으로 돌아가기
        </Link>
        <span
          className={`px-4 py-3 rounded-full text-sm font-bold
                ${todo.isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
              `}
        >
          {todo.isCompleted ? '완료됨' : '진행 중'}
        </span>
      </div>

      <div className="mb-2">
        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
          ID: {todo.id}
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {editingId === todo.id ?(
          <textarea
            className="w-full p-2 border rounded-md h-15"
            value={editTitle}
            onChange={(e)=> setEditTitle(e.target.value)}
          />
        ) : (
        <div>
          {todo.title ? (
              todo.title
          ) : (
              <span className="text-gray-400 italic">No Title</span>
          )}
        </div>
      )}
      </h1>
      <div className="p-6 bg-gray-50 rounded-xl text-gray-700 leading-relaxed min-h-30">
        {editingId === todo.id ? (
          <textarea
            className="w-full h-full p-2 border rounded-md"
            value={editDesc}
            onChange={(e)=> setEditDesc(e.target.value)}
          />
        ) : (
          <div className="min-h-25">
            {todo.description ? (
               todo.description
            ) : (
               <span className="text-gray-400 italic">상세 설명이 없습니다.</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-8 pt-6 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">
          생성일: {new Date(todo.createdAt).toLocaleDateString('ko-KR')}
        </span>
        <div>
          {editingId === todo.id ? (
            <div>
              <button
                onClick={() => saveEdit()}
                className="px-4 py-2 rounded-full text-sm font-bold mr-2 bg-blue-100 text-blue-700 cursor-pointer"
            >
                저장하기
              </button>
              <button
                onClick={() => cancelEditing()}
                className="px-4 py-2 rounded-full text-sm font-bold mr-2 bg-red-100 text-red-700 cursor-pointer"
              >
                취소하기
              </button>
            </div>
          ) : (
            <button
              onClick={() => startEditing(todo)}
              className="px-4 py-2 rounded-full text-sm font-bold mr-2 bg-green-100 text-green-700 cursor-pointer"
            >
            수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
