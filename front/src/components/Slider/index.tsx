// SliderBanner.tsx

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate} from "react-router-dom";


// 배너 이미지를 위한 인터페이스 정의
interface BannerImage {
    id: number;
    src: string;
    alt: string;
}

// 컴포넌트의 props 인터페이스 정의
interface SliderBannerProps {
    images: BannerImage[];
}

const SliderBanner: React.FC<SliderBannerProps> = ({ images }) => {
    const navigate = useNavigate();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };


    return (
        <div>
            <Slider {...settings}>
                {images.map((image) => (
                    <div key={image.id}>
                        <img  src={image.src} alt={image.alt} style={{ width: '100%', maxWidth:'1650px',height: '240px' }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderBanner;
