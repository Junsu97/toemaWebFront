import React, { useEffect } from "react";
import './style.css'
import defatultProfileImage from 'assets/image/default-profile-image.png'
import { BoardListDTO } from "types/interface";
import { useNavigate } from "react-router-dom";
import { BOARD_DETAIL_PATH } from "constant";

interface Props{
    top3ListItem:  BoardListDTO
}

//         component: Top3 List Item 컴포넌트
export default function Top3Item({top3ListItem}:Props){

    // properties
    const {boardNumber, title, content, boardTitleImage} = top3ListItem;
    const {favoriteCount, commentCount, viewCount} = top3ListItem;
    const {writeDatetime, writerNickname, writerProfileImage} = top3ListItem;

    //  function : 네비게이트 함수
    const navigator = useNavigate();

    // event Handler : 아이템 클릭 이벤트 처리
    const onClickHandler = () => {
        navigator(BOARD_DETAIL_PATH(boardNumber));
    }
    

    // render : Top3 List Item
    return(
        <div className='top-3-list-item' style={{backgroundImage: `url(${boardTitleImage})`}} onClick={onClickHandler}>
            <div className='top-3-list-item-main-box'>
                <div className='top-3-list-item-top'>
                    <div className='top-3-list-item-profile-box'>
                        <div className="top-3-item-profile-image" style={{backgroundImage: `url(${writerProfileImage ? writerProfileImage : defatultProfileImage})`}}></div>
                    </div>
                    <div className='top-3-list-item-write-box'>
                        <div className='top-3-item-nickname'>{writerNickname}</div>
                        <div className='top-3-item-write-date'>{writeDatetime}</div>
                    </div>
                </div>
                <div className='top-3-list-item-middle'>
                    <div className='top-3-list-item-title'>{title}</div>
                    <div className='top-3-list-item-content'>{content}</div>
                </div>
                <div className='top-3-list-item-bottom'>
                    <div className='top-3-list-item-count'>{`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}</div>
                </div>
            </div>
        </div>
    )
}