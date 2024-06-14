import React from "react";
import './style.css'
import { FavoriteListDTO } from "types/interface";
import defaultProfileImage from 'assets/image/default-profile-image.png'
import {USER_PATH} from "../../constant";
import {useNavigate} from "react-router-dom";

interface Props{
    favoriteListItem : FavoriteListDTO
}


// Component : FavoriteListItem  컴포넌트
export default function FavoriteItem({favoriteListItem}:Props){
    //properties
    const{profileImage, nickname} = favoriteListItem;
    const navigate = useNavigate();
    const onNicknameClickHandler = () => {
        navigate(USER_PATH(nickname))
    }
// render : FavoriteListItem 렌더링
    return(
        <div className='favorite-list-item'>
            <div className='favorite-list-item-profile-box'>
                <div className='favorite-list-item-profile-image' style={{backgroundImage: `url(${profileImage? profileImage : defaultProfileImage})`}}></div>
            </div>
            <div className='favorite-list-item-nickname' >{nickname}</div>
        </div>
    )
}