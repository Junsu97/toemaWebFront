import './style.css';
import {getTeacherRequest} from "../../../apis";
import {useNavigate, useParams} from "react-router-dom";
import {AUTH_PATH, TEACHER_APPLY, TEACHER_LIST} from "../../../constant";
import {GetTeacherResponseDTO} from "../../../apis/response/teacher";
import {ResponseDto} from "../../../apis/response";
import {useEffect, useState} from "react";
import loginUserStore from "../../../stores/login-user.store";
import {useCookies} from "react-cookie";
import defautltProfileImage from "../../../assets/image/default-profile-image.png";

export default function TeacherInfo() {
    const {teacherUserId} = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage]= useState<string|null>(null);
    const [school, setSchol] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const {loginUser} = loginUserStore();
    const [cookies, setCookies] = useCookies();
    const getTeacherResponse = (responseBody: GetTeacherResponseDTO | ResponseDto | null) => {
        if(!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            navigate(TEACHER_LIST());
            return;
        }
        const {code} = responseBody;
        if (code === 'NU') {
            alert('존재하지 않는 유저입니다.');
            navigate(TEACHER_LIST());
            return;
        }
        if(code === 'DBE'){
            alert('데이터베이스 오류입니다.');
            navigate(TEACHER_LIST());
            return;
        }
        if(code !== 'SU'){
            alert('잘못된 요청입니다.\n다시 시도해주세요.');
            navigate(TEACHER_LIST());
            return;
        }

        const {userId, nickname, profileImage, school,
        korean, math, social, science, english, desc} = responseBody as GetTeacherResponseDTO;
        setUserId(userId);
        setNickname(nickname);
        setProfileImage(profileImage);
        setSchol(school);
        setDesc(desc);
    }
    useEffect(() => {
        if(!loginUser || !cookies.accessToken){
            alert('비정상적인 접근입니다.');
            navigate(AUTH_PATH());
            return;
        }
        if(!teacherUserId){
            alert('비정상적인 접근입니다.');
            navigate(TEACHER_LIST());
            return;
        }
        getTeacherRequest(teacherUserId).then(getTeacherResponse);
    }, [teacherUserId]);
    const onClickHandler = () => {
        if(!loginUser || !cookies.accessToken){
            alert('로그인 후 이용해주시길 바랍니다.');
            navigate(AUTH_PATH());
            return;
        }
        navigate(TEACHER_APPLY(userId));
    }
    return (
        <div id='wrapper'>
            <div className="side_wrapper">
                <section className="about-dev">
                    <header className="profile-card_header">
                        <div className="profile-card_header-container">
                            <div className="profile-card_header-imgbox">
                                <img src={profileImage ? profileImage : defautltProfileImage} alt="Mewy Pawpins"/>
                            </div>
                            <h1>{nickname}<span>{school}</span></h1>
                        </div>
                    </header>
                    <div className="profile-card_about">
                        <h2>Introduce</h2>
                        <p>{desc}</p>
                        <footer className="profile-card_footer">
                            <div className="social-row">
                                <div className="heart-icon" title="No Health Issues">
                                    {/* SVG content here */}
                                </div>
                                <div className="paw-icon" title="Gets Along Well With Other Animals">
                                    {/* SVG content here */}
                                </div>
                            </div>
                            <p onClick={onClickHandler}><a className="back-to-profile">신청하기</a></p>
                        </footer>
                    </div>
                </section>
            </div>
        </div>
    )
}