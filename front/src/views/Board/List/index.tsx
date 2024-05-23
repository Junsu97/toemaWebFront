import React, { useEffect, useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import Top3Item from 'components/Top3Item';
import { BoardListDTO } from 'types/interface';
import { boardMock, latestBoardListMock, top3BoardListMock } from 'mocks';
import BoardListItem from 'components/BoarListItem';
import { useNavigate } from 'react-router-dom';
import { BOARD_WRITE_PATH, SEARCH_PATH } from 'constant';
import { getLatestBoardListRequest, getPopularListRequestDTO, getTop3BoardListRequest } from 'apis';
import { GetLatesttBoardListResponseDTO, GetTop3BoardListResponseDTO } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';
import Pagenation from 'components/Pagination';
import { GetPopularListResponseDTO } from 'apis/response/search';

// component: board list  컴포넌트
export default function BoardList() {
  // function :  네비게이트 함수
  const navigate = useNavigate();
  // state : 로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  // component: board list 상단 컴포넌트
  const ListTop = () => {

    // state : 주간 top3 게시물 리스트 상태
    const [top3BoardList, setTop3BoardList] = useState<BoardListDTO[]>([]);

    // function : get top 3 board list response 처리 함수
    const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { top3List } = responseBody as GetTop3BoardListResponseDTO;
      setTop3BoardList(top3List);
    }
    // effect : 첫 마운트 시 실행될 함수
    useEffect(() => {
      getTop3BoardListRequest().then(getTop3BoardListResponse);
    }, []);
    // render: board list  상단 컴포넌트 렌더링
    return (
      <div id='list-top-wrapper'>
        <div className='list-top-container'>
          {/* <div className='list-top-title'>{'과외해듀오에서\n선생님들과 공부를 시작해보세요.'}</div> */}
          <div className='list-top-contents-box'>
            <div className='list-top-contents-title'>{'주간 TOP 3 게시글'}</div>
            <div className='list-top-contents'>
              {top3BoardList.map(top3List => <Top3Item top3ListItem={top3List} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
  // component: board list 하단 컴포넌트
  const ListBottom = () => {
    // state : 페이지 네이션 관련 상태
    const {
      currentPage, currentSection, viewList, viewPageList, totalSection,
      setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<BoardListDTO>(5);
    // state : 인기 검색어 리스트 상태
    const [popularWordList, setPopularWordList] = useState<string[]>([]);

    // function : get latest board list response  처리 함수
    const getLatestBoardListResponse = (responseBody: GetLatesttBoardListResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { latestList } = responseBody as GetLatesttBoardListResponseDTO;
      setTotalList(latestList);
    }

    // function : getPopularListResponse 처리 함수
    const getPopularListResponse = (responseBody: GetPopularListResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;
      const { popularWordList } = responseBody as GetPopularListResponseDTO;
      setPopularWordList(popularWordList);
    }

    // event handler : 인기 검색어 클릭 이벤트 처리
    const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    }
    const onBoardWriteButtonClickHandler = () => {
      if (!loginUser) {
        alert('로그인한 사용자만 이용할 수 있는 서비스입니다.');
        return;
      }
      if (loginUser.userType === 'STUDENT') {
        navigate(BOARD_WRITE_PATH());
      }
      if (loginUser.userType === 'TEACHER') {
        alert('공부인증 게시글은 학생회원만 작성할 수 있습니다.');
        return;
      }
    }
    // effect : 첫 마운트 시 실행될 함수
    useEffect(() => {
      getLatestBoardListRequest().then(getLatestBoardListResponse);
      getPopularListRequestDTO().then(getPopularListResponse);
    }, []);
    // render: board list  하단 컴포넌트 렌더링
    return (
      <div id='list-bottom-wrapper'>
        <div className='list-bottom-container'>
          <div className='list-bottom-title'>{'최신 게시물'}</div>
          <div className='list-bottom-contents-box'>
            <div className='list-bottom-current-contents'>
              {viewList.map(boardListItem => <BoardListItem boardListItem={boardListItem} />)}

            </div>
            <div className='list-bottom-popular-box'>
              <div className='list-bottom-popular-card'>
                <div className='list-bottom-popular-card-container'>
                  <div className='list-bottom-popular-card-title'>{'인기 검색어'}</div>
                  <div className='list-bottom-popular-card-contents'>
                    {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                  </div>
                </div>
              </div>
              <div className='black-large-full-button' onClick={onBoardWriteButtonClickHandler} style={{marginTop:'55px'}}>{'게시글 작성하기'}</div>
            </div>
          </div>
          <div>
            <div className='list-bottom-pagination-box'>
              <Pagenation
                  currentPage={currentPage}
                  currentSection={currentSection}
                  setCurrentPage={setCurrentPage}
                  setCurrentSection={setCurrentSection}
                  viewPageList={viewPageList}
                  totalSection={totalSection} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  // render : 메인 화면 컴포넌트 렌더링
  return (
    <div style={{ width: '100%' }}>
      <ListTop />
      <ListBottom />
    </div>
  )
}
