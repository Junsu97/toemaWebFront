import React, {ChangeEvent, useRef, useState} from "react";
import {PatchApplyResponseDTO} from "../../../../apis/response/teacher";
import {ResponseDto} from "../../../../apis/response";
import {TEACHER_APPLY_LIST} from "../../../../constant";
import {PatchApplyRequestDTO} from "../../../../apis/reqeust/teacher";
import {useCookies} from "react-cookie";
import {useNavigate, useParams} from "react-router-dom";
import {patchApplyRequest} from "../../../../apis";

export default function ApplyUpdate(){
    const [cookies, setCookies] = useCookies();
    const {teacherUserId , studentUserId} = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const contentRef = useRef<HTMLTextAreaElement | null>(null);

    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setContent(value);
        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current?.scrollHeight}px`;
    }
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
    const updateButtonClickHandler = () => {
        const requestBody: PatchApplyRequestDTO = {
            studentId: studentUserId as string,
            teacherId: teacherUserId as string,
            content: content,
            status: 'A',
            userType: ''
        }
        patchApplyRequest(requestBody, cookies.accessToken).then(patchApplyResponse);

    }
    return(
        <div id='board-write-wrapper'>
            <div className='board-write-container'>
                <div className='board-write-box'>
                    <div className='board-write-title-box'>
                        <div className='board-write-title-textarea'>선생님 신청하기</div>
                        <div style={{marginLeft: '85%'}} className={'black-button'}
                             onClick={updateButtonClickHandler}>수정하기
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