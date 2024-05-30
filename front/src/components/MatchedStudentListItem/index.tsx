import MatchedStudentListItemInterface from "../../types/interface/matched-student-list-item.interface";
import defautltProfileImage from "../../assets/image/default-profile-image.png";
import './style.css';
import React, {useEffect, useState} from "react";
import {HOMEWORK, MAIN_PATH, STUDENT_INFO, TEACHER_APPLY_LIST, TEACHER_INFO} from "../../constant";
import {useNavigate, useParams} from "react-router-dom";
import {patchApplyRequest} from "../../apis";
import {PatchApplyRequestDTO} from "../../apis/reqeust/teacher";
import loginUserStore from "../../stores/login-user.store";
import {useCookies} from "react-cookie";
import {PatchApplyResponseDTO} from "../../apis/response/teacher";
import {ResponseDto} from "../../apis/response";
import ConfirmModal from "../ConfirmModal";

interface Props{
    studentListItem: MatchedStudentListItemInterface
}
export default function MatchedStudentList({studentListItem} : Props){
    const {userId, nickname, school, profileImage} = studentListItem;
    const [cookies] = useCookies();
    const navigator = useNavigate();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [studentId, setStudentId] = useState<string>('');
    const {teacherId} = useParams();
    const {loginUser} = loginUserStore();

    const navigate = useNavigate();
    const handleOpenDialog = () => {
        setShowModal(true);
    };

    const patchApplyResponse = (responseBody: PatchApplyResponseDTO | ResponseDto | null) => {
        if(!responseBody){
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        const {code} = responseBody;
        if(code === 'NA' || code === 'NP'){
            alert('잘못된 접근입니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        if(code !== 'SU'){
            alert('잘못된 요청입니다.\n다시 시도해주세요.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        alert('완료되었습니다.');
        navigate(TEACHER_APPLY_LIST());
        return;
    }
    const handleConfirm = () => {
        setShowModal(false);
        if(!loginUser || !cookies.accessToken) return;
        const requestBody: PatchApplyRequestDTO = {
            studentId: userId as string,
            teacherId: teacherId as string,
            content: '',
            status: '거절됨',
            userType: loginUser.userType
        }
        patchApplyRequest(requestBody, cookies.accessToken).then(patchApplyResponse);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    useEffect(() => {
        setStudentId(studentListItem.userId);
        if(!teacherId){
            alert('비정상적인 접근입니다.');
            navigator(MAIN_PATH());
        }
    }, [teacherId]);
    const homeworkButtonClickHandler = () => {
        if(!teacherId){
            alert('비정상적인 접근입니다.');
            navigator(MAIN_PATH());
        }
        navigator(HOMEWORK(teacherId as string,studentId));
    }


    return(
        <>
            <div className="content">
                <div className="card">
                    <div className="firstinfo">
                        <img src={profileImage ? profileImage : defautltProfileImage} alt="Profile Image"  />
                        <div className="profileinfo">
                            <h1 className="userId" >{userId}</h1>
                            <h3>{school}</h3>
                            {/*<p className="bio">{}</p>*/}
                        </div>
                    </div>
                </div>
                <div className="badgescard">
                    <div style={{
                        marginLeft: '50%',
                        alignItems: 'center',
                        display: 'contents',
                        justifyContent: 'space-evenly',
                        width: '550px',
                        height:'150px',
                    }}>
                        <div className={'black-button'} onClick={homeworkButtonClickHandler}>숙제 관리</div><div className={'black-button'}>과외 일정</div><div className={'black-button'} onClick={handleOpenDialog}>매치 해제</div>
                        {showModal && (
                            <ConfirmModal message={'학생과의 매치를 해제하시겠습니까?'} onConfirm={handleConfirm} onCancel={handleCancel}/>
                        )}
                    </div>
                    {/*</span>*/}
                </div>
            </div>
        </>
    )
}