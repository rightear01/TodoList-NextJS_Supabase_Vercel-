'use server'; // Note : 이 지시문은 서버 측에서만 실행되는 코드를 나타냅니다.
// Todo 항목 추가 액션 함수
// FormData에서 제목 추출
// FormData는 폼 제출 시 서버로 전송되는 데이터입니다.

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma'; // 프리즈마 클라이언트 가져오기
import { auth } from '@clerk/nextjs/server';
import { createTodoSchema } from './schema';
import { ActionResponse } from '../types';
import { Todo } from '@prisma/client';

// 1. 할 일 추가 (Create)
export async function addTodoAction(formData: FormData): Promise<ActionResponse<Todo>> {
  try {
    // 1. FormData에서 값 꺼내기
    // (여기서는 아직 'string | File | null' 등 무엇인지 모르는 상태)
    const rawInput = {
      title: formData.get('title'),
      description: formData.get('description'),
    };

    // 2. Zod 검증 수행
    const validation = createTodoSchema.safeParse(rawInput);

    if (!validation.success) {
      return { success: false, error: '입력값이 올바르지 않습니다.' };
    }

    // validation.success가 true면, validation.data는 
    // 자동으로 'CreateTodoInput' 타입(title: string)으로 추론된다.
    // 더 이상 'as ...'로 타입을 우겨넣을 필요 없음.
    
    // validation.data = { title: string, description?: string | null }
    const validData = validation.data; 

    const { userId } = await auth();
    if (!userId) return { success: false, error: 'User not authenticated' };

    const newTodo = await prisma.todo.create({
      data: {
        title: validData.title, // 이제 TS가 string임을 100% 확신함
        description: validData.description,
        isCompleted: false,
        userId: userId,
      },
    });

    revalidatePath('/todos');
    return { success: true, data: newTodo };
  } catch (e) {
    return { success: false, error: `${e}` };
  }
}

// 2. 할 일 삭제 (Delete)
export async function deleteTodoAction(id: string) : Promise<ActionResponse>{
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'User not authenticated' };

    await prisma.todo.delete({
      where: { id, userId }, // id가 일치하는 녀석 삭제
    });
    revalidatePath('/todos');
    return { success : true, data: undefined }
  } catch (e) {
    return { success: false, error: `${e}` };
  }
}

// 3. 할 일 완료 토글 (Update)
export async function toggleTodoAction(id: string, isCompleted: boolean) : Promise<ActionResponse<Todo>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    const newTodo = await prisma.todo.update({
      where: { id, userId },
      data: {
        isCompleted: isCompleted,
      },
    });
    
    revalidatePath('/todos');
    return { success: true, data : newTodo };
  } catch (e) {
    return { success: false, error: `${e}` };
  }
}
