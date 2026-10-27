# konkuk-icteam-fe

건국대학교 정보운영팀에서 운영하는 모든 프로젝트 FE를 관리하는 저장소. pnpm + Turborepo 모노레포 (`apps/*`, `packages/*`).

## 전역 코딩 컨벤션

코드 스타일(네이밍, 조건문, export 규칙, 타입 선언 등)의 유일한 기준 문서는 [`docs/conventions.md`](docs/conventions.md)다. 다른 곳에 다시 옮겨 적지 않는다 — 여기 한 곳만 갱신하면 된다.

## Git 컨벤션

브랜치명, 커밋 메시지, PR/이슈 제목 형식은 [`docs/git-conventions.md`](docs/git-conventions.md) 기준을 따른다.

## 공통 명령어

루트에서 (turbo로 각 앱/패키지에 위임):

```bash
pnpm dev            # 전체 dev 서버
pnpm build           # 전체 빌드
pnpm lint            # 전체 lint
pnpm format          # prettier 전체 포맷
pnpm format:check    # prettier 포맷 검사만
```

## 패키지 구성

- `apps/*`: 실제 서비스 앱 (`apps/worklog` 업무일지, `apps/commute` 출근부)
- `packages/eslint-config`, `packages/typescript-config`, `packages/tailwind-config`: 앱 전역 공통 설정
- `packages/design-system`: 모든 앱이 쓰는 UI 컴포넌트(`/ui`), 아이콘(`/assets`), 유틸(`/cn`, `/date`). 앱에서 비슷한 컴포넌트를 새로 만들기 전에 여기 있는지 먼저 확인한다
