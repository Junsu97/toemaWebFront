import React, { useState } from "react";
import './style.css';
import CalendarModal from "../Calender/calendarmodal";
import HomeworkListItemInterface from "../../types/interface/homework-list-item.interface";
import {deleteHomeworkRequest} from "../../apis";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH, MAIN_PATH} from "../../constant";
import {HomeAnotherResponseDTO} from "../../apis/response/homework";
import {ResponseDto} from "../../apis/response";

interface Props{
    homeworkListItem:HomeworkListItemInterface;
}
export default function HomeworkList({homeworkListItem}:Props) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const {seq, studentId, teacherId, startDate, endDate, content, submit} = homeworkListItem;
    const blank = '\u00A0';
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const deleteHomeworkResponse = (responseBody: HomeAnotherResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
        if(code === 'NU'){
            alert('선생 또는 학생이 DB에 존재하지 않는 유저입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'NH'){
            alert('존재하지 않는 숙제 정보입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'NP'){
            alert('수정 권한이 없습니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'DBE'){
            alert('데이터베이스 오류입니다.')
            navigate(MAIN_PATH());
            return;
        }
        if(code !== 'SU'){
            alert('알 수 없는 에러가 발생하였습니다.');
            return;
        }

        alert('삭제되었습니다.');
        window.location.reload();
        return;
    }

    const onDeleteButtonClickHandler = () => {
        if(!cookies.accessToken){
            alert('로그인 후 이용해주세요.');
            navigate(AUTH_PATH());
            return;
        }
        deleteHomeworkRequest(seq, cookies.accessToken).then(deleteHomeworkResponse);
    }

    return (
        <div id="homework">
            <div className="homework-wrapper">
                <div className="content-date-container">
                    {startDate}{blank}~{blank}{endDate}
                    {/*<div className="content-date">{startDate}</div>*/}
                    {/*<div className="content-date">{endDate}</div>*/}
                </div>
                <div className="homework-content">{content}</div>
                <div className="button-box">
                    <div className="black-button" onClick={handleOpen}>수정하기</div>
                    <div className="black-button" onClick={onDeleteButtonClickHandler}>삭제하기</div>
                    <CalendarModal open={isOpen} onClose={handleClose} homework={homeworkListItem}/>
                </div>
            </div>
        </div>
    );
}
