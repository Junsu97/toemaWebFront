import React from 'react';
import '../BoarListItem/style.css';
import NewsListDTO from "../../types/interface/news-list-item.interface";
import {useNavigate} from "react-router-dom";
import DefaultProfileImage from "../../assets/image/default-profile-image.png";

interface Props {
    newsListItem: NewsListDTO
}

export default function NewsListItem({newsListItem}: Props) {
    const {subject, img, url, date, writer, contents} = newsListItem;
    const navigator = useNavigate();

    const onClickHandler = () => {
        if(url){
           window.open(url, '_blank');
        }
    }

    return (
        <div className='board-list-item' onClick={onClickHandler}>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>{subject}</div>
                    <div className='board-list-item-content'>{contents}</div>

                </div>
                <div className='board-list-item-bottom'>
                    <div className='board-list-nickname'>{writer}</div>
                    <div className='board-list-item-write-datetime'>{date}</div>
                </div>
            </div>
            {img !== null && (
                <div className='board-list-item-image-box'>
                    <div className='board-list-item-image'
                         style={{backgroundImage: `url(${img})`}}></div>
                </div>
            )}

        </div>
    )
}