// 앱 화면 주소. 링크·이동·메뉴는 주소를 직접 쓰지 않고 여기서 가져온다
export const ROUTES = {
  HOME: '/',
  TIMETABLE: '/timetable',
  TIMETABLE_APPLY: '/timetable/apply',
  TIMETABLE_EDIT: '/timetable/edit',
  ADMIN_HOME: '/admin',
  ADMIN_WORKTIME: '/admin/worktime',
  ADMIN_WORKTIME_CHANGE_REQUESTS: '/admin/worktime/change-requests',
  ADMIN_WORK_APPLICATIONS: '/admin/work-applications',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_TASKS: '/admin/tasks',
} as const;
