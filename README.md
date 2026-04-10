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

- Vercel에서는 Root Directory를 저장소 전체로 설정합니다.
- API는 `api/[...all].js`가 `backend/index.js`를 불러와 서버리스 함수로 처리합니다.
- 프론트엔드는 `frontend/dist`를 정적 사이트로 배포합니다.
- Vercel 환경 변수에 `MONGODB_URI`를 반드시 추가해야 합니다.
