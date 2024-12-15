export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout'
  },
  EMPLOYEES: '/api/employees',
  TIME_RECORDS: '/api/time-records',
  WORK_CENTERS: '/api/work-centers'
} as const;