import React, { useEffect, useState } from "react";
import './style.css';
import { CommentListDTO } from "types/interface";
import defatultProfileImage from 'assets/image/default-profile-image.png';
import dayjs from "dayjs";
import loginUserStore from "../../stores/login-user.store";
import {deleteCommentRequest} from "../../apis";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH, BOARD_DETAIL_PATH} from "../../constant";
import {DeleteCommentResponseDTO} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";

interface Props {
    commentListItem: CommentListDTO;
    onEditButtonClick: (comment: CommentListDTO) => void; // Callback for edit button click
}

export default function CommentItem({ commentListItem, onEditButtonClick }: Props) {
    const { loginUser } = loginUserStore();
    const [isWriter, setWriter] = useState<boolean>(false);
    const { commentNumber,boardNumber,nickname, profileImage, writeDatetime, content } = commentListItem;

    const [cookies] = useCookies();
    const navigate = useNavigate();
    const getElapsedTime = () => {
        const now = dayjs().add(0, 'hour');
        const gap = now.diff(writeDatetime, 's');

        if (gap < 60) return `${gap}초 전`; // 1분 미만
        if (gap < 3600) return `${Math.floor(gap / 60)}분 전`; // 1시간 미만
        if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`; // 하루 미만

        return `${Math.floor(gap / 86400)}일 전`;
    }

    useEffect(() => {
        if (loginUser && loginUser.nickname === nickname) {
            setWriter(true);
        } else {
            setWriter(false);
        }
    }, [loginUser, nickname]);

    const onUpdateButtonClickHandler = () => {
        onEditButtonClick(commentListItem); // Invoke callback with the comment details
    }

    const deleteCommentResponse = (responseBody: DeleteCommentResponseDTO | ResponseDto | null) => {
        if(!responseBody){
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const {code} = responseBody;
        if(code === 'NU'){
            alert('비정상적인 접근입니다.');
            return;
        }
        if(code === 'NC'){
            alert('존재하지 않는 댓글입니다.');
            return;
        }
        if(code === 'DBE'){
            alert('데이터베이스 오류입니다.');
            return;
        }
        if(code !== 'SU'){
            alert('에러가 발생하였습니다.');
            return;
        }
        alert('삭제되었습니다.');
        navigate(BOARD_DETAIL_PATH(boardNumber));
    }

    const onDeleteButtonClickHandler = () => {
        if(!cookies){
            alert('로그인 후 이용해주세요.');
            navigate(AUTH_PATH());
            return;
        }
        deleteCommentRequest(boardNumber,commentNumber, cookies.accessToken).then(deleteCommentResponse);
    }

    return (
        <div className='comment-list-item'>
            <div className='comment-list-item-top'>
                <div className='comment-list-item-profile-box'>
                    <div className='comment-list-item-profile-image'
                         style={{ backgroundImage: `url(${profileImage ? profileImage : defatultProfileImage})` }}></div>
                </div>
                <div className='comment-list-item-nickname'>{nickname}</div>
                <div className='comment-list-item-divider'>{`\|`}</div>
                <div className='comment-list-item-time'>{getElapsedTime()}</div>
                {isWriter &&
                    <>
                        <div className={'comment-update-delete'} onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                        <div className={'comment-update-delete'} onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                    </>
                }
            </div>
            <div className='comment-list-item-main'>
                <div className='comment-list-item-content'>
                    {content}
                </div>
            </div>
        </div>
    )
}
