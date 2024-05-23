import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {useLoginUserStore} from "../../../stores";
import {useCookies} from "react-cookie";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import './style.css';
import {AUTH_PATH, TEACHER_APPLY_LIST, TEACHER_LIST} from "../../../constant";
import PostApplyTeacherRequestDTO from "../../../apis/reqeust/teacher/post-apply-teacher-request.dto";
import {getApplyBeforeRequest, postApplyTeacherRequest} from "../../../apis";
import {GetApplyBeforeResponseDTO, PostApplyTeacherResponseDTO} from "../../../apis/response/teacher";
import {ResponseDto} from "../../../apis/response";

export default function TeacherApply() {
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const [content, setContent] = useState<string>('');
    const {userId} = useParams();
    const {loginUser} = useLoginUserStore();
    const [cookies] = useCookies();
    const navigator = useNavigate();

    useEffect(() => {
        if (!loginUser || !cookies.accessToken) {
            alert('로그인 후 이용해주세요.');
            navigator(AUTH_PATH());
            return;
        }
    }, []);

    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setContent(value);
        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current?.scrollHeight}px`;
    }
    const postApplyTeacherResponse = (responseBody: PostApplyTeacherResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('네트워크 서버에 문제가 발생했습니다.');
            return;
        }
        const {code} = responseBody;
        if (code === 'NU') {
            alert('잘못된 요청입니다.');
            navigator(TEACHER_LIST());
            return;
        }
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code !== 'SU') {
            alert('알 수 없는 오류가 발생하였습니다.');
            navigator(TEACHER_LIST());
            return;
        }
        alert(userId + ' 선생님께 신청이 완료되었습니다.');
        navigator(TEACHER_APPLY_LIST());
    }
    const getApplyBeforeResponse = (responseBody: GetApplyBeforeResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버가 요청을 받을 수 없는 상태입니다.');
            return;
        }
        const {code} = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.')
            return;
        }

        if (code === 'DA') {
            alert('한 명의 선생님에겐 한 번만 신청할 수 있습니다.')
            navigator(TEACHER_LIST());
            return;
        }
        if (code !== 'SU') {
            alert('알 수 없는 오류가 발생하였습니다.');
            return;
        }
        const accessToken = cookies.accessToken;
        if (!userId) {
            alert('잘못된 요청입니다.');
            navigator(TEACHER_LIST());
            return;
        }
        const teacherId = userId;
        const requestBody: PostApplyTeacherRequestDTO = {
            teacherId, content
        }
        postApplyTeacherRequest(requestBody, accessToken).then(postApplyTeacherResponse);
    }
    const onApplyButtonClickHandler = async () => {
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            alert('토큰 유효기간이 만료되었습니다.');
            navigator(AUTH_PATH());
            return;
        }
        if (!userId) {
            alert('잘못된 요청입니다.');
            navigator(TEACHER_LIST());
            return;
        }
        const teacherId = userId;
        const requestBody: PostApplyTeacherRequestDTO = {
            teacherId, content
        }
        getApplyBeforeRequest(accessToken).then(getApplyBeforeResponse);

    }

    return (
        <div id='board-write-wrapper'>
            <div className='board-write-container'>
                <div className='board-write-box'>
                    <div className='board-write-title-box'>
                        <div className='board-write-title-textarea'>선생님 신청하기</div>
                        <div style={{marginLeft: '85%'}} className={'black-button'}
                             onClick={onApplyButtonClickHandler}>신청하기
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='board-write-content-box'>
                        <textarea ref={contentRef} className='board-write-content-textarea'
                                  placeholder='선생님께 하고싶은 말을 적어주세요.' value={content} onChange={onContentChangeHandler}/>

                    </div>
                </div>
            </div>
        </div>
    )
}