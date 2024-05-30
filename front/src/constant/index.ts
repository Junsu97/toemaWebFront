// export const INDEX_PATH = () => '/';
export const MAIN_PATH = () =>'/main';
// export const AUTH_PATH = () =>'/auth';
export const AUTH_PATH = () =>'/';
export const FIND_ID = () => '/user/find-id';
export const FIND_PASSWROD = () => '/user/find-password';
export const MATCHED_STUDENT_LIST = (teacherId:string) => `/teacher/matched-student/${teacherId}`;
export const STUDENT_INFO = (studentId: string) => `/teacher/matched-student/${studentId}`;
export const TEACHER_LIST = () => '/teacher/list';
export const TEACHER_APPLY_LIST = () => '/teacher/my-apply';
export const TEACHER_APPLY = (teacherUserId:String) => `/teacher/apply/${teacherUserId}`;
export const TEACHER_APPLY_UPDATE = (teacherUserId:string, studentUserId:string) => `/teacher/apply-update/${teacherUserId}/${studentUserId}`;
export const TEACHER_APPLY_DETAIL = (teacherUserId:string, studentUserId:string) => `/teacher/apply-detail/${teacherUserId}/${studentUserId}`;
export const TEACHER_INFO = (teacherUserId:String) => `/teacher/info/${teacherUserId}`;
export const FACE_ID = () => `/face`;
export const HOMEWORK = (teacherUserId:string, studentUserId:string) => `/home-work/${teacherUserId}/${studentUserId}`;
export const HOMEWORK_LIST = (userId:string) => `/home-work/${userId}`;
export const CHANGE_PASSWORD = (userId:string) => `/user/change-password/${userId}`;
export const SEARCH_PATH = (searchWord:string) => `/search/${searchWord}`;
export const USER_PATH = (userId : string) => `/user/${userId}`;
export const USER_UPDATE_PATH = (userId : string) => `/user/update/${userId}`;
export const BOARD_PATH = () => '/board'
export const BOARD_DETAIL_PATH = (boardNumber : string | number)  => `/board/detail/${boardNumber}`;
export const BOARD_WRITE_PATH = () => '/board/write'
export const BOARD_LIST = () => '/board/list'
export const BOARD_UPDATE_PATH = (boardNumber: string | number) => `/board/update/${boardNumber}`;
export const NOT_FOUND_PATH = () => '/404';
