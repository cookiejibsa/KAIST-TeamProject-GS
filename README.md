# 오늘 뭐 먹지 - 혼밥 메뉴 추천

[사이트 바로가기](https://what2eattoday.up.railway.app/)

지금 내 상태(기분, 날씨, 예산)를 기반으로 메뉴를 추천하고, 먹은 기록과 통계를 계정별로 관리하는 **혼밥 특화 웹 서비스**입니다.

처음에는 프론트엔드 중심으로 제작했지만, 현재는 **React 프론트엔드와 Express 백엔드를 함께 구현한 구조**입니다. 추천, 로그인, 식사 기록, 영상 기록은 `/api` 서버와 연동됩니다.

## 기술 스택

### Frontend

- **React 18 + Vite**
- **TailwindCSS** - UI 스타일링
- **React Router** - 페이지 라우팅
- **Framer Motion** - 화면 전환, 커서, 카드 인터랙션
- **Recharts** - 월별 통계 차트

### Backend

- **Node.js + Express**
- **JWT** - 로그인 세션 토큰
- **bcryptjs** - 비밀번호 해시
- **JSON 파일 DB** - `server/honbap.json`
- **Google Gemini API** - AI 메뉴 추천, 미설정 시 로컬 추천 알고리즘으로 폴백
- **Helmet + rate limit** - 보안 헤더와 API 요청 제한

## 구현된 기능

| 기능 | 구현 위치 |
|---|---|
| 상태 기반 메뉴 추천 | `src/pages/Home.jsx`, `server/routes/recommend.js` |
| Gemini AI 추천 + 로컬 폴백 | `server/routes/recommend.js`, `server/lib/recommend.js` |
| 로컬 가중치 추천 엔진 | `src/lib/recommend.js`, `server/lib/recommend.js` |
| 랜덤 추천 모드 | `src/pages/CantDecide.jsx` |
| 회원가입 / 로그인 / 세션 복구 | `src/context/AuthContext.jsx`, `server/routes/auth.js` |
| 식사 기록 저장 / 삭제 / 별점 수정 | `src/context/AppContext.jsx`, `server/routes/records.js` |
| 기록 달력 + 식단 밸런스 알림 | `src/pages/History.jsx` |
| 월별 식비 / 카테고리 / 만족도 통계 | `src/pages/Stats.jsx` |
| YouTube 검색어 추천 및 검색 기록 저장 | `src/components/YoutubeRecommend.jsx`, `server/routes/videos.js` |
| 카카오맵 / 네이버지도 검색 연결 | `src/components/MapLink.jsx` |
| 메뉴 공유 | `src/components/ShareCard.jsx` |

## 페이지 구성

- `/` - 상태 입력 후 AI 메뉴 추천
- `/random` - 못 고르겠을 때 랜덤 추천
- `/history` - 식사 기록 달력, 영상 검색 기록
- `/stats` - 월별 식사 통계
- `/account` - 로그인, 회원가입, 프로필

## 추천 로직

### 서버 추천

1. 프론트에서 기분, 날씨, 예산, 최근 섭취 카테고리를 `/api/recommend/ai`로 전달합니다.
2. `GEMINI_API_KEY`가 있으면 Gemini가 메뉴와 추천 이유, 어울리는 사진을 선택합니다.
3. Gemini API가 없거나 실패하면 서버의 로컬 가중치 알고리즘으로 자동 폴백합니다.

### 로컬 가중치 알고리즘

1. 예산 조건으로 후보를 필터링합니다.
2. 날씨 태그와 기분 태그가 맞으면 점수를 더합니다.
3. 최근 3일 안에 먹은 카테고리는 감점합니다.
4. 남은 후보 중 점수 기반 가중치 랜덤으로 하나를 선택합니다.

## 데이터 저장

- 로그인 토큰: 브라우저 `localStorage`
- 마지막 추천 입력값: 브라우저 `localStorage`
- 사용자 계정, 식사 기록, 영상 검색 기록: `${DATA_DIR}/honbap.json` 또는 `server/honbap.json`

현재 DB는 별도 설치가 필요 없는 JSON 파일 기반입니다. Railway에서 데이터를 유지하려면 볼륨을 연결하고 `DATA_DIR=/data`처럼 볼륨 경로를 환경변수로 지정하는 것을 권장합니다.

실제 장기 운영용으로 확장할 경우 SQLite, PostgreSQL, MySQL 같은 DB로 교체할 수 있습니다.

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

Railway 배포도 루트의 `package.json` 기준으로 설치됩니다. `server/package.json`은 서버 단독 실행용으로 남아 있지만, 기본 실행에는 루트 설치만 필요합니다.

### 2. 서버 환경변수 설정

```bash
cp server/.env.example server/.env
```

`server/.env`에서 필요한 값을 설정합니다.

```env
GEMINI_API_KEY=여기에_Gemini_API_키_입력
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=32자_이상의_길고_랜덤한_문자열
DATA_DIR=
PORT=3001
```

`GEMINI_API_KEY`가 없어도 서비스는 실행됩니다. 이 경우 AI 추천 대신 로컬 추천 알고리즘을 사용합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

- 프론트엔드: `http://localhost:5173`
- 백엔드 API: `http://localhost:3001`
- Vite 개발 서버가 `/api` 요청을 백엔드로 프록시합니다.

### 4. 빌드

```bash
npm run build
```

### 5. 프로덕션 실행

```bash
npm start
```

프로덕션에서는 Express 서버가 `dist` 폴더의 React 빌드 결과와 `/api` 엔드포인트를 같은 포트에서 함께 제공합니다.

## API 개요

| Method | Path | 설명 |
|---|---|---|
| `POST` | `/api/auth/signup` | 회원가입 |
| `POST` | `/api/auth/login` | 로그인 |
| `GET` | `/api/auth/me` | 현재 로그인 사용자 확인 |
| `GET` | `/api/records` | 식사 기록 조회 |
| `POST` | `/api/records` | 식사 기록 추가 |
| `DELETE` | `/api/records/:id` | 식사 기록 삭제 |
| `PATCH` | `/api/records/:id/rating` | 별점 수정 |
| `GET` | `/api/videos` | 영상 검색 기록 조회 |
| `POST` | `/api/videos` | 영상 검색 기록 저장 |
| `POST` | `/api/recommend/ai` | AI 메뉴 추천 |
| `POST` | `/api/recommend/videos` | AI 영상 검색어 추천 |
| `GET` | `/api/health` | 서버 상태 확인 |

## Railway 배포

이 프로젝트는 Railway에서 **하나의 서비스**로 배포하는 것을 기준으로 구성되어 있습니다.

권장 설정:

- Build command: `npm run build`
- Start command: `npm start`
- Root directory: 프로젝트 루트

필수 환경변수:

```env
JWT_SECRET=32자_이상의_길고_랜덤한_문자열
```

선택 환경변수:

```env
GEMINI_API_KEY=Gemini_API_키
GEMINI_MODEL=gemini-2.5-flash
CLIENT_ORIGIN=https://별도_프론트엔드_도메인
DATA_DIR=/data
```

프론트와 백엔드를 같은 Railway 서비스로 배포하면 `CLIENT_ORIGIN`은 필요 없습니다. React 앱이 같은 도메인의 `/api`로 요청하기 때문입니다.

프론트와 백엔드를 서로 다른 서비스나 다른 도메인으로 나누어 배포했다면, 백엔드 서비스에 `CLIENT_ORIGIN`을 프론트 도메인으로 설정해야 브라우저 CORS 차단을 피할 수 있습니다.

### 보안 체크리스트

- `JWT_SECRET`은 기본값을 쓰지 말고 32자 이상의 랜덤 문자열로 설정합니다.
- `server/.env`와 `server/honbap.json`은 저장소에 올리지 않습니다.
- Railway에서 데이터를 유지하려면 볼륨을 연결하고 `DATA_DIR`을 볼륨 경로로 설정합니다.
- 같은 서비스에 프론트/백엔드를 함께 배포하면 API는 같은 도메인의 `/api`로만 접근됩니다.
- 로그인/회원가입과 추천 API에는 rate limit이 적용되어 무차별 요청을 제한합니다.

## 확장 포인트

- `server/honbap.json`을 실제 DB로 교체
- Gemini 프롬프트 고도화 및 추천 설명 개선
- Kakao Map JS SDK를 사용한 지도 임베드
- 메뉴 데이터 관리 API 추가
- 배포 환경에 맞춘 CORS, JWT secret, HTTPS 설정
