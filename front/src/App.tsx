import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import BoardDetail from 'views/Board/Detail';
import Search from 'views/Search';
import User from 'views/User';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/FullLayout';
import { Mobile, PC } from 'utils/responsive';
// import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, INDEX_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH,  MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import NotFoundPage from 'views/404';
// import IndexPage from 'views/INDEX';

// component: Application  컴포넌트

function App() {
  const {pathname} = useLocation();
  
  // render: Application 컴포넌트 렌더링
  // description: 메인화면 : '/' -Main//
  // description: 로그인 + 회원가입: /auth' - Authentication
  // description: 검색 화면 : /search/:word' -Search//
  // description: 게시물 상세보기 : 'board/detail/:boardNumber - BoardDetail'
  // description: 게시물 작성하기: 'board/write' - BoardWrite
  // description: 게시물 수정하기: '/board/update/:boardNumber' - BoardUpdate
  return(
    // <div>
  
    // </div>

    
    <>
<Routes>
  {/* INDEX_PATH에 대한 경로 설정. 이 경로일 때는 Container 컴포넌트를 사용하지 않음 */}
  {/* <Route path={INDEX_PATH()} element={<IndexPage/>}></Route> */}

  {/* 나머지 경로들에 대해서는 Container 컴포넌트를 사용 */}
  <Route element={<Container/>}>
    <Route path={MAIN_PATH()} element={<Main />}/>
    <Route path={AUTH_PATH()} element={<Authentication />}/>
    <Route path={SEARCH_PATH(':searchWord')} element={<Search/>}></Route>
    <Route path={USER_PATH(':userId')} element={<User />}/>
    <Route path={BOARD_PATH()}>
      <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />}/>
      <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />}/>
      <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />}/>
    </Route>
    <Route path='*' element={<NotFoundPage/>}></Route>
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
