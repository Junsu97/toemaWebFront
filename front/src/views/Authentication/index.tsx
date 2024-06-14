import React, {useState, KeyboardEvent, useRef, ChangeEvent, useEffect} from 'react';
import InputBox from 'components/inputBox';
import './style.css';
import {SignInRequestDto, SignUpRequestDTO} from 'apis/reqeust/auth';
import {signUpRequest, signInRequest, postFaceIdRequest, postFaceIdSignRequest} from 'apis';
import {SignInResponseDto, SignUpResponseDTO} from 'apis/response/auth';
import {ResponseDto} from 'apis/response';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {AUTH_PATH, CHANGE_PASSWORD, FIND_ID, FIND_PASSWROD, MAIN_PATH, NOT_FOUND_PATH, USER_PATH} from 'constant';
import * as faceapi from 'face-api.js';
import {Address, useDaumPostcodePopup} from 'react-daum-postcode';
import {PostFaceIdSignInRequestDTO} from "../../apis/reqeust/FaceID";
import {PostFaceIdResponseDTO, PostFaceIdSignInResponseDto} from "../../apis/response/faceId";
import ReactModal from "react-modal";
import Modal from "../../components/Modal";


interface DetectionWithExpression extends faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>> {
}

//  component : 인증화면 컴포넌트
export default function Authentication() {
    // state : 화면상태
    // const [view, setView] = useState<'index' | 'sign-in' | 'sign-up'>('index');
    const [view, setView] = useState<'index' | 'sign-in' | 'sign-up'>('index');

    // state : 쿠키 상태
    const [cookies, setCookie] = useCookies();
    // effect : 로그인 되어있는 사용자 처리
    useEffect(() => {
        if (cookies.accessToken) {
            navigate(MAIN_PATH());
        }
    }, [cookies])
    // state : 유저 타입 상태
    const [userType, setUserType] = useState('STUDENT');
    let navigate = useNavigate();
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
        // modal 팝업 상태
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const videoRef = useRef<HTMLVideoElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [accumulatedDetections, setAccumulatedDetections] = useState<DetectionWithExpression[]>([]);
        const [modalOpen, setModalOpen] = useState<boolean>(false);
        const [startDetect, setStartDetect] = useState<boolean>(false);
        const streamRef = useRef<MediaStream | null>(null);
        const intervalIdRef = useRef<number | null>(null);
        const totalModal = () => setModalOpen(!modalOpen);

        interface LandmarkPosition {
            x: number;
            y: number;
        }


        const postFaceIdResponse = (responseBody: PostFaceIdSignInResponseDto | ResponseDto | null) => {
            stopVideoAndDetection();
            if (!responseBody) {
                alert('서버에 문제가 발생했습니다.');
                stopVideoAndDetection();
                return;
            }
            const {code} = responseBody;
            if (code === 'DBE') {
                stopVideoAndDetection();
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code === 'SF') {
                stopVideoAndDetection();
                alert('FaceID 등록이 되지 않은 회원입니다.');
                return;
            }
            if (code !== 'SU') {
                stopVideoAndDetection();
                alert('오류가 발생했습니다.');
                return;
            }

            const {token, expirationTime} = responseBody as PostFaceIdSignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);

            setCookie('accessToken', token, {expires, path: AUTH_PATH()});
            console.log(cookies);
            navigate(MAIN_PATH());
            return;
        }

        useEffect(() => {
            let timeoutId: NodeJS.Timeout;

            if (accumulatedDetections.length > 0 && accumulatedDetections.length < 5) {
                timeoutId = setTimeout(() => {
                    alert("얼굴 인식 정확도가 낮습니다. 얼굴 인식을 다시 시작해주세요.");
                    setAccumulatedDetections([]);
                    detectFace();

                }, 1000);
            } else if (accumulatedDetections.length >= 5) {
                // 정확도, 표정, 랜드마크의 평균을 계산합니다.
                const averageAccuracy = accumulatedDetections.reduce((acc, detection) => acc + detection.detection.score, 0) / accumulatedDetections.length;

                // 랜드마크 위치의 평균을 계산합니다.
                const numLandmarks = accumulatedDetections[0].landmarks.positions.length;
                const averageLandmarks = {
                    positions: Array(numLandmarks).fill(0).map((_, index) => {
                        return accumulatedDetections.reduce((acc, detection) => {
                            acc.x += detection.landmarks.positions[index].x / accumulatedDetections.length;
                            acc.y += detection.landmarks.positions[index].y / accumulatedDetections.length;
                            return acc;
                        }, {x: 0, y: 0});
                    })
                };

                // 평균값을 사용하여 requestBody를 생성합니다.
                const requestBody: PostFaceIdSignInRequestDTO = {
                    accuracy: averageAccuracy,
                    landMarks: averageLandmarks,
                    userType: userType
                };
                alert('수집완료');

                console.log(requestBody);
                // 이제 requestBody를 API 요청에 사용할 수 있습니다.
                postFaceIdSignRequest(requestBody).then(postFaceIdResponse);

                setAccumulatedDetections([]);
            }

            return () => clearTimeout(timeoutId);
        }, [accumulatedDetections]);


        // function : sign in response 처리 함수
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                alert('네트워크 서버에 문제가 발생하였습니다.');
                // 페이지가 렌더링될 때 원하는 URL로 이동합니다.
                navigate(NOT_FOUND_PATH());

                return;
            }
            const {code} = responseBody;
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code === 'SF' || code === 'VF') {
                setError(true);
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                return;
            }
            if (code !== 'SU') {
                alert('오류가 발생했습니다.');
                return;
            }

            const {token, expirationTime} = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);

            setCookie('accessToken', token, {expires, path: AUTH_PATH()});
            stopVideoAndDetection();
            console.log(cookies);
            navigate(MAIN_PATH());
        }
        useEffect(() => {
            const startVideo = async () => {
                try {
                    let stream: MediaStream | null = null;

                    await Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                        faceapi.nets.faceExpressionNet.loadFromUri('/models')
                    ]);
                    stream = await navigator.mediaDevices.getUserMedia({video: {}});
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    } else {
                        alert('비디오 혹은 카메라에 이상이 있습니다.');
                        return;
                    }
                    videoRef.current.onloadedmetadata = () => {
                        if (canvasRef.current && videoRef.current) {
                            canvasRef.current.width = videoRef.current.width;
                            canvasRef.current.height = videoRef.current.height;
                        }
                        // Assuming detectFace is defined somewhere
                        detectFace();
                    };
                } catch (e) {
                    console.error(e);
                }
            };
            console.log(startDetect);
            if (startDetect) {
                startVideo();
            } else {
                stopVideoAndDetection();
            }
        }, [startDetect]);

        const changeDetectState = () => {
            setStartDetect(true);
        }

        const detectFace = async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const displaySize = {width: videoRef.current.width, height: videoRef.current.height};
            faceapi.matchDimensions(canvasRef.current, displaySize);
            intervalIdRef.current = setInterval(async () => {
                if (!videoRef.current || !canvasRef.current) return;

                // 캔버스 초기화
                // 캔버스 초기화
                if (canvasRef) {
                    canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);


                    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceExpressions();
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    const highAccuracyNeutralExpressions = resizedDetections.filter(detection =>
                        detection.detection.score >= 0.9 && detection.expressions.neutral > 0.8) as DetectionWithExpression[];

                    if (highAccuracyNeutralExpressions.length > 0) {
                        setAccumulatedDetections(prevDetections => [...prevDetections, ...highAccuracyNeutralExpressions]);
                    }

                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
                }
            }, 100) as unknown as number;
        };

        const stopVideoAndDetection = () => {
            setStartDetect(false);
            // 비디오 스트리밍 종료
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                });
                streamRef.current = null;
            }

            // 얼굴 인식 타이머 종료
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }

            // 비디오와 캔버스 초기화
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            if (canvasRef.current) {
                canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }

            setModalOpen(false);
            setStartDetect(false);
            // 검출된 얼굴 데이터 초기화
            setAccumulatedDetections([]);
        };


        //event handler : 아이디 변경 이벤트 처리
        const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = event.target;
            setUserId(value);
        }
        //event handler : 비밀번호 변경 이벤트 처리
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = event.target;
            setPassword(value);
        }

        // event handler : 로그인 버튼 클릭 이벤트 처리
        const onSignInButtonClickHandler = () => {
            const requestBody: SignInRequestDto = {
                userId, password, userType
            };
            signInRequest(requestBody).then(signInResponse);
        }

        // event handler : FaceID 로그인 버튼 클릭 이벤트 처리
        const onFaceIdSignInButtonClickHandler = () => {
            totalModal();
            setIsModalOpen(true);
        };

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

        // event handler : 아이디 찾기 버튼 클릭 이벤트 처리
        const onFindIdClickHandler = () => {
            navigate(FIND_ID());
        }

        // event handler : 비밀번호 찾기 버튼 클릭 이벤트 처리
        const onChangePasswordClickHandler = () => {
            navigate(FIND_PASSWROD());
        }


        // render : sign in 컴포넌트 렌더링
        return (
            <div className='auth-card'>

                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'로그인'}</div>
                        </div>
                        <InputBox ref={userIdRef} label='아이디' type='text' placeholder='아이디를 입력해주세요.' error={error}
                                  value={userId} onChange={onUserIdChangeHandler} onKeyDown={onUserIdKeyDownHandler}/>
                        <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요'
                                  error={error} value={password} onChange={onPasswordChangeHandler}
                                  icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler}
                                  onKeyDown={onPasswordKeyDownHandler}/>
                        <div className='auth-user-type'>
                            <label>
                                <input type="radio" value={'STUDENT'} checked={userType === 'STUDENT'}
                                       onChange={onUserTypeChange}/>
                                <span>학생</span>
                            </label>
                            <label>
                                <input type="radio" value={'TEACHER'} checked={userType === 'TEACHER'}
                                       onChange={onUserTypeChange}/>
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
                        <div className='black-large-full-button'
                             onClick={onFaceIdSignInButtonClickHandler}>{'Face ID 로그인'}</div>

                        <Modal onOpen={changeDetectState} onClose={stopVideoAndDetection} open={modalOpen}
                               videoRef={videoRef} canvasRef={canvasRef}></Modal>

                        <div className='auth-description-box'>
                            <div className='auth-description'>
                                {'신규 사용자이신가요? '}
                                <span className='auth-description-link'
                                      onClick={onSignUpLinkClickHandler}>{'회원가입'}</span>
                            </div>
                        </div>
                        <div className='auth-description-box' style={{marginTop: '1px'}}>
                            <div className='auth-description'>
                                <span className='auth-description-link'
                                      onClick={onFindIdClickHandler}>{'아이디 찾기 '}</span>{'\|'}<span
                                className='auth-description-link'
                                onClick={onChangePasswordClickHandler}>{' 비밀번호 찾기'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    // component : sign up card 컴포넌트
    const SignUpCard = () => {

        // state: 아이디 요소 참조상태
        const userIdRef = useRef<HTMLInputElement | null>(null);
        // state: 이메일 요소 참조상태
        const emailRef = useRef<HTMLInputElement | null>(null);
        // state: 패스워드 요소 참조상태
        const passwordRef = useRef<HTMLInputElement | null>(null);
        // state: 패스워드 확인 요소 참조상태
        const passwordCheckRef = useRef<HTMLInputElement | null>(null);
        // state: 닉네임 요소 참조상태
        const nicknameRef = useRef<HTMLInputElement | null>(null);
        // state: 핸드폰 번호 요소 참조상태
        const telNumberRef = useRef<HTMLInputElement | null>(null);
        // state: 주소 요소 참조상태
        const addrRef = useRef<HTMLInputElement | null>(null);
        // state: 주소 상세 요소 참조상태
        const addrDetailRef = useRef<HTMLInputElement | null>(null);
        // state: 유저 이름 요소 참조상태
        const userNameRef = useRef<HTMLInputElement | null>(null);
        // state: 학교명 요소 참조상태
        const schoolRef = useRef<HTMLInputElement | null>(null);


        // state : 페이지 번호 상태
        const [page, setPage] = useState<1 | 2 | 3>(1);
        // state : 아이디 상태
        const [userId, setUserId] = useState<string>('');
        // state : 이메일 상태
        const [email, setEmail] = useState<string>('');
        // state : 패스워드 상태
        const [password, setPassword] = useState<string>('');
        // state : 닉네임 상태
        const [nickname, setNickname] = useState<string>('');
        // state : 핸드폰번호 상태
        const [telNumber, setTelNumber] = useState<string>('');
        // state : 주소 상태
        const [addr, setAddr] = useState<string>('');
        // state : 주소 상세 상태
        const [addrDetail, setAddrDetail] = useState<string>('');
        // state : 이름 상태
        const [userName, setUserName] = useState<string>('');
        // state : 학교명 상태
        const [school, setSchool] = useState<string>('');
        // state: 개인 정보 동의 상태
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);


        // state : 패스워드 확인 상태
        const [passwordCheck, setPasswordCheck] = useState<string>('');
        // state : 패스워드 타입 상태
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        // state : 패스워드 타입 상태
        const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

        // state : 아이디 에러 상태
        const [isUserIdError, setUserIdError] = useState<boolean>(false);
        // state : 이메일 에러 상태
        const [isEmailError, setEmailError] = useState<boolean>(false);
        // state : 비밀번호 에러 상태
        const [isPasswordError, setPasswordError] = useState<boolean>(false);
        // state : 비밀번호 확인 에러 상태
        const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
        // state : 닉네임 에러 상태
        const [isNicknameError, setNickNameError] = useState<boolean>(false);
        // state : 핸드폰번호 에러 상태
        const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
        // state : 주소 에러 상태
        const [isAddrError, setAddrError] = useState<boolean>(false);
        // state : 이름 에러 상태
        const [isUserNameError, setUserNameError] = useState<boolean>(false);
        // state : 학교명 에러상태
        const [isSchoolError, setSchoolError] = useState<boolean>(false);
        // state: 개인정보 동의 에러상태
        const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

        // state : 아이디 에러 메시지 상태
        const [userIdErrorMessage, setUserIdErrorMessage] = useState<string>('');
        // state : 이메일 에러 메시지 상태
        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
        // state : 패스워드 에러 메시지 상태
        const [passwordErrorMessage, setpasswordErrorMessage] = useState<string>('');
        // state : 패스워드 확인 에러 메시지 상태
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
        // state : 닉네임 에러 메시지 상태
        const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
        // state : 핸드폰 번호 에러 메시지 상태
        const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
        // state : 주소 에러 메시지 상태
        const [addrErrorMessage, setAddrErrorMessage] = useState<string>('');
        // state : 학교명 에러 메시지 상태
        const [schoolErrorMessage, setSchoolErrorMessage] = useState<string>('');
        // state : 회원이름 에러 메시지 상태
        const [userNameErrorMessage, setUserNameErrorMessage] = useState<string>('');


        // state : 패스워드 버튼 아이콘 상태
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        // state : 패스워드 확인 버튼 아이콘 상태
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        // function: 다음 주소 검색 팝업 오픈 함수
        const open = useDaumPostcodePopup();

        // function : sign up response 처리 함수
        const signUpResponse = (responseBody: SignUpResponseDTO | ResponseDto | null) => {
            if (!responseBody) {
                alert('네트워크 서버에 문제가 발생하였습니다.');
                navigate(NOT_FOUND_PATH());
                return;
            }

            const {code} = responseBody;
            if (code === 'DI') {
                setUserIdError(true);
                setUserIdErrorMessage('이미 존재하는 아이디 입니다.');
                setPage(1);
            }
            if (code === 'DE') {
                setUserIdError(true);
                setUserIdErrorMessage('이미 존재하는 이메일 주소입니다.');
                setPage(1)
            }
            if (code === 'DN') {
                setNickNameError(true);
                setNicknameErrorMessage('이미 존재하는 닉네임입니다.');
                setPage(2);
            }
            if (code === 'DT') {
                setTelNumberError(true);
                setTelNumberErrorMessage('이미 존재하는 핸드폰 번호입니다.');
                setPage(2);
            }
            if (code === 'VF') {
                alert('모든 값을 입력해주세요.');
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
            }

            if (code !== 'SU') {
                alert('오류가 발생했습니다.');
                return;
            }

            alert(userName + '님 ' + '회원가입 되었습니다.');
            setView('sign-in');
        }

        // event handler : 유저 타입 변경 이벤트 처리
        const onUserTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
            setUserType(event.target.value);
        }
        // event handler : 아이디 변경 이벤트 처리
        const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setUserId(value);
            setUserIdError(false);
            setUserIdErrorMessage('');
        }
        // event handler : 이메일 변경 이벤트 처리
        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setEmail(value);
            setEmailError(false);
            setEmailErrorMessage('');
        }
        // event handler : 비밀번호 변경 이벤트 처리
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setPassword(value);
            setPasswordError(false);
            setpasswordErrorMessage('');
        }

        // event handler : 비밀번호 확인 변경 이벤트 처리
        const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setPasswordCheck(value);
            setPasswordCheckError(false);
            setPasswordCheckErrorMessage('');
        }
        // event handler : 닉네임 변경 이벤트 처리
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setNickname(value);
            setNickNameError(false);
            setNicknameErrorMessage('');
        }
        // event handler : 핸드폰 번호 이벤트 처리
        const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setTelNumber(value);
            setTelNumberError(false);
            setTelNumberErrorMessage('');
        }
        // event handler : 주소 이벤트 처리
        const onAddrChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddr(value);
            setAddrError(false);
            setAddrErrorMessage('')
        }
        // event handler : 상세주소 이벤트 처리
        const onAddrDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddrDetail(value);
        }
        // event handler : 이름 이벤트 처리
        const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setUserName(value);
            setUserNameError(false);
            setUserNameErrorMessage('');
        }
        // event handler : 학교명 변경 이벤트 처리
        const onSchoolChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setSchool(value);
        }

        // event handler : 개인정보 동의 클릭 이벤트 처리
        const onAgreedPersonalClickHandler = () => {
            setAgreedPersonal(!agreedPersonal);
            setAgreedPersonalError(false);
        }

        // event handler : 패스워드 버튼 클릭 이벤트 처리
        const onPasswordButtonClickHandler = () => {
            if (passwordButtonIcon === 'eye-light-off-icon') {
                setPasswordButtonIcon('eye-light-on-icon');
                setPasswordType('text');
            } else {
                setPasswordButtonIcon('eye-light-off-icon');
                setPasswordType('password');
            }
        }
        // event handler : 패스워드 확인 버튼 클릭 이벤트 처리
        const onPasswordCheckButtonClickHandler = () => {
            if (passwordCheckButtonIcon === 'eye-light-off-icon') {
                setPasswordCheckButtonIcon('eye-light-on-icon');
                setPasswordCheckType('text');
            } else {
                setPasswordCheckButtonIcon('eye-light-off-icon');
                setPasswordCheckType('password');
            }
        }
        // event handler : 주소 버튼 클릭 이벤트 처리
        const onAddressButtonClickHandler = () => {
            open({onComplete});
        }


        // event handler : 다음 단계 버튼 클릭 이벤트 처리
        const onNextClickHandler = () => {

            const userIdPattern = /^[a-z0-9]+$/;
            const isUserIdPattern = userIdPattern.test(userId);
            const isUserIdLengthValid = userId.length >= 6 && userId.length <= 12;

            const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
            const isEmailPattern = emailPattern.test(email);
            if (!isUserIdPattern || !isUserIdLengthValid) {
                setUserIdError(true);
                setUserIdErrorMessage('아이디 형식이 잘못 되었습니다.\n아이디는 영어 소문자 + 숫자 조합의 6~12글자입니다.');
                setPage(1);
            }
            if (!isEmailPattern) {
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포멧이 맞지 않습니다.');
                setPage(1);
            }
            const isPasswordPattern = password.length >= 8;
            if (!isPasswordPattern) {
                setPasswordError(true);
                setpasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
                setPage(1);
            }

            const isEqualPassword = password == passwordCheck;
            if (!isEqualPassword) {
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
                setPage(1);
            }

            const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,10}$/;
            const isNicknamePattern = nicknamePattern.test(nickname);
            if (!isNicknamePattern) {
                setNickNameError(true);
                setNicknameErrorMessage('닉네임을 입력해주세요.');
                setPage(1);
            }
            const telNumberPattern = /^01([0|1|6|7|8|9]?)?([0-9]{3,4})?([0-9]{4})$/;
            const isTelNumberPattern = telNumberPattern.test(telNumber);
            if (!isTelNumberPattern) {
                setTelNumberError(true);
                setTelNumberErrorMessage('숫자만 입력해주세요');
                setPage(2);
            }

            const hasAddress = addr.trim().length > 0;
            if (!hasAddress) {
                setAddrError(true);
                setAddrErrorMessage('주소를 입력해주세요.');
                setPage(2);
            }
            if (page === 1) {
                if (!isUserIdPattern || !isUserIdLengthValid || !isEmailPattern || !isPasswordPattern || !isEqualPassword) return;
            }
            if (page === 2) {
                if (!isNicknamePattern || !telNumberPattern || !hasAddress) return;
            }

            if (page < 3) {
                setPage(page + 1 as 1 | 2 | 3);
            }
        }
        // event handler : 회원가입 버튼 클릭 이벤트 처리
        const onSignUpButtonClickHandler = () => {
            const userIdPattern = /^[a-z0-9]+$/;
            const isUserIdPattern = userIdPattern.test(userId);
            const isUserIdLengthValid = userId.length >= 6 && userId.length <= 12;
            console.log("회원가입 버튼 클릭");

            const emailPattern = /^[a-zA-Z0-9._%+-]{6,13}@[a-zA-Z0-9.-]{5,13}\.[a-zA-Z]{2,}$/;
            const isEmailPattern = emailPattern.test(email);
            if (!isUserIdPattern || !isUserIdLengthValid) {
                setUserIdError(true);
                setUserIdErrorMessage('아이디 형식이 잘못 되었습니다.\n아이디는 영어 소문자 + 숫자 조합의 6~12글자입니다.');
                setPage(1);
                return;  // 함수 종료
            }
            if (!isEmailPattern) {
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포멧이 맞지 않습니다.');
                setPage(1);
                return;  // 함수 종료
            }
            const isPasswordPattern = password.length >= 8;
            if (!isPasswordPattern) {
                setPasswordError(true);
                setpasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
                setPage(1);
                return;  // 함수 종료
            }

            const isEqualPassword = password === passwordCheck;
            if (!isEqualPassword) {
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
                setPage(1);
                return;  // 함수 종료
            }

            const nicknamePattern = /^[가-힣a-zA-Z0-9]{2,10}$/;
            const isNicknamePattern = nicknamePattern.test(nickname);
            if (!isNicknamePattern) {
                setNickNameError(true);
                setNicknameErrorMessage('닉네임을 입력해주세요.');
                setPage(2);
                return;  // 함수 종료
            }
            const telNumberPattern = /^01([0|1|6|7|8|9]?)?([0-9]{3,4})?([0-9]{4})$/;
            const isTelNumberPattern = telNumberPattern.test(telNumber);
            if (!isTelNumberPattern) {
                setTelNumberError(true);
                setTelNumberErrorMessage('01로 시작하는 숫자만 10~11글자 입력해주세요.');
                setPage(2);
                return;  // 함수 종료
            }

            const hasAddress = addr.trim().length > 0;
            if (!hasAddress) {
                setAddrError(true);
                setAddrErrorMessage('주소를 입력해주세요.');
                setPage(2);
                return;  // 함수 종료
            }

            const userNamePattern = /^[가-힣]{2,6}$/;
            const isUserNamePattern = userNamePattern.test(userName);

            if (!isUserNamePattern) {
                setUserNameError(true);
                setUserNameErrorMessage('2-6글자의 한글만 입력해주세요.');
                return;  // 함수 종료
            }

            if (userType === 'TEACHER') {
                const hasSchool = school.trim().length > 0;
                if (!hasSchool) {
                    setSchoolError(true);
                    setSchoolErrorMessage('선생님 회원가입은 학교명 필수 사항입니다.');
                    return;  // 함수 종료
                }
            }

            if (!agreedPersonal) {
                setAgreedPersonalError(true);
                alert('개인정보 수집에 동의해주세요.');
                setPage(3);
                return;  // 함수 종료
            }

            const requestBody: SignUpRequestDTO = {
                userId,
                password,
                userName,
                nickname,
                telNumber,
                email,
                school,
                addr,
                addrDetail,
                userType,
                agreedPersonal
            };

            signUpRequest(requestBody).then(signUpResponse);
        }


        // event handler : 로그인 링크 클릭 이벤트 처리
        const onSignInLinkClickHandler = () => {
            setView('sign-in');
        }

        // event handler : 아이디 키 다운 이벤트 처리
        const onUserIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!passwordRef.current) return;
            passwordRef.current.focus();
        }
        // event handler : 패스워드 키 다운 이벤트 처리
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!passwordCheckRef.current) return;
            passwordCheckRef.current.focus();
        }
        // event handler : 비밀번호 확인 키 다운 이벤트 처리
        const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!emailRef.current) return;
            emailRef.current.focus();
        }
        // event handler : 이메일 키 다운 이벤트 처리
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onNextClickHandler();
        }
        // event handler : 닉네임 키 다운 이벤트 처리
        const onNicknameKyeDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!telNumberRef.current) return;
            telNumberRef.current.focus();
        }
        // event handler : 핸드폰 번호 키 다운 이벤트 처리
        const onTelNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onAddressButtonClickHandler();
        }
        // event handler : 주소 키 다운 이벤트 처리
        const onAddrKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!addrDetailRef.current) return;
            addrDetailRef.current.focus();
        }
        // event handler : 상세 주소 키 다운 이벤트 처리
        const onAddrDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onNextClickHandler();
        }
        // event handler : 이름 키 다운 이벤트 처리
        const onUserNameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!schoolRef.current) return;
            schoolRef.current.focus();
        }
        // event handler : 학교명 키 다운 이벤트 처리
        const onSchoolKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onNextClickHandler();
        }

        // event handler :  다음 주소 검색 완료 이벤트 처리
        const onComplete = (data: Address) => {
            const {address} = data;
            setAddr(address);
            if (!addrDetailRef.current) return;
            addrDetailRef.current.focus();
        }

        // render : sign up 컴포넌트 렌더링
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'회원가입'}</div>
                            <div className='auth-card-page'>{`${page}/3`}</div>
                        </div>
                        {page === 1 && (
                            <>
                                <InputBox ref={userIdRef} label='아이디*' type='text' placeholder='아이디를 입력해주세요'
                                          value={userId} onChange={onUserIdChangeHandler} error={isUserIdError}
                                          message={userIdErrorMessage} onKeyDown={onUserIdKeyDownHandler}/>
                                <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해주세요'
                                          value={password} onChange={onPasswordChangeHandler} error={isPasswordError}
                                          message={passwordErrorMessage} icon={passwordButtonIcon}
                                          onButtonClick={onPasswordButtonClickHandler}
                                          onKeyDown={onPasswordKeyDownHandler}/>
                                <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType}
                                          placeholder='비밀번호를 다시 입력해주세요' value={passwordCheck}
                                          onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError}
                                          message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon}
                                          onButtonClick={onPasswordCheckButtonClickHandler}
                                          onKeyDown={onPasswordCheckKeyDownHandler}/>
                                <InputBox ref={emailRef} label='이메일*' type='text' placeholder='이메일 주소를 입력해주세요'
                                          value={email} onChange={onEmailChangeHandler} error={isEmailError}
                                          message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}/>

                                <div className='auth-user-type'>
                                    <label>
                                        <input type="radio" value={'Student'} checked={userType === 'Student'}
                                               onChange={onUserTypeChange}/>
                                        <span>학생</span>
                                    </label>
                                    <label>
                                        <input type="radio" value={'Teacher'} checked={userType === 'Teacher'}
                                               onChange={onUserTypeChange}/>
                                        <span>선생님</span>
                                    </label>
                                </div>
                            </>
                        )}
                        {page === 2 && (
                            <>
                                <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해주세요'
                                          value={nickname} onChange={onNicknameChangeHandler} error={isNicknameError}
                                          message={nicknameErrorMessage} onKeyDown={onNicknameKyeDownHandler}/>
                                <InputBox ref={telNumberRef} label='휴대폰 번호' type='text' placeholder='핸드폰 번호를 입력해주세요'
                                          value={telNumber} onChange={onTelNumberChangeHandler} error={isTelNumberError}
                                          message={telNumberErrorMessage} onKeyDown={onTelNumberKeyDownHandler}/>
                                <InputBox ref={addrRef} label='주소*' type='text' placeholder='주소 검색' value={addr}
                                          onChange={onAddrChangeHandler} error={isAddrError} message={addrErrorMessage}
                                          icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler}
                                          onKeyDown={onAddrKeyDownHandler}/>
                                <InputBox ref={addrDetailRef} label='상세 주소' type='text' placeholder='상세 주소를 입력해주세요'
                                          value={addrDetail} onChange={onAddrDetailChangeHandler} error={false}
                                          onKeyDown={onAddrDetailKeyDownHandler}/>
                            </>
                        )}
                        {page === 3 && (
                            <>
                                <InputBox ref={userNameRef} label='이름*' type='text' placeholder='회원 이름을 입력해주세요'
                                          value={userName} onChange={onUserNameChangeHandler} error={isUserNameError}
                                          message={userNameErrorMessage} onKeyDown={onUserNameKeyDownHandler}/>
                                <InputBox ref={schoolRef} label='학교명' type='text' placeholder='선생님 회원가입의 경우 필수 기재사항입니다.'
                                          value={school} onChange={onSchoolChangeHandler} error={isSchoolError}
                                          message={schoolErrorMessage} onKeyDown={onSchoolKeyDownHandler}/>
                            </>
                        )}


                    </div>
                    <div className='auth-card-bottom'>
                        {page !== 3 && (
                            <>
                                <div className='black-large-full-button' onClick={onNextClickHandler}>{'다음 단계'}</div>
                            </>
                        )}
                        {page === 3 && (
                            <>
                                <div className='auth-consent-box'>
                                    <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                                        <div
                                            className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>

                                    </div>
                                    <div
                                        className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보동의'}</div>
                                    <div className='auth-consent-link'>{'더보기 >'}</div>
                                </div>
                                <div className='black-large-full-button'
                                     onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
                            </>
                        )}

                        <div className='auth-description-box'>
                            <div className='auth-description'>{'이미 계정이 있으신가요?'}<span className='auth-description-link'
                                                                                     onClick={onSignInLinkClickHandler}>{'로그인'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    // component : sign up card 컴포넌트
    const IndexCard = () => {
        // event handler :  시작하기 버튼 클릭 이벤트
        const onStartButtonClickHandler = () => {
            setView('sign-in');
        }

        // render : Index 컴포넌트 렌더링
        return (
            <div className='auth-card' style={{height: '340px', marginTop: '12%'}}>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'인덱스 페이지'}</div>
                        </div>
                        <div className='index-description'>
                            <p>과외해듀오에서 제공해주는 서비스를 이용하시려면</p>
                            <p>로그인이 필요합니다.</p>
                        </div>
                        <div className='auth-card-bottom'>
                            <div className='black-large-full-button' onClick={onStartButtonClickHandler}
                                 style={{marginTop: '4%'}}>{'시작하기'}</div>
                        </div>
                    </div>
                </div>
            </div>
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
                {view === "index" && <IndexCard/>}
                {view === "sign-in" && <SignInCard/>}
                {view === "sign-up" && <SignUpCard/>}
            </div>
        </div>
    )
};
