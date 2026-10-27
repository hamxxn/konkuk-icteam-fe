# 출근부 관리자 API

출근부 관리자 화면(`app/(admin)`, `/dashboard` 등)이 서버와 주고받는 API를 정리한 문서입니다. 프론트는 이 모양대로 화면을 만들어 두었고, 서버가 아직 없어서 같은 모양의 목업 JSON으로 동작합니다.

- 프론트 코드: `apps/commute/src/app/(admin)/_apis/` (리소스마다 파일 하나, 함수마다 위에 메서드·경로 주석)
- 목업: `apps/commute/src/app/(admin)/_apis/mock/` (서버가 보낼 JSON 모양 그대로)
- 서버를 붙이면 `_apis` 함수 안만 실제 요청으로 바꿉니다. 화면 코드는 그대로 둡니다

## 공통 규칙

| 항목          | 규칙                                                                                    |
| ------------- | --------------------------------------------------------------------------------------- |
| 경로          | 모두 `/admin`으로 시작합니다                                                            |
| 날짜          | `YYYY-MM-DD` 문자열 (예: `"2026-10-25"`)                                                |
| 날짜·시각     | `YYYY-MM-DDTHH:mm:ss` 문자열, 한국 시간, 시간대 표기 없음 (예: `"2026-10-22T10:12:00"`) |
| 시각만        | `HH:mm` 문자열 (예: `"09:00"`). 근무 칸은 30분 단위이고 09:00 ~ 18:00입니다             |
| 월            | `year`(예: `2026`)와 `month`(1~12)를 따로 보냅니다                                      |
| id            | 모두 숫자입니다 (`userId`, `scheduleId`, `requestId`, `todoId`, `noticeId`)             |
| 빈 값         | 아직 채우지 않은 정보는 빈 문자열이 아니라 `null`로 보냅니다                            |
| 근로시간 단위 | 근로신청 기준은 **시간**, 근무 기록은 **분**입니다 (아래 각 항목에 적어 둠)             |

> 프론트는 받은 날짜 문자열을 `_apis` 안에서 한 번만 `Date`로 바꾸고, 보낼 때도 `_apis` 안에서 문자열로 바꿉니다. 서버는 문자열 형식만 맞춰 주면 됩니다.

## 한눈에 보기

