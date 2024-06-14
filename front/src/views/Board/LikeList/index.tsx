import React, {useEffect} from "react";
import loginUserStore from "../../../stores/login-user.store";
import {useNavigate, useParams} from "react-router-dom";
import {AUTH_PATH, MAIN_PATH} from "../../../constant";
import {getLikeBoardListRequest} from "../../../apis";
import {GetLikeBoardListResponseDTO} from "../../../apis/response/board";
import {ResponseDto} from "../../../apis/response";
import {usePagination} from "../../../hooks";
import {BoardListDTO} from "../../../types/interface";
import BoardListItem from "../../../components/BoarListItem";
import Pagenation from "../../../components/Pagination";

export default function LikeList(){
    const {loginUser} = loginUserStore();
    const navigate = useNavigate();
    const {userId} = useParams();
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<BoardListDTO>(3);
    const getLikeBoardListResponse = (responseBody : GetLikeBoardListResponseDTO | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;

        const {likeList} = responseBody as GetLikeBoardListResponseDTO;
        setTotalList(likeList);
    }
    useEffect(() => {
        if(!loginUser){
            alert('로그인 후 이용해주세요.');
            navigate(AUTH_PATH());
            return;
        }

        if(loginUser.userId !== userId){
            alert('비정상적인 접근입니다.')
            navigate(MAIN_PATH());
            return;
        }

        getLikeBoardListRequest(loginUser.userId).then(getLikeBoardListResponse);

    }, []);
    return(
        <div id='list-bottom-wrapper'>
            <div className='list-bottom-container'>
                <div className='list-bottom-title'>{'좋아요 게시물'}</div>
                <div className='list-bottom-contents-box'>
                    <div className='list-bottom-current-contents'>
                        {viewList.map(boardListItem => <BoardListItem boardListItem={boardListItem} />)}
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