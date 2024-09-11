my-project/
├── server/ # 서버 (Node.js + Express)
│ ├── src/
│ │ └── index.ts # 서버 코드
│ ├── package.json # 서버 의존성
│ └── tsconfig.json # 서버 TypeScript 설정
└── client/ # 클라이언트 (Vanilla JS + TypeScript)
├── src/ # 클라이언트 소스 코드
│ ├── index.ts # TypeScript 진입 파일
│ ├── app.ts # 애플리케이션 로직
│ └── style.css # 스타일 파일
├── dist/ # 번들된 결과물
├── package.json # 클라이언트 의존성
├── tsconfig.json # 클라이언트 TypeScript 설정
└── index.html # HTML 파일

## Port 확인

lsof -i :5000

kill -9 <PID>
