import { clerkMiddleware } from '@clerk/nextjs/server';

// 이 코드 한 줄이면 Clerk가 모든 보안 검사를 알아서 합니다.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Next.js 내부 파일(_next)과 정적 파일(이미지 등)은 검사 제외
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API 라우트와 tRPC 라우트는 항상 검사
    '/(api|trpc)(.*)',
  ],
};
