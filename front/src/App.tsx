import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from 'layouts/Sidebar/Sidebar';
import Footer from 'layouts/Footer';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import BoardDetail from 'views/Board/Detail';
import Search from 'views/Search';
import User from 'views/User';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/FullLayout';
import { Mobile, PC } from 'utils/responsive';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';

// component: Application  컴포넌트

function App() {
  
  
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
        <Route path='*' element={<h1>404 Not Found</h1>}></Route>
      </Route>

      
    </Routes>

    <Mobile>mobile</Mobile>
    <PC>pc</PC>

    </>
    
  );
}

export default App;
