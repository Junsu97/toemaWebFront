import React, { useState, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react';
import InputBox from 'components/inputBox';
import './style.css';
import { SignInRequestDto } from 'apis/reqeust/auth';
import { SignUpRequest, SignInRequest } from 'apis';
import { SignInResponseDto } from 'apis/response/auth';
import { ResponseDto } from 'apis/response';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MAIN_PATH, NOT_FOUND_PATH } from 'constant';
//  component : 인증화면 컴포넌트
export default function Authentication() {

  // state : 화면상태
  // const [view, setView] = useState<'index' | 'sign-in' | 'sign-up'>('index');
  const [view, setView] = useState<'index' | 'sign-in' | 'sign-up'>('sign-in');

  // state : 쿠키 상태
  const [cookies, setCookie] = useCookies();


  // component : sign in card 컴포넌트
  const SignInCard = () => {
    //state : 유저 아이디 요소 참조 상태
    const userIdRef = useRef<HTMLInputElement | null>(null);
    //state : 패스워드 요소 참조 상태
    const passwordRef = useRef<HTMLInputElement | null>(null);

    // state : 아이디 상태
    const [userId, setUserId] = useState<string>('');
    // state : 패스워드 상태
    const [password, setPassword] = useState<string>('');
    // state : 패스워드 타입 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    // state : 패스워드 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon')
    // state : 에러상태
    const [error, setError] = useState<boolean>(false);
    // state : 유저 타입 상태
    const [userType, setUserType] = useState('Student');
    let navigate = useNavigate();


    // function : sign in response 처리 함수
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {

        // 페이지가 렌더링될 때 원하는 URL로 이동합니다.
        navigate(NOT_FOUND_PATH());

        return;
      }
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'SF' || code === 'VF') setError(true);
      if (code !== 'SU') return;

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      setCookie('accessToken', token, { expires, path: MAIN_PATH() });
      navigate(MAIN_PATH());
    }

    //event handler : 아이디 변경 이벤트 처리
    const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setUserId(value);
    }
    //event handler : 비밀번호 변경 이벤트 처리
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setPassword(value);
    }

    // event handler : 로그인 버튼 클릭 이벤트 처리
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = {
        userId, password, userType
      };
      SignInRequest(requestBody).then(signInResponse);
    }
    // event handler : 회원가입 링크 클릭 이벤트 처리
    const onSignUpLinkClickHandler = () => {
      setView('sign-up');
    }

    // event handler : 패스워드 버튼 클릭 이벤트 처리 함수
    const onPasswordButtonClickHandler = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      } else {
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
      }
    }

    // event handler : 유저아이디 인풋 키 다운 이벤트 처리
    const onUserIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key != 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }
    // event handler : 패스워드 인풋 키 다운 이벤트 처리
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key != 'Enter') return;
      onSignInButtonClickHandler();
    }
    // event handler : 유저 타입 변경 이벤트 처리
    const onUserTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
      setUserType(event.target.value);
    }


    // render : sign in 컴포넌트 렌더링
    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'로그인'}</div>
            </div>
            <InputBox ref={userIdRef} label='아이디' type='text' placeholder='아이디를 입력해주세요.' error={error} value={userId} onChange={onUserIdChangeHandler} onKeyDown={onUserIdKeyDownHandler} />
            <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} />
            <div className='auth-user-type'>
              <label>
                <input type="radio" value={'Student'} checked={userType === 'Student'} onChange={onUserTypeChange} />
                <span>학생</span>
              </label>
              <label>
                <input type="radio" value={'Teacher'} checked={userType === 'Teacher'} onChange={onUserTypeChange} />
                <span>선생님</span>
              </label>
            </div>
          </div>
          <div className='auth-card-bottom'>
            {error &&
              <div className='auth-sign-in-error-box'>
                <div className='auth-sign-in-error-message'>
                  {'아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}
                </div>
              </div>
            }
            <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
            <div className='auth-description-box'>
              <div className='auth-description'>
                {'신규 사용자이신가요?'}
                <span className='auth-description-link' onClick={onSignUpLinkClickHandler}>{'회원가입'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  // component : sign up card 컴포넌트
  const SignUpCard = () => {
    // render : sign up 컴포넌트 렌더링
    return (
      <div className='auth-card'></div>
    )
  };

  // component : sign up card 컴포넌트
  const IndexCard = () => {
    // render : Index 컴포넌트 렌더링
    return (
      <div className='index-card'></div>
    )
  };

  // render : 인증 화면 컴포넌트 렌더링
  return (
    <div id='auth-wrapper'>
      <div className='auth-container'>
        <div className='auth-jumbotron-box'>
          <div className='auth-jumbotron-content'>
            <div className='auth-logo-icon'></div>
            <div className='auth-jumbotron-text-box'>
              <div className='auth-jumbotron-text'>{'환영합니다.'}</div>
              <div className='auth-jumbotron-text'>{'과외해듀오와 공부해봐요.'}</div>
            </div>
          </div>
        </div>
        {view === "index" && <IndexCard />}
        {view === "sign-in" && <SignInCard />}
        {view === "sign-up" && <SignUpCard />}
      </div>
    </div>
  )
}
