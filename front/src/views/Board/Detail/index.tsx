import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import FavoriteItem from 'components/FavoriteItem';
import { commentListMock, favoriteListMock } from 'mocks';
import { Board, CommentListDTO, FavoriteListDTO } from 'types/interface';
import CommentItem from 'components/CommentItem';
import Pagenation from 'components/Pagination';
import { useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { BOARD_LIST, BOARD_UPDATE_PATH, USER_PATH } from 'constant';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getFavoriteListReqeust, increaseViewCountRequest, postCommentRequest, putFavoriteRequest } from 'apis';
import GetBoardResponseDTO from 'apis/response/board/get-board.reponse.dto';
import { ResponseDto } from 'apis/response';
import { DeleteBoardResponseDTO, GetCommentListResponseDTO, GetFavoriteListResponseDTO, IncreaseViewCountResponseDTO, PostCommentResponseDTO, PutFavoriteResponseDTO } from 'apis/response/board';

import dayjs from 'dayjs';
import { useCookies } from 'react-cookie';
import { PostCommentRequestDTO } from 'apis/reqeust/board';
import { usePagination } from 'hooks';
interface Props {
  favoriteListItem: FavoriteListDTO;
}

// component : 게시물 상세 화면 컴포넌트
export default function BoardDetail() {
  // state : 게시물 번호 path variable 상태
  const { boardNumber } = useParams();
  // state : 로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  // state : 쿠키 상태
  const [cookies, setCookies] = useCookies();

  // function : 네비게이트 함수
  const navigator = useNavigate();
  // function : increase view count 처리 함수
  const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDTO | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'NB') alert('존재하지 않는 게시물 입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    return;
  }

  // component : 게시물 상세 상단 컴포넌트
  const BoardDetailTop = () => {
    // state : 작성자 여부 상태
    const [isWriter, setWriter] = useState<boolean>(false);

    // state: 게시판 상태
    const [board, setBoard] = useState<Board | null>(null);
    // state : more 버튼 상태
    const [showMore, setShowMore] = useState<boolean>(false);

    // function : 작성일 포멧 변경 함수
    const getWriteDatetimeFormat = () => {
      if (!board) return '';
      const date = dayjs(board.writeDatetime);
      return date.format('YYYY. MM. DD.');
    }

    // function : get board response 처리
    const getBoardResponse = (responseBody: GetBoardResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');

      if (code !== 'SU') {
        navigator(BOARD_LIST());
        return;
      }

      const board: Board = { ...responseBody as GetBoardResponseDTO };
      setBoard(board);

      if (!loginUser) {
        setWriter(false);
        return;
      }
      const isWriter = loginUser.userId === board.writerId;
      setWriter(isWriter);
    }

    // function: delete board response 처리
    const deleteBoardResponse = (responseBody: DeleteBoardResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'NP') alert('권한이 없습니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      if (window.confirm("삭제되었습니다.")) {
        navigator(BOARD_LIST());
      }
    }
    // event handler : more 버튼 클릭 이벤트 처리
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    }
    // event handler : 닉네임 클릭 이벤트 처리
    const onNicknameClickHandler = () => {
      if (!board) return;
      navigator(USER_PATH(board.writerId));
    }
    // event handler : 수정 버튼 클릭 이벤트 처리
    const onUpdateButtonClickHandler = () => {
      if (!board || !loginUser) return;
      if (loginUser.userId !== board.writerId) return;
      console.log(BOARD_UPDATE_PATH(board.boardNumber));
      navigator(BOARD_UPDATE_PATH(board.boardNumber));
    }
    // event handler : 삭제 버튼 클릭 이벤트 처리
    const onDeleteButtonClickHandler = () => {
      if (!boardNumber || !board || !loginUser || !cookies.accessToken) return;
      if (loginUser.userId !== board.writerId) return;

      deleteBoardRequest(boardNumber, cookies.accessToken).then(deleteBoardResponse);
    }
    // effect : 게시물 번호 path variable이 바뀔때 마다 게시물 불러오기
    useEffect(() => {
      if (!boardNumber) {
        navigator(BOARD_LIST());
        return;
      }
      getBoardRequest(boardNumber).then(getBoardResponse);
    }, [boardNumber]);

    // render : 게시물 상세 상단 컴포넌트 렌더링
    if (!board) return (
      <>
      </>
    );

    // render : 게시물 상세 상단 컴포넌트 렌더링
    return (
      <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title' >{board.title}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url(${board.writerProfileImage ? board.writerProfileImage : defaultProfileImage})` }}></div>
              <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>{board.writerNickname}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{getWriteDatetimeFormat()}</div>
            </div>
            {isWriter &&
              <div className='icon-button' onClick={onMoreButtonClickHandler}>
                <div className='icon more-icon'></div>
              </div>
            }
            {showMore &&
              <div className='board-detail-more-box'>
                <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                <div className='divider'></div>
                <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
              </div>
            }
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{board.content}</div>
          {board.boardImageList.map(image => <img className='board-detail-main-image' src={image} />)}
        </div>
      </div>
    )
  };
  // component : 게시물 상세 하단 컴포넌트
  const BoardDetailBottom = () => {
    //state : 댓글 textarea 참조 상태
    const commentRef = useRef<HTMLTextAreaElement | null>(null);
    //state : 페이지네이션 관련 상태
    const {
      currentPage, currentSection, viewList, viewPageList, totalSection,
      setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<CommentListDTO>(3);
    // state : 좋아요 리스트 상태
    const [favoriteList, setFavoriteList] = useState<FavoriteListDTO[]>([]);
    // state : 좋아요 상태
    const [isFavorite, setFavorite] = useState<boolean>(false);
    // state : 좋아요 리스트 보기 상태
    const [showFavorite, setShowFavorite] = useState<boolean>(false);
    // state : 댓글 리스트 보기 상태
    const [showComment, setShowComment] = useState<boolean>(false);
    // state : 댓글 상태
    const [comment, setComment] = useState<string>('');
    // state : 전체 댓글 개수 상태
    const[totalComentCount, setTotalComentCount] = useState<number>(0);

    // function : get favorite list response 처리 함수
    const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { favoriteList } = responseBody as GetFavoriteListResponseDTO;
      setFavoriteList(favoriteList);
      favoriteList.forEach(favorite => {
        if (!loginUser) {
          setFavorite(false);
          return;
        }
        const isFavorite = favoriteList.findIndex(favorite => favorite.userId === loginUser.userId) !== -1;
        setFavorite(isFavorite);
      })
    }
    // function : get comment list response 처리 함수
    const getCommentListResponse = (responseBody: GetCommentListResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { commentList } = responseBody as GetCommentListResponseDTO;
      setTotalList(commentList);
      setTotalComentCount(commentList.length);
    }
    // function : put favorite list response 처리 함수
    const putFavoriteResponse = (responseBody: PutFavoriteResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'DBE') alert('데터베이스 오류입니다.');
      if (code !== 'SU') return;

      if (!boardNumber) return;
      getFavoriteListReqeust(boardNumber).then(getFavoriteListResponse);
    }
    // function : post comment response 처리 함수
    const postCommentResponse = (responseBody: PostCommentResponseDTO | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'DBE') alert('데터베이스 오류입니다.');
      if (code !== 'SU') return;
      setComment('');
      if (!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }
    // event handler : 좋아요 클릭 이벤트 처리
    const onFavoriteClickHandler = () => {
      if (!boardNumber || !loginUser || !cookies.accessToken) return;
      putFavoriteRequest(boardNumber, cookies.accessToken).then(putFavoriteResponse);

    }

    // event handler : 좋아요 리스트 보기 클릭 이벤트 처리
    const onShowFavoriteClickHandler = () => {
      setShowFavorite(!showFavorite);
    }
    // event handler : 댓글 리스트 보기 클릭 이벤트 처리
    const onShowCommentClickHandler = () => {
      setShowComment(!showComment);
    }
    // event handler : 댓글 작성 버튼 클릭 이벤트 처리
    const onCommentSubmitButtonClickHandler = () => {
      if (!comment || !boardNumber || !loginUser || !cookies.accessToken) return;

      const requestBody: PostCommentRequestDTO = { content: comment };
      postCommentRequest(boardNumber, requestBody, cookies.accessToken).then(postCommentResponse);
    }
    // event handler : 댓글 변경  이벤트 처리
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setComment(value);
      if (!commentRef.current) return;
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }
    // effect : 게시물 번호 path variable이 바뀔때 마다 좋아요 및 댓글 리스트 불러오기
    useEffect(() => {
      if (!boardNumber) return;
      getFavoriteListReqeust(boardNumber).then(getFavoriteListResponse)
      getCommentListRequest(boardNumber).then(getCommentListResponse)
    }, [boardNumber])

    // render : 게시물 상세 하단 컴포넌트 렌더링
    return (
      <div id='board-detail-bottom'>
        <div className='board-detail-bottom-button-box'>
          <div className='board-detail-bottom-button-group'>
            <div className='icon-button' onClick={onFavoriteClickHandler}>
              {isFavorite ?
                <div className='icon favorite-fill-icon'></div> :
                <div className='icon favorite-light-icon'></div>
              }

            </div>
            <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
            <div className='icon-button' onClick={onShowFavoriteClickHandler}>
              {showFavorite ?
                <div className='icon up-light-icon'></div> :
                <div className='icon down-light-icon'></div>
              }

            </div>
          </div>
          <div className='board-detail-bottom-button-group'>
            <div className='icon-button' >
              <div className='icon comment-icon'></div>
            </div>
            <div className='board-detail-bottom-button-text'>{`댓글 ${totalComentCount}`}</div>
            <div className='icon-button' onClick={onShowCommentClickHandler}>
              {showComment ?
                <div className='icon up-light-icon'></div> :
                <div className='icon down-light-icon'></div>
              }
            </div>
          </div>
        </div>
        {showFavorite &&
          <div className='board-detail-bottom-favorite-box'>
            <div className='board-detail-bottom-favorite-container'>
              <div className='board-detail-bottom-favorite-title'>{'좋아요 '}<span className='emphasis'>{favoriteList.length}</span></div>
              <div className='board-detail-bottom-favorite-contents'>
                {favoriteList.map(item => <FavoriteItem favoriteListItem={item} />)}
              </div>
            </div>
          </div>
        }
        {showComment &&
          <div className='board-detail-bottom-comment-box'>
            <div className='board-detail-bottom-comment-container'>
              <div className='board-detail-bottom-comment-title'>{'댓글 '}<span className='emphasis'>{totalComentCount}</span></div>
              <div className='board-detail-bottom-comment-list-container'>
                {viewList.map(item => <CommentItem commentListItem={item} />)}
              </div>
            </div>
            <div className='divider'></div>
            <div className='board-detail-bottom-comment-pagenation-box'>
              <Pagenation
                currentPage={currentPage}
                currentSection={currentSection}
                setCurrentPage={setCurrentPage}
                setCurrentSection={setCurrentSection}
                viewPageList={viewPageList}
                totalSection={totalSection} />
            </div>
            {loginUser !== null &&
              <div className='board-detail-bottom-comment-input-box'>
                <div className='board-detail-bottom-comment-input-container'>
                  <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler} />
                  <div className='board-detail-bottom-comment-button-box'>
                    <div className={comment === '' ? 'disable-button' : 'black-button'} onClick={onCommentSubmitButtonClickHandler}>{'댓글 달기'}</div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  };

  // effect : 게시물 번호 path variable이 바뀔때 마다 게시물 조회수 증가
  let effectFlag = true;
  useEffect(() => {
    if (!boardNumber) return;
    if (effectFlag) {
      effectFlag = false;
      return;
    }
    increaseViewCountRequest(boardNumber).then(increaseViewCountResponse)
  }, [boardNumber])
  // render : 게시물 상세 화면 컴포넌트 렌더링
  return (
    <div id='board-detail-wrapper'>
      <div className='board-detail-container'>
        <BoardDetailTop />
        <BoardDetailBottom />
      </div>
    </div>
  )
}
