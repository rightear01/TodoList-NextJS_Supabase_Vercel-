export interface Todo {
  id: string;
  title: string;
  // 1. description이 null일 수도 있다고 허용해줍니다.
  description?: string | null;
  isCompleted: boolean;
  // 2. createdAt은 이제 숫자가 아니라 진짜 날짜 객체(Date)입니다.
  createdAt: Date;
}
