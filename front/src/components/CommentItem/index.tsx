import React from "react";
import './style.css';
import { CommentListDTO } from "types/interface";
import defatultProfileImage from 'assets/image/default-profile-image.png'

import dayjs from "dayjs";

interface Props{
    commentListItem: CommentListDTO;
}

//   component : Comment List Item 컴포넌트

export default function CommentItem({commentListItem}:Props){

//  state : properties
const{nickname, profileImage, writeDatetime,content} = commentListItem;
// function : 작성일 경과 시간 함수
const getElapsedTime = () => {
    const now = dayjs().add(0, 'hour');
    const writeTime = dayjs(writeDatetime);
    const gap = now.diff(writeDatetime, 's');

    if(gap < 60) return `${gap}초 전`; // 1분 미만
    if(gap < 3600) return `${Math.floor(gap / 60)}분 전` //1시간 미만
    if(gap < 86400) return `${Math.floor(gap / 3600)}시간 전` // 하루 미만
    
    return `${Math.floor(gap / 86400)}일 전`;
}

//  render : Comment List Item 렌더링
    return(
        <div className='comment-list-item'>
            <div className='comment-list-item-top'>
                <div className='comment-list-item-profile-box'>
                    <div className='comment-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : defatultProfileImage})`}}></div>
                </div>
                <div className='comment-list-item-nickname'>{nickname}</div>
                <div className='comment-list-item-divider'>{`\|`}</div>
                <div className='comment-list-item-time'>{getElapsedTime()}</div>
            </div>
            <div className='comment-list-item-main'>
                <div className='comment-list-item-content'>
                    {content}
                </div>
            </div>
        </div>
    )
}