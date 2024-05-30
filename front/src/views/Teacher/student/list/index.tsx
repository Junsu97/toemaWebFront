import loginUserStore from "../../../../stores/login-user.store";
import {useNavigate, useParams} from "react-router-dom";
import Pagenation from "../../../../components/Pagination";
import * as React from "react";
import {usePagination} from "../../../../hooks";
import MatchedStudentList from "../../../../components/MatchedStudentListItem";
import {useEffect} from "react";
import {getMatchedStudentListRequest} from "../../../../apis";
import {useCookies} from "react-cookie";
import {AUTH_PATH, MAIN_PATH} from "../../../../constant";
import {GetMatchedStudentListResponseDto} from "../../../../apis/response/teacher";
import {ResponseDto} from "../../../../apis/response";
import MatchedStudentListItemInterface from "../../../../types/interface/matched-student-list-item.interface";
import './style.css';

export default function MatchedStudents(){
    const {loginUser} = loginUserStore();
    const navigate = useNavigate();
    const [cookies] = useCookies();
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<MatchedStudentListItemInterface>(12);
    const {teacherId} = useParams();


    const getMatchedStudentListResponse = (responseBody: GetMatchedStudentListResponseDto | ResponseDto | null) => {
        if(!responseBody){
            alert('서버로부터 정보를 불러오는데 실패했습니다.');
            return;
        }
        const {code} = responseBody;
        if(code === 'DBE') {
            alert('데이터베이스 오류입니다')
            return;
        }
        if(code === 'NU'){
            alert('관리중인 학생이 존재하지 않습니다.');
            return;
        }
        if(code !== 'SU'){
            alert('오류가 발생했습니다.');
            return;
        }
        const {studentList} = responseBody as GetMatchedStudentListResponseDto;
        setTotalList(studentList);
    }

    useEffect(() => {
        if(!loginUser){
            alert('로그인 후 이용해주세요.');
            navigate(AUTH_PATH());
            return;
        }
        if(!cookies.accessToken || teacherId !== loginUser.userId){
            alert('비정상적인 접근입니다.');
            navigate(MAIN_PATH());
            return;
        }
        getMatchedStudentListRequest(cookies.accessToken).then(getMatchedStudentListResponse);
    }, []);
    return(
        <div className='wrapper'>
            <div style={{width: '100%'}}>
                <div className='title' style={{marginBottom:'10px'}}>{'관리중인 학생 목록'}</div>
                <div className='contentBox'>
                    <div className='container'>
                        {viewList.map(studentListItem => <MatchedStudentList
                            studentListItem={studentListItem}></MatchedStudentList>)}
                    </div>
                    <div><div className='list-bottom-pagination-box'>
                        <Pagenation
                            currentPage={currentPage}
                            currentSection={currentSection}
                            setCurrentPage={setCurrentPage}
                            setCurrentSection={setCurrentSection}
                            viewPageList={viewPageList}
                            totalSection={totalSection}/>
                    </div></div>
                </div>
            </div>
        </div>
    )
}