import { z } from 'zod';
// 1. zod
export const createTodoSchema = z.object({
  title: z.string().min(1, { message: '제목은 필수입니다.' }),
  description: z.string().optional().nullable(), // 있어도 없어도 괜찮음.
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
