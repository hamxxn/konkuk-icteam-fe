# 모노레포

모노레포는 두 개 이상의 프로젝트가 동일한 저장소(Repository)에서 관리되는 소프트웨어 개발 전략이다. 하지만 프로젝트를 저장소 하나에 물리적으로 욱여넣었다고 해서 모노레포를 구성했다고는 할 수 없다. 모노레포에서 중시되는 것은 패키지와 프로젝트의 관계다. 워크스페이스에 있는 코드들이 알맞은 관계를 구성해서 코드의 재사용성을 크게 높일 수 있어야 잘 구축된 모노레포라고 할 수 있다.

## 모노레포가 해결하는 멀티레포 문제

분리된 모듈들은 모노레포에서 여전히 독자 프로젝트로 존재하지만 저장소는 같은 곳을 사용한다.

**1. 더 쉬운 프로젝트 생성**

멀티레포에서 공유 패키지를 만들려면 저장소 생성 → 커미터 추가 → 개발환경 구축 → CI/CD 구축 → 빌드 → 패키지 저장소에 publish 과정을 거친다. 모노레포에서는 저장소 생성·커미터 추가가 필요 없고, 개발 환경·CI/CD·빌드·게시는 기존 DevOps를 그대로 쓰므로 새 프로젝트 생성 오버헤드가 없다.

**2. 더 쉬운 의존성 관리**

의존성 패키지가 같은 저장소에 있으므로, 버전이 지정된 패키지를 npm registry 같은 곳에 publish할 필요가 없다.

### 모노레포가 멀티레포보다 항상 나은가?

그렇지 않다. 멀티레포의 단점이 모노레포의 장점이고 장단점이 교차하기 때문에 적절한 상황에서 써야 한다. 모노레포가 적절한 상황:

- 유사한 제품의 집합
- 여러 프로젝트의 변화를 한눈에 파악해야 할 때
- 호스트 애플리케이션을 플러그인 등으로 확장할 때
- 공통 기능을 재사용하는 관련된 프로젝트의 집합
- 유사한 DevOps로 구성된 프로젝트의 집합

## konkuk-icteam-fe에서 모노레포가 필요한 이유

건국대학교 정보운영팀은 여러 프로젝트(현재 업무일지 `worklog`, 출근부 등,,)의 FE를 동시에 운영한다. 각 프로젝트가 분리된 저장소로 관리되면 다음이 프로젝트마다 중복된다.

- 공통 스타일 토큰 (color, typography 등 디자인 시스템)
- SVG 아이콘 및 이미지 리소스
- 공통 UI 컴포넌트
- CI/CD 설정
- ESLint, Prettier, TypeScript 등 프로젝트 설정

모노레포를 도입하면:

- shared packages로 디자인 토큰·컴포넌트·리소스를 중앙에서 관리
- 프로젝트 간 설정·의존성 일관성 유지
- CI/CD 및 빌드 파이프라인 통합 관리
- 코드 중복 감소 및 유지보수 효율 향상

## 용어 정리

- **library**: 재사용 가능한 코드의 집합. 특정 기능을 수행하는 함수·클래스·모듈 등을 포함하며, 주로 패키지의 일부로 제공되어 다른 프로젝트에서 호출된다. npm에 배포된 라이브러리는 패키지화를 거친 것이다.
- **package**: 넓게는 특정 소프트웨어, 좁게는 재사용 가능한 코드를 배포·공유하기 위해 번들링한 것. 다른 프로젝트에서 재사용 가능하도록 모듈화되어 있어야 한다.
- **dependency**: 어떤 패키지가 다른 패키지에 종속된 상태. 특정 패키지를 쓰기 위해 선행적으로 설치되어야 하는 패키지.
- **package manager**: 프로젝트에 필요한 dependency를 관리하는 도구. 설치·의존성 관리·버전 관리를 편리하게 해준다 (npm, yarn, pnpm 등).
- **workspace**: 패키지들이 협업하는 공간. 다양한 소스코드와 자원을 관리하는 디렉토리 단위 개념으로, 모노레포의 핵심이다.

## 모노레포 세팅

`pnpm` / `Turborepo`로 진행한다.

### pnpm

