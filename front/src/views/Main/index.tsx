import React, { useEffect, useState } from 'react';
import './style.css';
import SliderBanner from "../../components/Slider";
import banner01 from '../../assets/image/001.png';
import banner02 from '../../assets/image/002.png';
import banner03 from '../../assets/image/003.png';
import weatherDescKo from "./weatherDescKo";
import axios from "axios";
import { BoardListDTO } from "../../types/interface";
import { GetTop3BoardListResponseDTO } from "../../apis/response/board";
import { ResponseDto } from "../../apis/response";
import {getApiDataListRequest, getTop3BoardListRequest, getWeatherDataRequest} from "../../apis";
import GetApiListResponseDTO from "../../apis/response/main/get-api-list-reponse.dto";
import ApiListItemInterface from "../../types/interface/api-list-item.interface";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {BOARD_DETAIL_PATH} from "../../constant";
import {useNavigate} from "react-router-dom";
import WeatherAPIResponseDTO from "../../apis/response/main/weather-api-response.dto";
import WeatherAPIDTO from "../../types/interface/weather-api-interface";

// Chart.js의 필요한 스케일을 등록합니다.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const images = [
    { id: 1, src: banner01, alt: 'Image 1' },
    { id: 2, src: banner02, alt: 'Image 2' },
    { id: 3, src: banner03, alt: 'Image 3' },
]

interface Weather {
    description: string;
    name: string;
    temp: number;
    icon: string;
    date: string;
}

const getFormattedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    };
    return date.toLocaleDateString('ko-KR', options);
};

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_KEY;

export default function Main() {
    const [top3BoardList, setTop3BoardList] = useState<BoardListDTO[]>([]);
    const [apiDataList, setDataList] = useState<ApiListItemInterface[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string>('1학년');
    const [weather, setWeather] = useState<Weather | null>(null);
    const [res, setRes] = useState<WeatherAPIDTO|null>(null);
    const navigate = useNavigate();
    const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('주간 Top3 게시글을 불러오는데 실패했습니다.');
            return;
        }
        const { code } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code !== 'SU') {

            return;
        }
        const { top3List } = responseBody as GetTop3BoardListResponseDTO;
        setTop3BoardList(top3List);
    }

    const getApiDataListResponse = (responseBody: GetApiListResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('사교육 참여율 데이터를 불러오는데 실패했습니다.');
            return;
        }
        const { code } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code === 'VF'){
            alert('사교육 참여율 데이터를 불러오는데 실패하였습니다.');
        }
        if (code !== 'SU') {

            return;
        }
        const { result } = responseBody as GetApiListResponseDTO;
        setDataList(result.data);
    }

    const top3ListClickHandler = (boardNumber : string|number) =>{
        navigate(BOARD_DETAIL_PATH(boardNumber));
    }

    const getWeather =  () => {
        try {
            if(res == null) {
                alert("null");
                return;
            }
            const weatherId = res.id;
            const weatherKo = weatherDescKo[weatherId];
            const weatherIcon = res.weather[0].icon;
            const weatherIconAdrs = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            const temp = Math.round(res.main.temp);
            const cityName = res.name;
            console.log(weatherIcon);
            setWeather({
                description: weatherKo,
                name: cityName,
                temp: temp,
                icon: weatherIconAdrs,
                date: getFormattedDate(new Date()),
            });
            console.log(weather?.icon);

        } catch (err) {
            console.error(err);
        }
    }
    const getWeatherDataResponse = (responseBody: WeatherAPIResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('날씨 데이터를 불러오는데 실패했습니다.');
            return;
        }
        const { code } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code === 'VF'){
            alert('날씨 데이터를 불러오는데 실패하였습니다.');
        }
        if (code !== 'SU') {
            return;
        }

        const {result} = responseBody as WeatherAPIResponseDTO;
        setRes(result);


    }
    useEffect(() => {
        if(res != null)
            getWeather();
    }, [res]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(lat, lon);
            getWeatherDataRequest(lat, lon).then(getWeatherDataResponse);
        });

        getTop3BoardListRequest().then(getTop3BoardListResponse);
        getApiDataListRequest(selectedGrade).then(getApiDataListResponse);
    }, []);

    useEffect(() => {
        getApiDataListRequest(selectedGrade).then(getApiDataListResponse);
    }, [selectedGrade]);

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGrade(e.target.value);
    };


    const filteredData = apiDataList ? apiDataList.filter(item => item.grade === selectedGrade) : [];

    const chartData = {
        labels: filteredData.map(item => item.sido),
        datasets: [
            {
                label: '사교육 참여도',
                data: filteredData.map(item => parseFloat(item.participationRate.toString())),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };
    return (
        <div className="main-container">
            <div className="banner-container">
                <SliderBanner images={images} />
            </div>
            <div className={'weather-container'}>
                <div className="weather-card">
                    {weather ? (
                        <div>
                            <div className="date">{weather.date}</div>
                            <div className="location">{weather.name}</div>
                            <img src={weather.icon} alt={weather.description} />
                            <div className="temp">{weather.temp}°</div>
                            <div className="description">{weather.description}</div>
                        </div>
                    ) : (
                        <p>날씨 정보를 불러오는 중...</p>
                    )}
                </div>
                <div className="sihyun">
                    <div className="sihyun-header">주간 Top3 게시글</div>
                    {top3BoardList.map((board) => (
                        <div key={board.boardNumber} className="board-card" onClick={() => top3ListClickHandler(board.boardNumber)}>
                            <div className="title">{board.title}</div>
                            <div className="content">{board.content}</div>
                            <div className="meta">
                                <div>작성자: {board.writerNickname}</div>
                                <div>조회수: {board.viewCount} | 좋아요: {board.favoriteCount} | 댓글: {board.commentCount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chart-container">
                <div className="chart-header">
                    <label htmlFor="grade-select">Select Grade: </label>
                    <select id="grade-select" value={selectedGrade} onChange={handleGradeChange}>
                        <option value="1학년">1학년</option>
                        <option value="2학년">2학년</option>
                        <option value="3학년">3학년</option>
                    </select>
                </div>
                <div style={{ width: '100%', height: '308px' }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}
