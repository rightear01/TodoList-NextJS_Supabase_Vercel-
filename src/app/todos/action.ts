'use server'; // Note : 이 지시문은 서버 측에서만 실행되는 코드를 나타냅니다.
// Todo 항목 추가 액션 함수
// FormData에서 제목 추출
// FormData는 폼 제출 시 서버로 전송되는 데이터입니다.

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma'; // 프리즈마 클라이언트 가져오기
import { auth } from '@clerk/nextjs/server';

// 1. 할 일 추가 (Create)
export async function addTodoAction(formData: FormData) {
  try {
    const title = formData.get('title')?.toString();
    if (!title) return { success: false, error: 'Title is required' };

    const description = formData.get('description')?.toString();

    const { userId } = await auth();
    if (!userId) return { success: false, error: 'User not authenticated' };

    await prisma.todo.create({
      data: {
        title,
        description,
        isCompleted: false,
        userId: userId,
      },
    });

    revalidatePath('/todos');
    return { success: true };
  } catch (e) {
    return { success: false, error: `${e}` };
  }
}

// 2. 할 일 삭제 (Delete)
export async function deleteTodoAction(id: string, userId: string) {
  try {
    await prisma.todo.delete({
      where: { id, userId }, // id가 일치하는 녀석 삭제
    });
    revalidatePath('/todos');
  } catch (e) {
    return { success: false, error: `${e}` };
  }
}

// 3. 할 일 완료 토글 (Update)
export async function toggleTodoAction(id: string, isCompleted: boolean, userId: string) {
  try {
    await prisma.todo.update({
      where: { id, userId },
      data: {
        isCompleted: isCompleted,
      },
    });

    revalidatePath('/todos');
    return { success: true };
  } catch (e) {
    return { success: false, error: `${e}` };
  }
}
