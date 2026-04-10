# Todo App Mini Project

`미니_프로젝트-개인.md` 형식에 맞춰 만든 Todo 미니 프로젝트입니다.

## 구조

```text
todo-app/
|- frontend/   # React + Vite
|- backend/    # Express + MongoDB Atlas
|- vercel.json
|- README.md
```

## 기술 스택

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas + Mongoose
- Deployment: Vercel

## 실행 방법

1. 백엔드 의존성 설치
   `npm.cmd install --prefix backend`
2. 프론트엔드 의존성 설치
   `npm.cmd install --prefix frontend`
3. 백엔드 실행
   `npm.cmd run dev:backend`
4. 프론트엔드 실행
   `npm.cmd run dev:frontend`

프론트엔드는 `/api` 요청을 `http://localhost:5000`으로 프록시합니다.

## 환경 변수

`backend/.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

배포 시에는 Vercel 프로젝트 환경 변수에 `MONGODB_URI`를 추가해야 합니다.

## 구현 기능

- Todo 추가
- Todo 목록 조회
- Todo 완료 체크
- Todo 삭제

## 배포 메모

- API 라우트는 `backend/index.js`를 Vercel Node 함수로 사용합니다.
- 프론트엔드는 Vite 빌드 결과물을 정적 사이트로 배포합니다.
