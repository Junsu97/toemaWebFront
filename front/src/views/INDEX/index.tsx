import React from 'react';
import './style.css';
import landingImage from 'assets/image/landing.jpg';
import Header from 'layouts/Header';
import Footer from 'layouts/Footer';
import { useNavigate } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH } from 'constant';

export default function IndexPage() {
    const navigate = useNavigate();

    const onStartButtonClick = () => {
        navigate(MAIN_PATH());
    }
    return (
        <div className="landing-page" >
            <main >
                <div className='container'>
                    <div>
                        <h1 style={{ marginTop: '5%', marginLeft: '3%', fontFamily: 'GimhaeGaya' }}>과외해듀오</h1>

                        <img className='landimg'  src={landingImage} alt="Sample Image" /> {/* import한 이미지를 사용합니다. */}
                    </div>
                    <div className='desc-container'>
                
                    </div>
                    <div className='start-button' onClick={onStartButtonClick}>시작하기</div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
