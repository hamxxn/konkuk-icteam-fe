# 팀 코드 컨벤션

이 문서는 이 프로젝트의 코드 컨벤션을 담은 문서입니다. 브랜치명·커밋 메시지·PR 제목 같은 git 컨벤션은 [`docs/git-conventions.md`](git-conventions.md)를 참고하세요.

## 네이밍

- 상수: 영문 대문자 스네이크(예: `API_KEY`)
- 컴포넌트: PascalCase (함수형 컴포넌트, 예: `MainHeader`)
- 변수는 `var` 사용 금지, `const` 우선 / 불가피할 때만 `let`
- 변수/함수명은 의미를 명확히 (줄임말 지양, `arr1` 같은 이름 금지)
- 이름이 길어지더라도 어떤 값인지 정확하게 작성

## 코드 스타일

- 기본적으로 화살표 함수 사용
- early return(암시적 반환)으로 분기 단순화 권장
- `for` 지양, `forEach`/`map` 사용
- 조건 분기는 기본적으로 삼항 연산자 사용 (단, 가독성이 떨어지거나 중첩이 심하면 early return을 우선)
- `map` 렌더링 시 `key`는 index 지양, 유일한 값 사용
- 문자열 조합은 무조건 템플릿 리터럴 사용 (`+` 연결 금지)
  - X: `var1 + " " + var2`
  - O: `` `${var1} ${var2}` ``
- axios 사용 시 `.then/.catch`, `async/await` 사용 시 `try/catch`로 에러 처리
- `switch-case`: `break` 필수, case 문 사이는 가독성을 위해 한 줄 띄우기
- 주석은 대상 바로 위에 작성. 대상 아래에 쓰는 것은 금지
- `button` 태그에는 `type` 반드시 명시 (예: `<button type="button">`)
- common component(버튼/헤더 등)는 `children` 적극 활용

## 함수 네이밍

- 기본적으로 화살표 함수 사용
- 함수명은 하는 일을 명확히 드러내야 함
  - `get`: 값을 얻어오는 함수
  - `create`: 기존 변수를 조합해 새 값/변수를 만드는 함수
  - `check`: 내부 로직을 검증하는 함수
  - 그 외에도 기능이 분명히 드러나는 이름 사용
- 이벤트 핸들러는 `handle`로 시작 (예: `handleOnClick`, `handleSubmit`)
- 유틸 함수는 반환값 기준으로 네이밍
  - boolean 반환 시 `has` + 명사 (예: `hasEmail` — email 존재 여부 반환)
- 중복되는 함수는 `utils` 폴더로 모아 재사용. 프로젝트 전역에서 쓰인다면 `shared/utils`
- `utils` vs `lib` 구분: 외부 의존성 없는 순수 함수(포맷팅, 검증 등)는 `utils`에, 특정 라이브러리를 감싸거나 설정을 갖는 모듈(클라이언트 인스턴스, 서드파티 래퍼 등)은 `lib`에 둔다

## 컴포넌트 배치 기준

컴포넌트를 어디에 둘지는 재사용 범위와 도메인 지식 보유 여부로 정한다.

- `packages/design-system`: 도메인 지식(업무일지 항목/이슈 처리 내역 등)과 API 호출이 전혀 없는 순수 프레젠테이션 프리미티브(Button, Chip, Modal, Input 등). `apps/*`의 모든 앱에서 재사용된다.
- 앱 공통 `src/shared/ui`: 한 앱 안의 여러 라우트에서 쓰는 컴포넌트.
- 라우트 로컬 `_components/`(각 `app/**/_components`): 해당 라우트 하나에서만 쓰는 컴포넌트. 화면이 여러 섹션으로 나뉘면 섹션별 폴더(kebab-case)를 만들어 그 안에 둔다
  ```
  (admin)/dashboard/_components/
  ├── request-notice/RequestNoticeBar.tsx
  ├── date-board/DateBoard.tsx, AssignTaskList.tsx, ...
  └── notice/NoticePanel.tsx, NoticeForm.tsx, ...
  ```
- 디자인 시스템에 이미 있는 컴포넌트(Tabs, TagChip, Message, Toggle, Modal 등)는 앱에서 비슷한 컴포넌트를 새로 만들지 않고 그대로 쓴다. 모양만 조금 다르면 props·className으로 맞추고, 정말 없는 기능이면 디자인 시스템에 추가한다

## 유틸 함수 문서화

`utils`(또는 `lib`의 순수 함수)에 새 함수를 작성할 때는 JSDoc 주석을 무조건 작성한다. 함수 설명, 각 파라미터(중첩 옵션 객체는 하위 필드까지), 반환값, 예시를 포함한다:

```ts
/**
 * 숫자를 2자리로 패딩합니다. (예: 5 -> "05")
 * @param num 숫자
 * @param option 패딩 옵션
 * @param option.length 패딩 길이 (기본값: 2)
 * @param option.padChar 패딩 문자 (기본값: '0')
 * @returns 패딩된 문자열
 * @example const padded = formatNumber(5); // '05'
 */
```

## 폴더 & 파일

- 파일 내 단일 요소만 export한다면 `default export`
  ```tsx
  export default function Component1() {}
  ```
- 2개 이상 export한다면 named export
  ```tsx
  export const Component2 = () => {};
  export const Component3 = () => {};
  ```
- 폴더명: kebab-case
- 파일명: 상수/타입 등은 camelCase, 컴포넌트는 PascalCase

## 타입

- 컴포넌트가 받는 props 타입은 컴포넌트 선언부 바로 위에 `type`으로 선언
- 네이밍 규칙: `컴포넌트명 + Props` (예: `PageHeaderProps`)

  ```tsx
  type PageHeaderProps = {
    title: string;
    description: string;
  };

  export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
    );
  }
  ```

## API 요청·응답의 날짜

- 서버와 주고받는 요청·응답 타입에서 날짜는 무조건 `Date` 타입으로 선언한다. `date: string`, `createdAt: string`처럼 문자열로 두지 않는다
  ```ts
  // X
  type TodoResponse = { date: string; createdAt: string };
  // O
  type TodoResponse = { date: Date; createdAt: Date };
  ```
- JSON에는 `Date`를 그대로 실을 수 없으니, 문자열 ↔ `Date` 변환은 API 호출 계층(`app/(admin)/_apis` 등)에서 한 번만 한다. 응답으로 받은 날짜는 이미 `Date`라서 화면에서 다시 바꾸지 않는다. 단, `DatePicker`처럼 `YYYY-MM-DD` 글자를 주고받는 입력 컴포넌트와는 화면에서 바꿔 넘긴다
- 날짜 없이 시각만 있는 값(예: `'09:00'`)은 날짜가 아니므로 문자열로 둔다

## 화면의 날짜 표기

- 화면에 보이는 날짜는 `MM.DD`, 기간은 `MM.DD - MM.DD`로 통일한다 (예: `10.05`, `10.20 - 10.25`). 시각이 붙으면 `MM.DD HH:mm`
- 직접 `getMonth() + 1`로 조합하지 않고 `@/shared/utils/formatDate`의 함수를 쓴다
  ```ts
  formatMonthDay('2026-10-05'); // '10.05'
  formatDateRange(startDate, endDate); // '10.20 - 10.25'
  formatMonthDayWithWeekday('2026-10-24'); // '10.24 (토)'
  formatMonthDayTime(requestedAt); // '10.22 10:12'
  ```
- 달 제목처럼 날짜가 아닌 글자(예: `11월 근로신청`)는 이 규칙과 상관없다
