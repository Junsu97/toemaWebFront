import React, { useEffect } from 'react';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    let navigate = useNavigate();

    useEffect(() => {
        // 페이지가 렌더링될 때 원하는 URL로 이동합니다.
        navigate('/404');
    }, [navigate]); // 의존성 배열에 navigate를 넣어줍니다.

    const { pathname } = useLocation();
    return (
        <div id='auth-wrapper'>
            <div className='auth-container'>
                <div className='auth-jumbotron-box'>
                    <div className='auth-jumbotron-content'>
                        <div className='auth-logo-icon'></div>
                        <div className='auth-jumbotron-text-box'>
                            <div className='auth-jumbotron-text'>{'과외해듀오'}</div>
                            <div className='auth-jumbotron-text'>{'404 - 페이지가 존재하지 않습니다.'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