- **npm/yarn**: 종속 모듈을 끌어올려 중복을 최소화하지만, 실제로 선언하지 않은 모듈도 접근 가능해지는 유령 의존성 문제가 있다.
- **yarn berry (PnP)**: node_modules 대신 zip으로 압축하고 `.pnp.cjs`로 의존성을 처리한다. zip이 git으로 트래킹 가능해 CI/CD에서 설치 자체가 필요 없어질 수 있지만, 러닝커브가 있다.
- **pnpm**: 중앙 저장소에 의존성을 한 번만 설치하고 `node_modules`에서는 hard-link로 참조한다. 설치가 한 번이라 속도·용량이 줄고, yarn berry보다 구조가 단순해 러닝커브가 적다.

### Turborepo

Next.js·TypeScript 환경을 기본 지원해서 초기 설정 부담이 적고, Vercel이 만든 빌드 시스템이라 생태계가 안정적이다. 주요 장점:

1. 프로젝트 기본 구조를 자동 생성
2. 여러 패키지의 빌드를 **병렬 실행**해 빌드 속도 단축
3. 동일 작업 결과를 캐시해 불필요한 재빌드 방지, 변경된 패키지만 재빌드

**의존 관계**

```
apps/worklog     ──▶ design-system, typescript-config, eslint-config, tailwind-config
apps/commute     ──▶ design-system, typescript-config, eslint-config, tailwind-config
design-system    ──▶ typescript-config, eslint-config, tailwind-config
typescript-config, eslint-config, tailwind-config ──▶ (의존 없음)
```

**Turborepo task graph**

```
          design-system:build
            ┌──────┴──────┐
     worklog:build   commute:build
```

`design-system`이 먼저 빌드되고, 그 결과를 `worklog`와 `commute`가 소비한다. 공유 패키지는 한 번만 빌드하고, 두 앱의 빌드는 나란히 병렬로 실행된다.

**캐싱 예시**

```
pnpm build

# 첫 실행
worklog:build  (실행)

# 코드 변경 없이 재실행
worklog:build  (cache hit)
```

캐시 기준은 source code + dependencies + env + config. 기본적으로 로컬(`.turbo/`)에 저장된다.

## ESLint / Prettier 세팅

- `@eslint/js` + `typescript-eslint` 기반의 **ESLint 9 flat config**를 처음부터 네이티브로 사용한다 (rushstack 같은 legacy `.eslintrc`/CJS 기반 공유 config는 쓰지 않음 — 버전 다운그레이드나 `FlatCompat` 우회가 필요 없다).
- `docs/conventions.md`에서 문서로만 정의하던 규칙 일부를 실제 lint 규칙으로 강제한다: `@typescript-eslint/consistent-type-definitions`(props 타입은 `type`으로), `@typescript-eslint/no-explicit-any`, `no-unused-vars`, `no-duplicate-imports`.
- `eslint-plugin-turbo`로 turbo 파이프라인에서 선언 안 된 env var를 잡는다.
- `eslint-config-next`는 `packages/eslint-config`의 peerDependency로 두고, 각 앱이 자기 Next 버전에 맞는 걸 직접 의존한다 — 앱마다 Next 버전이 달라도 공용 패키지가 깨지지 않는다.
- Prettier는 `singleQuote`/`jsxSingleQuote`/`arrowParens: always`/`endOfLine: lf` + `prettier-plugin-tailwindcss`(클래스 자동 정렬)로 구성했다.

## 프로젝트 구조

```
konkuk-icteam-fe/
├── apps/
│   ├── worklog/                # 업무일지
│   └── commute/                # 출근부 (근로학생 화면 + 관리자 화면 /admin)
├── packages/
│   ├── design-system/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── tailwind-config/
```

### packages/design-system

디자인 시스템은 성격상 여러 앱이 동시에 소비하는 '라이브러리'다. 컴포넌트·아이콘은 변경 시 모든 소비 앱에 동일하게 반영되어야 하는 단일 진실 공급원(Single Source of Truth)이 되는 게 맞다.

```
packages/design-system/
├── src/
│   ├── ui/          # 도메인 지식·API 호출이 없는 순수 프레젠테이션 컴포넌트 (Button, Chip, Modal, Input 등)
│   ├── assets/
│   │   ├── svg/         # 원본 SVG
│   │   └── components/  # svg에서 자동 생성한 아이콘 컴포넌트 (pnpm build:icons)
│   └── lib/
│       ├── cn.ts        # 클래스 병합
│       └── date.ts      # 날짜 유틸 (YYYY-MM-DD 변환 등)
```

`docs/conventions.md`의 컴포넌트 배치 기준을 그대로 따른다 — 도메인 지식이 전혀 없는 순수 프레젠테이션 컴포넌트만 여기로, 도메인 지식은 있지만 앱 내에서 재사용되는 건 앱 로컬로 둔다.
