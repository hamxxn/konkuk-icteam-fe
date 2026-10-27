# 출근부 근로학생 API

출근부 근로학생 화면(`app/(student)`, 홈 `/`·시간표 `/timetable`)이 서버와 주고받는 API를 정리한 문서입니다. 관리자 화면 API는 [`admin-api.md`](admin-api.md)에 있습니다. 서버가 아직 없어서, 서버가 보낼 모양 그대로의 목업 JSON으로 동작합니다.

- 프론트 코드: `apps/commute/src/shared/apis/` (리소스마다 파일 하나, 함수마다 위에 메서드·경로 주석)
- 목업: `apps/commute/src/shared/apis/mock/`
- 서버를 붙이면 `shared/apis` 함수 안만 실제 요청으로 바꿉니다. 화면 코드는 그대로 둡니다

## 공통 규칙

[관리자 API의 공통 규칙](admin-api.md#공통-규칙)과 같습니다. 다른 점만 적습니다.

| 항목      | 규칙                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 경로      | 로그인한 근로학생 본인 기준이라 `/me`로 시작합니다. 요청에 `userId`를 보내지 않고, 서버가 로그인 정보로 판단합니다                |
| 근무 칸   | **30분 단위**, 09:00 ~ 18:00 하루 18칸입니다. 점심시간(11:30 ~ 13:00) 칸도 오지만 근무할 수는 없습니다                            |
| 근무 구간 | 이어진 30분 칸을 한 구간으로 묶은 `{ date, start, end }`입니다 (예: `{ "date": "2026-10-27", "start": "09:00", "end": "11:30" }`) |
| 같은 모양 | 근무 시간표, 근무 변경 요청, 근로신청 기준, 공지는 관리자 API와 필드 모양이 같습니다                                              |

## 한눈에 보기

| 메서드 | 경로                                          | 하는 일                                     | 쓰는 화면                  |
| ------ | --------------------------------------------- | ------------------------------------------- | -------------------------- |
| GET    | `/me`                                         | 로그인한 근로학생 본인 정보                 | 홈 헤더, 시간표            |
| GET    | `/me/work-shifts?date=`                       | 그날 내 근무와 출근 상태                    | 홈(출근 카드)              |
| GET    | `/me/work-dates?year=&month=`                 | 그 달 내 근무가 있는 날                     | 홈(근무 달력)              |
| POST   | `/me/attendances`                             | 출근 체크                                   | 홈(출근 카드)              |
| GET    | `/me/work-schedules?startDate=&endDate=`      | 기간의 팀 근무 시간표                       | 시간표('자세히')           |
| GET    | `/me/work-schedules/mine?startDate=&endDate=` | 기간 안에서 내가 배치된 칸                  | 아직 쓰는 화면 없음        |
| GET    | `/me/work-records?date=`                      | 그 주·그 달 근무한 시간                     | 홈(근무 요약)              |
| GET    | `/me/work-applications/settings?year=&month=` | 그 달 근로신청 기준과 내가 신청할 수 있는지 | 홈, 시간표(조회·신청·수정) |
| GET    | `/me/work-applications?year=&month=`          | 그 달 내가 신청한 근무                      | 시간표                     |
| PUT    | `/me/work-applications`                       | 그 달 근무 신청 저장                        | 시간표 신청                |
| GET    | `/me/work-change-requests?year=&month=`       | 그 달 내가 보낸 근무 변경 요청              | 시간표 수정                |
| POST   | `/me/work-change-requests`                    | 근무 변경 요청 보내기                       | 시간표 수정                |
| GET    | `/me/todos?date=`                             | 그날 업무와 담당자, 완료 여부               | 홈(오늘 업무)              |
| PATCH  | `/me/todos/{todoId}`                          | 그날 업무 완료·완료 취소                    | 홈(오늘 업무)              |
| GET    | `/me/notices`                                 | 오늘 게시 중인 공지                         | 홈(공지)                   |

---

## 내 정보 `me`

### GET `/me`

```json
{ "userId": 1, "name": "홍길동" }
```

---

## 근무와 출근 `work-shifts`, `attendances`

근무 상태 코드입니다.

| 코드   | 뜻                                |
| ------ | --------------------------------- |
| `WK01` | 예정 (아직 출근 전, 근무 시간 전) |
| `WK02` | 근무 중 (출근함)                  |
| `WK03` | 근무 완료 (출근하고 근무가 끝남)  |
| `WK04` | 결근 (출근하지 않고 근무가 끝남)  |

### GET `/me/work-shifts?date=2026-10-27`

그날 내 근무입니다. 내가 배치된 30분 칸을 오전·오후로 나눠 이어진 구간으로 묶어서, 오전·오후 최대 1건씩 시작 시각 순으로 줍니다. 근무가 없으면 `shifts`가 빈 배열입니다.

```json
{
  "date": "2026-10-27",
  "shifts": [
    {
      "scheduleIds": [101, 102, 103, 104],
      "period": "MORNING",
      "start": "09:00",
      "end": "11:00",
      "workStatusCode": "WK02",
      "checkedInAt": "2026-10-27T08:55:00"
    },
    {
      "scheduleIds": [131, 132],
      "period": "AFTERNOON",
      "start": "14:00",
      "end": "15:00",
      "workStatusCode": "WK01",
      "checkedInAt": null
    }
  ]
}
```

| 필드          | 설명                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| `scheduleIds` | 이 근무에 묶인 칸 배치 id들 (관리자 시간표의 `scheduleId`). 출근할 때 그대로 보냅니다 |
| `period`      | `MORNING`(12시 전 시작) / `AFTERNOON`. 홈에서 그 시간대 업무를 보여 줄 때 씁니다      |
| `checkedInAt` | 출근 체크한 시각 (날짜·시각). 아직 안 했으면 `null`                                   |

### GET `/me/work-dates?year=2026&month=10`

그 달 내 근무가 있는 날입니다. 홈 근무 달력에 점을 찍을 때 씁니다.

```json
{ "year": 2026, "month": 10, "dates": ["2026-10-20", "2026-10-22", "2026-10-27"] }
```

### POST `/me/attendances`

출근 체크입니다. 위치 확인 없이 바로 출근 처리합니다.

```json
{ "scheduleIds": [131, 132] }
```

응답은 출근 처리된 근무 한 건(`shifts`의 항목 모양)입니다. `workStatusCode`는 `WK02`, `checkedInAt`은 출근 시각입니다.

- 화면은 **근무 시작 10분 전부터 근무가 끝나기 전까지**, 아직 출근하지 않은 근무에만 출근 버튼을 켭니다

---

## 근무 시간표 `work-schedules`

### GET `/me/work-schedules?startDate=2026-10-26&endDate=2026-10-30`

기간(시작일·마지막 날 포함)의 팀 근무 시간표입니다. 칸마다 함께 근무하는 사람이 옵니다. 시간표에서 '자세히'를 켜면 이 값으로 다른 사람 이름을 보여 줍니다. **관리자 `GET /admin/work-schedules`와 응답 모양이 같습니다.**

```json
{
  "startDate": "2026-10-26",
  "endDate": "2026-10-30",
  "maxConcurrentWorkers": 4,
  "days": [
    {
      "date": "2026-10-26",
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
- 하루는 09:00 ~ 18:00, 30분씩 18칸이고, 점심시간(11:30 ~ 13:00) 칸과 아무도 없는 칸도 옵니다

### GET `/me/work-schedules/mine?startDate=2026-10-26&endDate=2026-10-30`

기간 안에서 내가 배치된 칸만 옵니다. 프론트에 함수는 만들어 두었지만, **지금 이 API를 쓰는 화면은 없습니다.** 필요 없으면 백엔드에서 만들지 않아도 됩니다.

```json
{
  "startDate": "2026-10-26",
  "endDate": "2026-10-30",
  "days": [
    { "date": "2026-10-26", "slots": [{ "scheduleId": 101, "start": "09:00", "end": "09:30" }] },
    { "date": "2026-10-27", "slots": [] }
  ]
}
```

---

## 근무 기록 `work-records`

### GET `/me/work-records?date=2026-10-27`

`date`가 속한 주(월~일)와 달에 근무한 시간입니다. 시간은 **분** 단위입니다. 홈 근무 요약에서 근로신청 기준(주·월 최소·최대 시간)과 비교해서 보여 줍니다.

```json
{ "date": "2026-10-27", "weeklyWorkedMinutes": 360, "monthlyWorkedMinutes": 1530 }
```

---

## 근로신청 `work-applications`

### GET `/me/work-applications/settings?year=2026&month=11`

관리자가 정한 그 달 근로신청 기준과, 내가 신청할 수 있는지입니다. `settings`는 **관리자 `GET /admin/work-applications`의 `settings`와 같은 모양**입니다.

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
  "canApply": true
}
```

| 필드                   | 설명                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `isOpened`             | 관리자가 그 달 신청을 열었는지. 열지 않은 달은 `settings: null`, `canApply: false` |
| `canApply`             | 내가 그 달 근로학생 명단(관리자가 고른 학생)에 들어 있어 신청할 수 있는지          |
| `maxConcurrentWorkers` | 한 칸(30분)에 함께 근무할 수 있는 최대 인원                                        |

### GET `/me/work-applications?year=2026&month=11`

그 달 내가 신청한 근무입니다. 이어진 30분 칸은 한 구간으로 옵니다.

```json
{
  "year": 2026,
  "month": 11,
  "schedules": [
    { "date": "2026-11-02", "start": "09:00", "end": "11:30" },
    { "date": "2026-11-02", "start": "14:00", "end": "16:00" }
  ]
}
```

### PUT `/me/work-applications`

그 달 신청을 **통째로** 바꿉니다. 빠진 근무는 신청이 취소됩니다. 신청 기간(`applyStartDate` ~ `applyEndDate`) 안에서만 할 수 있습니다.

```json
{
  "year": 2026,
  "month": 11,
  "schedules": [{ "date": "2026-11-02", "start": "09:00", "end": "11:30" }]
}
```

응답은 `GET`과 같은 모양입니다.

---

## 근무 변경 요청 `work-change-requests`

근무를 확정한 뒤 바꾸고 싶을 때 보내는 요청입니다. 관리자가 승인해야 시간표에 반영됩니다. **관리자 `GET /admin/work-change-requests`의 요청 한 건과 같은 모양**이고, 상태 코드도 같습니다(`CS01` 승인 대기 · `CS02` 승인 · `CS03` 반려).

### GET `/me/work-change-requests?year=2026&month=10`

요청을 **보낸 달** 기준으로, 그 달 내가 보낸 요청입니다. 최근 요청이 앞입니다. 화면은 이 목록으로 한 달 요청 횟수도 셉니다.

```json
{
  "year": 2026,
  "month": 10,
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

### POST `/me/work-change-requests`

```json
{
  "reason": "전공 수업 보강이 잡혀서 오전 근무를 오후로 옮기고 싶습니다.",
  "deleteSchedules": [{ "date": "2026-10-27", "start": "09:00", "end": "11:30" }],
  "addSchedules": [{ "date": "2026-10-28", "start": "13:00", "end": "15:30" }]
}
```

- 사유는 꼭 있어야 합니다
- `deleteSchedules`(뺄 근무)와 `addSchedules`(더할 근무) 중 한쪽만 있을 수도 있습니다
- 응답은 만든 요청 한 건이고, `statusCode`는 `CS01`(승인 대기)입니다

---

## 오늘 업무 `todos`

관리자가 만든 반복 업무에, 그날 담당자와 완료 여부를 붙인 것입니다.

### GET `/me/todos?date=2026-10-27`

```json
{
  "date": "2026-10-27",
  "todos": [
    {
      "todoId": 1,
      "title": "사무실 오픈 및 PC 전원 켜기",
      "period": "MORNING",
      "assignees": [{ "userId": 1, "userName": "홍길동" }],
      "isCompleted": true,
      "completedBy": { "userId": 1, "userName": "홍길동" },
      "completedAt": "2026-10-27T09:05:00"
    },
    {
      "todoId": 6,
      "title": "장비 대여·반납 처리",
      "period": "AFTERNOON",
      "assignees": [],
      "isCompleted": false,
      "completedBy": null,
      "completedAt": null
    }
  ]
}
```

| 필드                         | 설명                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `assignees`                  | 관리자가 그날 이 업무를 맡긴 근로학생 (관리자 `todo-assignments`). 아무도 맡기지 않았으면 빈 배열이고, 그 시간대 근무자 누구나 합니다 |
| `completedBy`, `completedAt` | 완료한 사람과 시각. 완료하지 않았으면 `null`                                                                                          |

### PATCH `/me/todos/{todoId}`

그날 업무를 완료하거나 완료를 취소합니다. 완료한 사람은 로그인한 근로학생으로 기록됩니다.

```json
{ "date": "2026-10-27", "isCompleted": true }
```

응답은 바뀐 업무 한 건(`todos`의 항목 모양)입니다.

---

## 공지사항 `notices`

### GET `/me/notices`

**오늘 게시 중인** 공지만 줍니다. 게시 예정·게시가 끝난 공지는 오지 않습니다. 최근에 게시를 시작한 공지가 앞입니다. 공지 한 건의 모양은 관리자 `GET /admin/notices`와 같습니다.

```json
{
  "notices": [
    {
      "noticeId": 1,
      "title": "11월 근로신청 안내",
      "content": "11월 근무 시간 신청을 이번 주 금요일까지 받습니다.",
      "startDate": "2026-10-24",
      "endDate": "2026-10-31",
      "createdAt": "2026-10-24T09:00:00"
    }
  ]
}
```

---

## 화면이 지키는 규칙

근로학생 화면이 요청을 보내기 전에 확인하는 규칙입니다. 서버에서도 같은 규칙으로 막을지는 아래 "정해야 할 것"에 적었습니다.

| 규칙                   | 값                                                                                                           | 쓰는 곳                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| 출근 가능 시간         | 근무 시작 10분 전 ~ 근무 종료 전, 아직 출근하지 않은 근무만                                                  | 홈 출근 버튼 (`(home)/_lib/checkClockInAvailable.ts`) |
| 점심시간               | 11:30 ~ 13:00 칸은 언제나 고를 수 없음                                                                       | 시간표 신청·수정 (`shared/config/slot.ts`)            |
| 근무 불가 날짜         | `settings.unavailableDates`와 주말·공휴일은 고를 수 없음                                                     | 시간표 신청·수정                                      |
| 근무 한 번의 최소 시간 | 이어진 구간 1시간 이상                                                                                       | 시간표 신청·수정 (`shared/config/workHours.ts`)       |
| 주 근로시간            | 그 주 신청이 `settings.weeklyMaxHours`를 채우면 빈 칸을 더 고를 수 없음 (고른 칸은 되돌릴 수 있음)           | 시간표 신청                                           |
| 주·월 근로시간 표시    | 근무한 시간을 `settings`의 주간·월간 최소 ~ 최대 시간과 비교해 보여 줌 (막지는 않음)                         | 홈 근무 요약, 시간표 신청                             |
| 동시 근무 인원         | **막지 않음.** '자세히'에서 칸마다 `n/maxConcurrentWorkers`명을 보여 주고, 신청 화면에 최대 인원을 안내만 함 | 시간표                                                |
| 근무 변경 요청         | 한 달 3번까지, 근무 시작 2시간 전까지                                                                        | 시간표 수정 (`shared/config/workHours.ts`)            |
| 지각 안내              | 누적 지각 30분을 넘으면 장학금 불이익 안내                                                                   | 홈                                                    |

---

## 백엔드와 정해야 할 것

- **인증**: `/me` API가 로그인한 근로학생을 어떻게 알아내는지(쿠키 / `Authorization` 헤더)와 로그인하지 않았을 때의 응답
- **경로 이름**: 지금은 `/me/...`로 가정했습니다. `/students/me/...` 등 백엔드 규칙이 있으면 맞춥니다
- **규칙 검증**: 위 "화면이 지키는 규칙"을 서버에서도 막을지. 특히 출근 가능 시간, 신청 기간, 동시 근무 인원, 변경 요청 횟수·마감은 서버에서도 막는 게 안전합니다. 막을 때 돌려줄 오류 모양(`{ "message": "..." }` 등)
- **근무 상태 계산**: `workStatusCode`(예정·근무 중·완료·결근)를 서버가 계산해서 줄지. 지금 목업은 현재 시각과 출근 여부로 계산합니다
- **지각 기록**: 출근 시각으로 지각 시간을 서버가 기록해 줄지 (관리자 근무 기록의 `lateCount`·`lateMinutes`와 연결됨)
- **`/me/work-schedules/mine`**: 쓰는 화면이 없습니다. 필요 없으면 빼도 됩니다
- **근로신청 저장 시 동시 인원 경합**: 여러 학생이 같은 칸을 동시에 신청할 때 `maxConcurrentWorkers`를 넘지 않게 처리하는 방법
