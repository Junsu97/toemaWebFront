import React, { ChangeEvent, useRef, useState, KeyboardEvent, useEffect } from 'react'
import './style.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, INDEX_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { Cookies, useCookies } from 'react-cookie';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_LIST, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';

import { useBoardStore, useLoginUserStore } from 'stores';
import BoardDetail from 'views/Board/Detail';
import { User } from 'types/interface';
import { GetSignInUserResponseDTO } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { fileUploadRequest, getSignInUserRequest, patchBoardRequest, postBoardRequest } from 'apis';
import { PatchBoardRequestDTO, PostBoardRequestDTO } from 'apis/reqeust/board';
import { PatchBoardResponseDTO, PostboardResponseDTO } from 'apis/response/board';

export default function Header() {

  // state : 유저 로그인 상태
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  // state : cookie 상태
  const [cookies, setCookie] = useCookies();
  // state : 로그인 상태
  const [isLogin, setLogin] = useState<boolean>(false);
  const { pathname } = useLocation();

  // state : 인증 페이지 상태
  const [isAuthPage, setAuthPage] = useState<boolean>(false);
  // state : 메인 페이지 상태
  const [isMainPage, setMainPage] = useState<boolean>(false);
  // state : 검색 페이지 상태
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  // state : 게시물 상세 페이지 상태
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  // state : 게시물 작성 페이지 상태
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  // state : 게시물 수정 페이지 상태
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  // state : 게시물 리스트 페이지 상태
  const [isBoardListPage, setBoardListPage] = useState<boolean>(false);
  // state : 유저 페이지 상태
  const [isUserPage, setUserPage] = useState<boolean>(false);


  let isTeacher = false;

  // function : 네비게이트 함수
  const navigate = useNavigate();

  // event handler : 로고 클릭 이벤트 처리 함수
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };


  /*************************************************************************************************************************** */
  // component : 검색버튼 컴포넌트
  const SearchButton = () => {


    // state : 검색 버튼 요소 참조 상태
    const searchButtonRef = useRef<HTMLDivElement | null>(null);

    // state: 검색 버튼 상태
    const [status, setStatus] = useState<boolean>(false);
    // state: 검색어 상태
    const [word, sethWord] = useState<string>('');
    // state : 검색어 path vaiable 상태
    const { searchWord } = useParams();

    // event handler  : 검색어 변경 이벤트 처리 함수
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      sethWord(value);
    };
    // event handler  : 검색어 키 이벤트 처리 함수
    const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };
    // event handler  : 검색 아이콘 클릭 이벤트 처리 함수
    const onSearchButtonClickHandler = () => {
      if (!status) {
        setStatus(!status);
        return;
      }
      navigate(SEARCH_PATH(word));
    };
    //  effect : 검색어 path variable 변경 될 때마다 실행 될 함수
    useEffect(() => {
      if (searchWord) {
        sethWord(searchWord);
        setStatus(true);
      }
    }, [searchWord]);

    if (!status)
      // render : 검색 버튼 컴포넌트 렌더링 (클릭 false 상태)
      return (
        <div className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>);
    // render : 검색 버튼 컴포넌트 렌더링 (클릭 true 상태)
    return (
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler} />
        <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
  }
  /********************************************************************************************************************************************* */
  // component : 로그인 또는 마이페이지 컴포넌트  
  const LoginMyPageButton = () => {
    // state : userLogin path variable 상태
    const { userId } = useParams();

    // event handler : 마이페이지 버튼 클릭 이벤트 처리 함수
    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { userId } = loginUser;
      navigate(USER_PATH(userId));
    }
    // event handler : 로그인 버튼 클릭 이벤트 처리 함수
    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
      navigate(MAIN_PATH());
    }
    // event handler : 로그인 버튼 클릭 이벤트 처리 함수
    const onSigninButtonClickHandler = () => {
      navigate(AUTH_PATH());
    }

    // render : 로그아웃 버튼 컴포넌트 렌더링
    if (isLogin && userId === loginUser?.userId)
      return <div className='white-button' onClick={onSignOutButtonClickHandler}> {'로그아웃'} </div>;
    if (isLogin) {
      // render : 마이페이지 버튼 버튼 컴포넌트 렌더링
      return <div className='white-button' onClick={onMyPageButtonClickHandler}> {'마이페이지'} </div>;
    }


    // render : 로그인 버튼 컴포넌트 렌더링
    return <div className='black-button' onClick={onSigninButtonClickHandler}> {'로그인'} </div>;
  }
  /********************************************************************************************************************************************** */
  // component : 업로드 버튼 컴포넌트
  const UploadButton = () => {
    // state : 게시물 번호 path variable 상태
    const { boardNumber } = useParams();
    // state : 게시물 상태
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();
    // function : post board response 처리 함수
    const postBoardResponse = (responseBody: PostboardResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 에러입니다.');
      if (code === 'AF' || code === 'NU') navigate(AUTH_PATH());
      if (code === 'VF') alert('제목과 내용은 비어있을 수 없습니다.');
      if (code !== 'SU') return;

      resetBoard();
      if (!loginUser) return;
      const { userId } = loginUser;
      navigate(USER_PATH(userId));
    }

    // function : patch board response 처리 함수
    const patchBoardResponse = (responseBody: PatchBoardResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 에러입니다.');
      if (code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(AUTH_PATH());
      if (code === 'VF') alert('제목과 내용은 비어있을 수 없습니다.');
      if (code !== 'SU') return;

      if(!boardNumber) return;
      navigate(BOARD_DETAIL_PATH(boardNumber));
    }


    // event handler : 업로드 버튼 클릭 이벤트 처리 함수
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if (!accessToken) {
        alert('쿠키없음');
        return;
      }

      const boardImageList: string[] = [];

      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append('file', file);
        console.log('Image data :' + data);
        const url = await fileUploadRequest(data);
        if (url) boardImageList.push(url);
      }

      if (pathname === BOARD_WRITE_PATH()) {
        const requestBody: PostBoardRequestDTO = {
          title, content, boardImageList
        }
        postBoardRequest(requestBody, accessToken).then(postBoardResponse);
      }
      else {
        if(!boardNumber) return;
        const requestBody: PatchBoardRequestDTO = {
          title, content, boardImageList
        }
        patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse);
      }


    }

    // render : 업로드 버튼 컴포넌트 렌더링
    if (title && content)
      return <div className='black-button' onClick={onUploadButtonClickHandler}> {'업로드'} </div>;
    else
      // render : 업로드 불가 버튼 컴포넌트 렌더링
      return <div className='disable-button' > {'업로드'} </div>;
  };
  // effect : path가 변경될 때마다 실행 될 함수
  useEffect(() => {
    /*****************나중에 경로 추가했을 때 수정 필요함************************* */
    const isAuthPage = pathname.startsWith(AUTH_PATH());
    setAuthPage(isAuthPage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
    const isMainPage = pathname.startsWith(MAIN_PATH());
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isBoardDetailPage = pathname.startsWith(BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);
    const isBoardWritePage = pathname.startsWith(BOARD_WRITE_PATH());
    setBoardWritePage(isBoardWritePage);
    const isBoardUpdatePage = pathname.startsWith(BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);
    const isBoardListPage = pathname.startsWith(BOARD_LIST());
    setBoardListPage(isBoardListPage);
  }, [pathname]);
  // effect : login user가 변경될 때 마다 실행 될 함수
  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser])
  /********************************************************************************************************************************************** */
  // render : Header 헤더 레이아웃 렌더링
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div style={{ width: '32px', height: '32px' }} className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>{'과외해듀오'}</div>
        </div>
        <div className='header-right-box'>
          {/* {pathname !== INDEX_PATH() && (
            <>
              {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
              {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <LoginMyPageButton />} 
              {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
            </>
          )} */}
          {(
            <>
              {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
              {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage || isBoardListPage) && <LoginMyPageButton />}
              {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
