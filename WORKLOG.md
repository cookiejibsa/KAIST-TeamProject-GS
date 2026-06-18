# Worklog

Last updated: 2026-06-18

## Current Goal

Railway 배포 시 502가 뜨는 문제를 확인하고, Gemini 기반 음식 추천/영상 추천/사진 배경 기능이 실제로 연결되어 있는지 점검 및 수정했다.

## What Was Found

- Railway 502의 가장 유력한 원인은 production 환경에서 `JWT_SECRET`이 없거나 placeholder 값이면 서버가 시작 전에 종료되는 것이었다.
- `server/middleware/auth.js`는 Railway/production 환경에서 강한 `JWT_SECRET`을 필수로 요구한다.
- `.env`를 GitHub에 올리지 않는 것은 정상이다. Railway에는 GitHub의 `.env`가 자동으로 올라가지 않으므로 Railway `Variables`에 직접 넣어야 한다.
- 기존 Gemini 모델명 `gemini-1.5-flash`는 현재 API에서 404가 났다.
- 음식 추천은 Gemini 호출과 사진 URL 연결이 되어 있었지만, 영상 추천은 Gemini가 아니라 프론트 로컬 키워드 조합만 사용하고 있었다.

## Changes Made

### Environment Loading

- `server/index.js`
  - 루트 `.env`와 `server/.env`를 둘 다 읽도록 수정했다.
  - 루트에서 `npm start`를 실행해도 서버 쪽 환경변수가 반영된다.

### Gemini Model

- `server/routes/recommend.js`
  - 기본 Gemini 모델을 `gemini-2.5-flash`로 변경했다.
  - `GEMINI_MODEL` 환경변수로 모델명을 바꿀 수 있게 했다.

- `server/.env.example`
  - `GEMINI_MODEL=gemini-2.5-flash` 예시를 추가했다.

- `README.md`
  - Railway 환경변수와 API 목록에 `GEMINI_MODEL`, `/api/recommend/videos` 내용을 반영했다.

### Food Recommendation

- `server/routes/recommend.js`
  - `/api/recommend/ai`에서 Gemini 응답 JSON 파싱을 더 튼튼하게 만들었다.
  - Gemini가 메뉴와 사진 ID를 고르면 서버가 `photoUrl`을 내려준다.

- `src/pages/Home.jsx`
  - Gemini 호출 실패 또는 서버 로컬 폴백 시 음식 추천 카드 위에 작은 안내를 표시하도록 수정했다.
  - 표시 문구:
    - `Gemini 호출이 되지 않아 로컬 추천으로 보여드려요.`
    - `Gemini 응답 메뉴를 확인하지 못해 로컬 추천으로 보여드려요.`

### Video Recommendation

- `server/routes/recommend.js`
  - 새 API 추가: `POST /api/recommend/videos`
  - Gemini가 유튜브 검색어 3개를 추천한다.
  - Gemini 키가 없거나 호출이 실패하면 기존 로컬 키워드 추천으로 폴백한다.

- `src/components/YoutubeRecommend.jsx`
  - 기존 로컬 키워드 생성 대신 서버 API를 먼저 호출하도록 수정했다.
  - Gemini 호출 중 로딩 표시를 추가했다.
  - 결과가 Gemini에서 왔으면 `Gemini AI 영상 추천`, 로컬 폴백이면 `로컬 영상 추천` 표시를 띄운다.

## Verification Done

- `npm run build` 성공.
- `NODE_ENV=production npm start`에서 `JWT_SECRET`이 없으면 서버가 죽는 것을 재현했다.
- 강한 `JWT_SECRET`을 넣으면 production 모드 서버가 정상 기동하는 것을 확인했다.
- Gemini 직접 호출 테스트 성공:
  - model: `gemini-2.5-flash`
  - response: `OK`
- 음식 추천 API 확인:
  - `POST /api/recommend/ai`
  - `source: "ai"`
  - `photoUrl` 반환 확인.
- 영상 추천 API 확인:
  - `POST /api/recommend/videos`
  - `source: "ai"`
  - 유튜브 검색어 3개 반환 확인.
- 실제 브라우저/headless Chrome 화면 확인:
  - 음식 추천 카드에 `Gemini AI 추천` 표시 확인.
  - 음식 추천 카드 배경 이미지가 `photoUrl`로 표시되는 것 확인.
  - 영상 추천 영역에 `Gemini AI 영상 추천` 표시 확인.
  - Gemini 키를 비운 상태에서 작은 로컬 폴백 안내 문구가 표시되는 것 확인.

## Important Railway Variables

Railway `Variables`에 직접 넣어야 한다. GitHub에 `.env`를 올리면 안 된다.

```env
JWT_SECRET=32자_이상의_강한_랜덤값
GEMINI_API_KEY=Gemini_API_키
GEMINI_MODEL=gemini-2.5-flash
```

Do not set `PORT` manually on Railway. The server already uses `process.env.PORT`.

Optional:

```env
DATA_DIR=/data
CLIENT_ORIGIN=https://별도_프론트엔드_도메인
```

`CLIENT_ORIGIN`은 프론트와 백엔드를 같은 Railway 서비스로 배포하면 보통 필요 없다.

## Railway Deploy Settings

Recommended:

```text
Root directory: project root
Build command: npm run build
Start command: npm start
```

## Local Files With Secrets

These files are intentionally ignored by Git:

- `.env`
- `server/.env`

Do not paste real secret values into tracked files.

## Modified Files

- `README.md`
- `server/.env.example`
- `server/index.js`
- `server/routes/recommend.js`
- `src/components/YoutubeRecommend.jsx`
- `src/pages/Home.jsx`
- `WORKLOG.md`

## Next Checks

- Railway `Variables`에 `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`이 들어갔는지 확인한다.
- Railway에서 redeploy한다.
- 배포 후 `/api/health`가 200인지 확인한다.
- 웹에서 음식 추천을 눌렀을 때 `Gemini AI 추천`이 보이는지 확인한다.
- 웹에서 영상 추천을 눌렀을 때 `Gemini AI 영상 추천`이 보이는지 확인한다.
- 만약 작은 로컬 폴백 안내가 보이면 Railway 로그에서 Gemini API 오류 또는 환경변수 누락을 확인한다.
