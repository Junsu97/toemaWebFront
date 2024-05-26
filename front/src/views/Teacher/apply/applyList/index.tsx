import Pagenation from "../../../../components/Pagination";
import React, {useEffect, useState} from "react";
import {usePagination} from "../../../../hooks";
import loginUserStore from "../../../../stores/login-user.store";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH} from "../../../../constant";
import ApplyListItem from "../../../../components/ApplyListItem";
import ApplyListItemInterface from "../../../../types/interface/apply-list-item.interface";
import {postApplyListRequest} from "../../../../apis";
import PostApplyListRequestDto from "../../../../apis/reqeust/teacher/post-apply-list-request.dto";
import PostApplyListResponseDto from "../../../../apis/response/teacher/post-apply-list-response.dto";
import {ResponseDto} from "../../../../apis/response";
import './style.css';

export default function ApplyList() {
    const {loginUser} = loginUserStore();
    const [isStudent, setIsStudent] = useState<boolean>(false);
    const [cookies, setCookies] = useCookies();
    const [matchState, setMatchState] = useState<string>('');
    const navigate = useNavigate();

    const postApplyListResponse = (responseBody : PostApplyListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;

        const {applyList} = responseBody as PostApplyListResponseDto;
        setTotalList(applyList);
    }
    useEffect(() => {
        if(!loginUser || !cookies.accessToken){
            alert('로그인 후 이용해주시기 바랍니다.');
            navigate(AUTH_PATH());
            return;
        }

        if(loginUser.userType === 'STUDENT') setIsStudent(true);
        const requestBody : PostApplyListRequestDto = {
            userId:loginUser.userId,
            userType: loginUser.userType
        };
        postApplyListRequest(requestBody).then(postApplyListResponse);
    }, []);
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<ApplyListItemInterface>(3);

    return (
        <div id='list-bottom-wrapper'>
            <div className='list-bottom-container'>
                <div className='list-bottom-title'>{'신청 내역'}</div>
                <div className='list-bottom-contents-box'>
                    <div className='list-bottom-current-contents'>
                        {viewList.map(applyList => <ApplyListItem applyListItem={applyList}/>)}
                    </div>


                </div>
                <div className='list-bottom-pagination-box'>
                    <Pagenation
                        currentPage={currentPage}
                        currentSection={currentSection}
                        setCurrentPage={setCurrentPage}
                        setCurrentSection={setCurrentSection}
                        viewPageList={viewPageList}
                        totalSection={totalSection}/>
                </div>
            </div>
        </div>
    )

}
