export interface Todo {
  id: string;
  title: string;
  // 1. description이 null일 수도 있다고 허용해줍니다.
  description?: string | null;
  isCompleted: boolean;
  // 2. createdAt은 이제 숫자가 아니라 진짜 날짜 객체(Date)입니다.
  createdAt: Date;
  userId: string;
}

// T = void : 데이터를 반환하지 않는 경우(삭제 등)를 위해 기본값을 void로 설정
export type ActionResponse<T = void> =
  | { success: true; data: T }          // 성공 시: data가 반드시 있음 (void면 없어도 됨)
  | { success: false; error: string };  // 실패 시: error 메시지가 반드시 있음

export type AuthResponse = string | null;
  

