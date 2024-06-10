import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

import './App.css';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import BoardDetail from 'views/Board/Detail';
import Search from 'views/Search';
import UserPage from 'views/User';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/FullLayout';
import { Mobile, PC } from 'utils/responsive';
// import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, INDEX_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_LIST,
  BOARD_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  CHANGE_PASSWORD,
  FACE_ID,
  FIND_ID,
  FIND_PASSWROD, HOMEWORK, HOMEWORK_LIST,
  MAIN_PATH,
  MATCHED_STUDENT_LIST,
  SEARCH_PATH,
  STUDENT_INFO,
  TEACHER_APPLY,
  TEACHER_APPLY_DETAIL,
  TEACHER_APPLY_LIST,
  TEACHER_APPLY_UPDATE,
  TEACHER_INFO,
  TEACHER_LIST, TUTORING,
  USER_PATH,
  USER_UPDATE_PATH
} from 'constant';
import NotFoundPage from 'views/404';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDTO } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';
import BoardList from 'views/Board/List';
import UserInfoUpdatePage from 'views/EditProfile';
import FindId from 'views/FindId';
import FindPassword from 'views/FindPassword';
import ChangePassword from 'views/ChangePassword';
import FaceCapture from 'views/FaceID';
import TeacherList from "./views/Teacher/List";
import TeacherApply from "./views/Teacher/write";
import ApplyList from "./views/Teacher/apply/applyList";
import TeacherInfo from "./views/Teacher/info";
import ApplyDetail from "./views/Teacher/apply/applyDetail";
import ApplyUpdate from "./views/Teacher/apply/applyUpdate";
import MatchedStudents from "./views/Teacher/student/list";
import StudentInfo from "./views/Teacher/student/info";
import Homework from "./views/Homework";
import Tutoring from "./views/Tutoring";
import HomeworkListStudent from "./views/HomeworkList";
// import IndexPage from 'views/INDEX';

// component: Application  컴포넌트

function App() {
  const { pathname } = useLocation();
  // state : 로그인 유저 전역 상태
  const { loginUser,setLoginUser, resetLoginUser } = useLoginUserStore();
  // state : cookie 상태
  const [cookies, setCookies] = useCookies();
  let isTeacher = false;
  // function : getSignInUser response 처리함수
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDTO | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...(responseBody as GetSignInUserResponseDTO) }
    console.log("app : " + loginUser.userName);
    if (loginUser.userType === 'TEAHCER') {
      isTeacher = true;
    }
    
    setLoginUser(loginUser);
  }


  // effect : cookies에 accessToken cookie 값이 변경될 때 마다 실행할 함수
  useEffect(() => {
    console.log("쿠키값 바뀜");
    console.log("로그인 유저 : " + loginUser);
    if (!cookies.accessToken) {
      console.log("앱 - 액세스토큰없음");
      resetLoginUser();
      return;
    }
    if(!loginUser){
      getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
    }
    
  }, [cookies.accessToken, loginUser]);


  // render: Application 컴포넌트 렌더링
  // description: 메인화면 : '/' -Main//
  // description: 로그인 + 회원가입: /auth' - Authentication
  // description: 검색 화면 : /search/:word' -Search//
  // description: 게시물 상세보기 : 'board/detail/:boardNumber - BoardDetail'
  // description: 게시물 작성하기: 'board/write' - BoardWrite
  // description: 게시물 수정하기: '/board/update/:boardNumber' - BoardUpdate
  return (
    // <div>
    // </div>
    <>
      <Routes>
        {/* INDEX_PATH에 대한 경로 설정. 이 경로일 때는 Container 컴포넌트를 사용하지 않음 */}
        {/* <Route path={INDEX_PATH()} element={<IndexPage/>}></Route> */}

        {/* 나머지 경로들에 대해서는 Container 컴포넌트를 사용 */}

        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={FIND_ID()} element={<FindId/>} />
          <Route path={TEACHER_LIST()} element={<TeacherList/>}/>
          <Route path={TEACHER_INFO(':teacherUserId')} element={<TeacherInfo/>}/>
          <Route path={TEACHER_APPLY_LIST()} element={<ApplyList/>}/>
          <Route path={TEACHER_APPLY_DETAIL(':teacherUserId',':studentUserId')} element={<ApplyDetail/>}/>
          <Route path={FACE_ID()} element={<FaceCapture/>}/>
          <Route path={HOMEWORK(':teacherUserId',':studentUserId')} element={<Homework/>}/>
          <Route path={HOMEWORK_LIST(':studentUserId')} element={<HomeworkListStudent/>}/>
          <Route path={TUTORING(':teacherUserId', ':studentUserId')} element={<Tutoring/>}/>
          <Route path={MATCHED_STUDENT_LIST(':teacherId')} element={<MatchedStudents/>}/>
          <Route path={STUDENT_INFO(':studentId')} element={<StudentInfo/>}/>
          <Route path={FIND_PASSWROD()} element={<FindPassword/>} />
          <Route path={CHANGE_PASSWORD(':userId')} element={<ChangePassword/>}/>
          <Route path={TEACHER_APPLY_UPDATE(':teacherUserId',':studentUserId')} element={<ApplyUpdate/>}/>
          <Route path={SEARCH_PATH(':searchWord')} element={<Search />}></Route>
          <Route path={USER_PATH(':userId')} element={<UserPage />} />
          <Route path={USER_UPDATE_PATH(':userId')} element={<UserInfoUpdatePage/>}/>
          <Route path={TEACHER_APPLY(':userId')} element={<TeacherApply/>}/>
          <Route path={TEACHER_APPLY_LIST()} element={<ApplyList/>}/>
          <Route path={BOARD_PATH()}>
            <Route path={BOARD_LIST()} element={<BoardList />}></Route>
            <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
            <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
            <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
          </Route>

          <Route path='*' element={<NotFoundPage />}></Route>
        </Route>
      </Routes>

      {pathname !== AUTH_PATH() &&
        <div>
          <Mobile>mobile</Mobile>
          <PC>pc</PC>
        </div>
      }

    </>

  );
}

export default App;
