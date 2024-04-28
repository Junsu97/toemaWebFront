import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { useLoginUserStore } from 'stores';
import { User } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useParams } from 'react-router-dom';

// component : 유저 화면 컴포넌트
export default function UserPage() {
  // state : 마이페이지 여부 상태
  const [isMyPage, setMyPage] = useState<boolean>(true);
  const { userId } = useParams();
  const { loginUser } = useLoginUserStore();
  // component : 유저 화면 상단 컴포넌트
  const UserTop = () => {
    // state : 이미지 파일 인풋 참조 상태
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    // state : 닉네임  상태
    const [nickname, setNickname] = useState<string>('');
    // state : 변경 닉네임 상태
    const [changeNickname, setChangeNickname] = useState<string>('');
    // state : 프로필 이미지 상태
    const [profileImage, setProfileImage] = useState<string | null>(null);
    // state : 닉네임 변경 여부 상태
    const [isNicknameChane, setNicknameChange] = useState<boolean>(false);
    // effect : userId  path variable 변경시 실행 할 함수
    useEffect(() => {
      if (!userId) return;
      setNickname('임시닉이당');
      setProfileImage('data:image/jpeg;base64,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');
    }, [userId])
    // render : 유저 화면 상단 컴포넌트 렌더링
    return (
      <div id='user-top-wrapper'>
        <div className='user-top-container'>
          {isMyPage ?
            <div className='user-top-my-profile-image-box'>
              {profileImage !== null ?
                <div className='user-top-profile-image' style={{ backgroundImage: `url(${profileImage})` }}></div>
                :

                <div className='icon-box-large'>
                  <div className='icon image-box-white-icon'></div>
                </div>

              }

              <input ref={imageInputRef} type="file" accept='image/*' style={{ display: 'none' }} />
            </div> :
            <div className='user-top-profile-image-box' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
          }

          <div className='user-top-info-box'>
            <div className='user-top-info-nickname-box'>
              {isMyPage ?
                <>
                  {isNicknameChane ?
                    <input type="text" className='user-top-info-nickname-input' size={changeNickname.length + 1} value={changeNickname} />
                    :
                    <div className='user-top-info-nickname'>{nickname}</div>
                  }

                  <div className='icon-button'>
                    <div className='icon edit-icon'></div>
                  </div>
                </>
                :
                <div className='user-top-info-nickname'>{nickname}</div>
              }
            </div>
            <div className='user-top-info-userid'>{userId}</div>
          </div>
        </div>
      </div>
    );
  };

  // component : 유저 화면 하단 컴포넌트
  const UserBottom = () => {
    // render : 유저 화면 하단 컴포넌트 렌더링
    return (
      <div></div>
    );
  };
  // render : 유저 화면 컴포넌트 렌더링
  return (
    <div>
      <UserTop />
      <UserBottom />
    </div>
  )
}
