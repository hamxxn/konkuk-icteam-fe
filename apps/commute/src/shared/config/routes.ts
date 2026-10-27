// 앱 화면 주소. 링크·이동·메뉴는 주소를 직접 쓰지 않고 여기서 가져온다
export const ROUTES = {
  HOME: '/',
  TIMETABLE: '/timetable',
  TIMETABLE_APPLY: '/timetable/apply',
  TIMETABLE_EDIT: '/timetable/edit',
  // 관리자 화면 ((admin) 그룹). 주소에 /admin을 붙이지 않는다
  ADMIN_HOME: '/dashboard',
  ADMIN_WORKTIME: '/worktime',
  ADMIN_WORKTIME_CHANGE_REQUESTS: '/worktime/change-requests',
  ADMIN_WORK_APPLICATIONS: '/work-applications',
  ADMIN_STUDENTS: '/students',
  ADMIN_TASKS: '/tasks',
} as const;