| 메서드 | 경로                                        | 하는 일                                   | 쓰는 화면                                                                 |
| ------ | ------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/admin/workers`                            | 모든 근로장학생                           | 근로장학생(전체 탭), 근로시간 관리(사람 찾기), 근로신청 관리(학생 고르기) |
| GET    | `/admin/workers/monthly?year=&month=`       | 그 달 근로학생과 근무 기록                | 근로장학생(월별 탭)                                                       |
| PATCH  | `/admin/workers/{userId}`                   | 근로장학생 정보 수정                      | 근로장학생                                                                |
| GET    | `/admin/work-schedules?startDate=&endDate=` | 기간의 근무 시간표                        | 대시보드(하루), 근로시간 관리(월~금)                                      |
| POST   | `/admin/work-schedules`                     | 근무 칸에 근로학생 넣기                   | 근로시간 관리                                                             |
| DELETE | `/admin/work-schedules/{scheduleId}`        | 근무 칸에서 근로학생 빼기                 | 근로시간 관리                                                             |
| GET    | `/admin/work-change-requests?year=&month=`  | 한 달 근무 변경 요청과 상태별 건수        | 대시보드(승인 대기 건수), 근로시간 관리, 수정요청                         |
| PATCH  | `/admin/work-change-requests/{requestId}`   | 근무 변경 요청 승인·반려                  | 수정요청                                                                  |
| GET    | `/admin/work-applications?year=&month=`     | 그 달 근로신청 기준과 신청할 수 있는 학생 | 근로신청 관리                                                             |
| PUT    | `/admin/work-applications`                  | 그 달 근로신청 열기·수정                  | 근로신청 관리                                                             |
| GET    | `/admin/todos`                              | 반복 업무 목록                            | 대시보드                                                                  |
| POST   | `/admin/todos`                              | 반복 업무 추가                            | 대시보드                                                                  |
| PUT    | `/admin/todos/{todoId}`                     | 반복 업무 수정                            | 대시보드                                                                  |
| DELETE | `/admin/todos/{todoId}`                     | 반복 업무 삭제                            | 대시보드                                                                  |
| GET    | `/admin/todo-assignments?date=`             | 그날 업무별 담당 근로학생                 | 대시보드                                                                  |
| PUT    | `/admin/todo-assignments`                   | 그날 업무 지정 통째로 저장                | 대시보드                                                                  |
| GET    | `/admin/notices`                            | 게시 중·게시 예정 공지                    | 대시보드                                                                  |
| POST   | `/admin/notices`                            | 공지 등록                                 | 대시보드                                                                  |
| PUT    | `/admin/notices/{noticeId}`                 | 공지 수정                                 | 대시보드                                                                  |
| DELETE | `/admin/notices/{noticeId}`                 | 공지 삭제                                 | 대시보드                                                                  |

---

## 근로장학생 `workers`

### GET `/admin/workers`

같은 조직의 모든 근로장학생입니다. 이름 검색은 화면에서 하므로 검색 파라미터는 없습니다.

```json
{
  "workers": [
    {
      "userId": 1,
      "name": "홍길동",
      "studentId": "202312345",
      "department": "컴퓨터공학부",
      "grade": 3,
      "phoneNumber": "010-1234-5678",
      "email": "gildong@konkuk.ac.kr",
      "workStartDate": "2025-03-01"
    }
  ]
}
```

| 필드                                                       | 타입                                          | 설명                           |
| ---------------------------------------------------------- | --------------------------------------------- | ------------------------------ |
| `studentId`, `department`, `grade`, `phoneNumber`, `email` | `string \| null` (`grade`는 `number \| null`) | 아직 채우지 않았으면 `null`    |
| `email`                                                    | `string \| null`                              | 로그인 아이디로 쓰는 학교 메일 |
| `workStartDate`                                            | 날짜                                          | 근로를 시작한 달의 1일         |

### GET `/admin/workers/monthly?year=2026&month=10`

그 달 근로학생(근로신청 때 고른 학생)과 그 달 근무 기록입니다. 아직 명단을 정하지 않은 달은 `workers`가 빈 배열입니다.

```json
{
  "year": 2026,
  "month": 10,
  "workers": [
    {
      "userId": 1,
      "name": "홍길동",
      "studentId": "202312345",
      "department": "컴퓨터공학부",
      "grade": 3,
      "phoneNumber": "010-1234-5678",
      "email": "gildong@konkuk.ac.kr",
      "workStartDate": "2025-03-01",
      "monthlyRecord": {
        "monthlyWorkedMinutes": 2160,
        "monthlyLimitMinutes": 3600,
        "lateCount": 1,
        "lateMinutes": 10,
        "totalChangeRequestCount": 2,
        "approvedChangeRequestCount": 1
      }
    }
  ]
}
```

`monthlyRecord`의 시간은 모두 **분** 단위입니다. `monthlyLimitMinutes`는 그 달 최대 근로시간입니다.

### PATCH `/admin/workers/{userId}`

바꾼 항목만 보냅니다. 비운 항목은 `null`로 보냅니다. 이메일과 근로 시작일은 바꿀 수 없습니다.

```json
{ "department": "소프트웨어학부", "phoneNumber": null }
```

응답은 바뀐 근로장학생 한 명(`GET /admin/workers`의 항목 모양)입니다.

---

## 근무 시간표 `work-schedules`

### GET `/admin/work-schedules?startDate=2026-10-19&endDate=2026-10-23`

기간(시작일·마지막 날 포함)의 날마다 30분 단위 근무 칸과 배치된 사람입니다. 대시보드는 하루, 근로시간 관리는 월~금을 조회합니다.

```json
{
  "startDate": "2026-10-19",
  "endDate": "2026-10-23",
  "maxConcurrentWorkers": 4,
  "days": [
    {
      "date": "2026-10-19",
      "slots": [
        {
          "start": "09:00",
          "end": "09:30",
          "users": [{ "scheduleId": 101, "userId": 1, "userName": "홍길동" }]
        },
        { "start": "09:30", "end": "10:00", "users": [] }
      ]
    }
  ]
}
```

- `days`에는 기간 안의 모든 날짜가 순서대로 옵니다 (주말 포함)
- 하루는 09:00부터 18:00까지 18칸이고, 아무도 없는 칸도 `users: []`로 옵니다
- 점심시간(11:30 ~ 13:00) 칸도 오지만 근로학생은 신청할 수 없습니다
- `maxConcurrentWorkers`는 그 달 근로신청 기준의 동시 근무 최대 인원입니다. 넘겨도 배치는 되고 화면에서 칸을 빨갛게 표시합니다
- `scheduleId`는 "이 사람의 이 칸 배치 한 건"입니다. 뺄 때 이 값을 보냅니다

### POST `/admin/work-schedules`

관리자가 근로학생을 근무 칸에 바로 넣습니다. 승인 절차 없이 확정됩니다.

```json
{ "userId": 3, "date": "2026-10-21", "start": "09:00", "end": "09:30" }
```

```json
{
  "scheduleId": 205,
  "userId": 3,
  "userName": "이서준",
  "date": "2026-10-21",
  "start": "09:00",
  "end": "09:30"
}
```

이미 그 칸에 있는 사람이면 `409`를 돌려줍니다.

### DELETE `/admin/work-schedules/{scheduleId}`

근무 칸에서 근로학생을 뺍니다. 응답 본문은 없습니다.

---

## 근무 변경 요청 `work-change-requests`

근로학생이 보낸 "이 근무를 빼고 / 이 근무를 더하고 싶다"는 요청입니다.

| 상태 코드 | 뜻        |
| --------- | --------- |
| `CS01`    | 승인 대기 |
| `CS02`    | 승인      |
| `CS03`    | 반려      |

### GET `/admin/work-change-requests?year=2026&month=10`

요청을 **보낸 달** 기준으로 한 달 동안 들어온 요청과 상태별 건수입니다. 최근 요청이 앞에 옵니다. 대시보드는 `summary.pendingCount`만 씁니다.

```json
{
  "year": 2026,
  "month": 10,
  "summary": { "totalCount": 6, "pendingCount": 3, "approvedCount": 2, "rejectedCount": 1 },
  "requests": [
    {
      "requestId": 20261006,
      "userId": 1,
      "userName": "홍길동",
      "statusCode": "CS01",
      "requestedAt": "2026-10-22T10:12:00",
      "reason": "전공 수업 보강이 잡혀서 오전 근무를 오후로 옮기고 싶습니다.",
      "rejectReason": null,
      "deleteSchedules": [{ "date": "2026-10-27", "start": "09:00", "end": "12:00" }],
      "addSchedules": [{ "date": "2026-10-28", "start": "13:00", "end": "16:00" }]
    }
  ]
}
```

- `deleteSchedules`(뺄 근무)와 `addSchedules`(더할 근무) 중 한쪽만 있을 수도 있습니다
- `rejectReason`은 반려한 요청에만 있고, 나머지는 `null`입니다

### PATCH `/admin/work-change-requests/{requestId}`

승인 대기(`CS01`)인 요청만 처리할 수 있습니다.

```json
{ "statusCode": "CS02" }
```

```json
{ "statusCode": "CS03", "rejectReason": "그날은 이미 인원이 찼습니다." }
```

- 승인하면 서버가 `deleteSchedules`·`addSchedules`를 근무 시간표에 반영합니다
- 반려할 때는 `rejectReason`이 꼭 있어야 합니다
- 응답은 처리된 요청 한 건(`requests`의 항목 모양)입니다

---

## 근로신청 `work-applications`

관리자가 다음 달 근무 신청을 열 때 정하는 기준과, 신청할 수 있는 근로학생 명단입니다. 관리자 화면에서는 **다음 달**만 열고 고칩니다.

### GET `/admin/work-applications?year=2026&month=11`

```json
{
  "year": 2026,
  "month": 11,
  "isOpened": true,
  "settings": {
    "applyStartDate": "2026-10-20T09:00:00",
    "applyEndDate": "2026-10-25T18:00:00",
    "maxConcurrentWorkers": 4,
    "weeklyMinHours": 6,
    "weeklyMaxHours": 15,
    "monthlyMinHours": 30,
    "monthlyMaxHours": 60,
    "unavailableDates": ["2026-11-11"]
  },
  "userIds": [1, 2, 3, 4, 5, 6, 7]
}
```

아직 열지 않은 달은 이렇게 옵니다.

```json
{ "year": 2026, "month": 11, "isOpened": false, "settings": null, "userIds": [] }
```

| 필드                                 | 설명                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `applyStartDate`, `applyEndDate`     | 근로학생이 신청할 수 있는 기간. 날짜와 **시각**까지 정합니다 (날짜·시각 형식) |
| `maxConcurrentWorkers`               | 한 칸(30분)에 함께 근무할 수 있는 최대 인원 (1 이상)                          |
| `weeklyMinHours` ~ `monthlyMaxHours` | 근로시간 기준, **시간** 단위. 최소 ≤ 최대                                     |
| `unavailableDates`                   | 근무할 수 없는 날. 주말·공휴일은 원래 근무가 없어서 넣지 않습니다             |
| `userIds`                            | 그 달 근무를 신청할 수 있는 근로학생 = 그 달 근로학생 명단                    |

### PUT `/admin/work-applications`

그 달 신청을 열거나 기준을 바꿉니다.

```json
{
  "year": 2026,
  "month": 11,
  "settings": {
    "applyStartDate": "2026-10-20T09:00:00",
    "applyEndDate": "2026-10-25T18:00:00",
    "maxConcurrentWorkers": 4,
    "weeklyMinHours": 6,
    "weeklyMaxHours": 15,
    "monthlyMinHours": 30,
    "monthlyMaxHours": 60,
    "unavailableDates": []
  },
  "userIds": [1, 2, 3, 4, 5, 6, 7]
}
```

- 처음 저장하면 그 달 신청이 열립니다 (`isOpened: true`)
- 이미 연 달을 다시 저장하면 **지금까지 들어온 근로신청은 모두 초기화**됩니다. 화면에서 저장 전에 이 내용을 알리고 확인받습니다
- 응답은 `GET`과 같은 모양입니다
- 프론트가 저장 전에 확인하는 규칙: 신청 마감이 시작보다 늦을 것, 동시 근무 최대 인원 1 이상, 주간·월간 최소 ≤ 최대, 근로학생 1명 이상

---

## 업무 `todos`

날마다 반복하는 업무입니다. 오전·오후 시간대로 나뉩니다.

| `period`    | 뜻                             |
| ----------- | ------------------------------ |
| `MORNING`   | 오전 (12시 전에 시작하는 근무) |
| `AFTERNOON` | 오후                           |

### GET `/admin/todos`

```json
{
  "todos": [
    { "todoId": 1, "title": "사무실 오픈 및 PC 전원 켜기", "period": "MORNING" },
    { "todoId": 6, "title": "장비 대여·반납 처리", "period": "AFTERNOON" }
  ]
}
```

### POST `/admin/todos`

```json
{ "title": "택배·우편물 정리", "period": "MORNING" }
```

응답은 만든 업무 한 건(`{ todoId, title, period }`)입니다. 추가한 업무는 다음 날부터 매일 반복됩니다.

### PUT `/admin/todos/{todoId}`

```json
{ "title": "프린터 점검", "period": "AFTERNOON" }
```

응답은 바뀐 업무 한 건입니다. 시간대를 바꿔도 이미 맡긴 근로학생 지정은 그대로 둡니다.

### DELETE `/admin/todos/{todoId}`

응답 본문은 없습니다. 지운 업무는 **모든 날짜의 업무 지정에서도 빠집니다**.

---

## 업무 지정 `todo-assignments`

그날 업무마다 맡은 근로학생입니다. 업무는 그 시간대에 근무하는 사람에게만 맡길 수 있습니다.

### GET `/admin/todo-assignments?date=2026-10-27`

```json
{
  "date": "2026-10-27",
  "assignments": [
    { "todoId": 1, "userIds": [1, 2] },
    { "todoId": 6, "userIds": [5] }
  ]
}
```

한 명도 맡기지 않은 업무는 `assignments`에서 빠집니다.

### PUT `/admin/todo-assignments`

그날 업무 지정을 **통째로** 바꿉니다. 목록에서 빠진 업무는 지정이 풀립니다.

```json
{
  "date": "2026-10-27",
  "assignments": [{ "todoId": 1, "userIds": [1] }]
}
```

응답은 `GET`과 같은 모양입니다.

---

## 공지사항 `notices`

근로학생에게 보이는 공지입니다. 게시 기간(시작일~마감일, 둘 다 포함) 동안만 보입니다.

### GET `/admin/notices`

게시가 끝나지 않은 공지(게시 중 + 게시 예정)를 시작일 순으로 줍니다. 게시가 끝난 공지는 오지 않습니다.

```json
{
  "notices": [
    {
      "noticeId": 1,
      "title": "11월 근로신청 안내",
      "content": "11월 근무 시간 신청을 이번 주 금요일까지 받습니다.",
      "startDate": "2026-10-22",
      "endDate": "2026-10-29",
      "createdAt": "2026-10-22T09:00:00"
    }
  ]
}
```

"게시 중 / 게시 예정" 구분은 화면에서 오늘과 `startDate`를 비교해서 합니다.

### POST `/admin/notices`

```json
{
  "title": "정보운영팀 사무실 소독 안내",
  "content": "소독 작업으로 오후 근무는 3층 회의실에서 진행합니다.",
  "startDate": "2026-10-30",
  "endDate": "2026-11-01"
}
```

응답은 만든 공지 한 건(`noticeId`, `createdAt` 포함)입니다.

- 제목·내용은 앞뒤 공백을 뺀 뒤 1글자 이상
- 시작일 ≤ 마감일
- 오늘 이전 날짜는 게시 기간에 넣을 수 없습니다. 단, 이미 게시 중인 공지를 고칠 때는 원래 시작일을 그대로 둘 수 있습니다

### PUT `/admin/notices/{noticeId}`

`POST`와 같은 본문을 보냅니다. 응답은 바뀐 공지 한 건입니다.

### DELETE `/admin/notices/{noticeId}`

응답 본문은 없습니다. 지운 공지는 근로학생 화면에서도 바로 사라집니다.

---

## 백엔드와 정해야 할 것

프론트가 임시로 가정해 둔 부분입니다. 정해지면 이 문서와 `_apis`를 함께 고칩니다.

- **인증**: 관리자 확인 방법(쿠키 / `Authorization` 헤더)과 권한이 없을 때의 응답
- **오류 응답 모양**: 지금은 `409`(이미 배치된 칸) 외에는 정하지 않았습니다. `{ "message": "..." }`처럼 화면에 보여 줄 문구를 함께 주면 토스트로 그대로 띄울 수 있습니다
- **목록 페이지 나누기**: 근로장학생 목록은 전부 받아서 화면에서 나눕니다(한 페이지 10명). 인원이 많아지면 서버 페이지 나누기가 필요합니다
- **업무 수정 메서드**: 업무 수정은 `PUT`(전체 바꾸기)으로 가정했습니다. 근로장학생·변경 요청처럼 `PATCH`로 맞출지 정해야 합니다
- **업무 지정 검증**: 그 시간대에 근무하지 않는 사람을 업무에 맡기는 요청을 서버에서도 막을지
- **근로신청 재저장**: 이미 열린 달을 다시 저장할 때 들어온 신청을 초기화하는 처리를 서버에서 할지
- **근로학생 화면 API**: 이 문서는 관리자 화면만 다룹니다. 근로학생 화면(홈·시간표)이 쓰는 API는 [`student-api.md`](student-api.md)에 정리했습니다
