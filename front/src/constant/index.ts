// export const INDEX_PATH = () => '/';
export const MAIN_PATH = () =>'/main';
// export const AUTH_PATH = () =>'/auth';
export const AUTH_PATH = () =>'/';
export const SEARCH_PATH = (searchWord:string) => `/search/${searchWord}`;
export const USER_PATH = (userId : string) => `/user/${userId}`;
export const BOARD_PATH = () => '/board'
export const BOARD_DETAIL_PATH = (boardNumber : string | number)  => `/board/detail/${boardNumber}`;
export const BOARD_WRITE_PATH = () => '/board/write'
export const BOARD_UPDATE_PATH = (boardNumber: string | number) => `/board/update/${boardNumber}`;
export const NOT_FOUND_PATH = () => '/404';
