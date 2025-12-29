import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. 로그인 없이도 볼 수 있는 '공개 경로'를 정의합니다.
const isPublicRoute = createRouteMatcher(['/', '/todos(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // 2. 공개 경로가 아니라면 보안 검사를 수행합니다.
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
