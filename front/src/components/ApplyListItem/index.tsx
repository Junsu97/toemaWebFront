import React, {useEffect, useState} from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import {AUTH_PATH, BOARD_DETAIL_PATH, TEACHER_APPLY_DETAIL} from 'constant';
import loginUserStore from "../../stores/login-user.store";
import ApplyListItemInterface from "../../types/interface/apply-list-item.interface";
import {useCookies} from "react-cookie";



interface Props{
    applyListItem : ApplyListItemInterface
}
//  Component: Board List Item 컴포넌트     //
const maxLength = 15;

export default function ApplyListItem({applyListItem} : Props) {

    // properties
    const{userId, status, desc, writeDatetime} = applyListItem;
    const shortenedDesc = desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
    //  function : 네비게이트 함수
    const navigator = useNavigate();
    const{loginUser} = loginUserStore();
    const [cookies, setCookies] = useCookies();
    const [state, setState] = useState<string>('');

    // event Handler : 아이템 클릭 이벤트 처리
    const onClickHandler = () => {
        if(!loginUser){
            return;
        }
        if(!cookies.accessToken){
            alert('로그인후 다시 시도해주세요.');
            navigator(AUTH_PATH());
            return;
        }
        if(loginUser.userType==='TEACHER'){
            navigator(TEACHER_APPLY_DETAIL(loginUser.userId,userId));
        }else{
            navigator(TEACHER_APPLY_DETAIL(userId,loginUser.userId));
        }

    }


//  render: Board List Item 컴포넌트 렌더링
    return (
        <div className='board-list-item' onClick={onClickHandler}>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-top'>
                    <div className='boadr-list-item-writer-box'>
                        <div className='board-list-item-write-datetime'>{userId}</div>
                        <div className='board-list-nickname'>{writeDatetime}</div>

                    </div>
                </div>
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>{shortenedDesc}</div>
                    <div className='board-list-item-content'>{status}</div>

                </div>
            </div>
        </div>
    )
}
