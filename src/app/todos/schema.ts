import { z } from 'zod';
// 1. zod
export const createTodoSchema = z.object({
  title: z.string().min(1, { message: '제목은 필수입니다.' }),
  // optional()은 undefined 허용, nullable()은 null 허용 -> DB의 String?과 완벽 매칭
  description: z.string().optional().nullable(), 
});

// zod가 위의 createTodoSchema를 보고 변경 내용으로 적용
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
