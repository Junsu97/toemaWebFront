import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import {styled} from '@mui/system';
import {Button,  TextareaAutosize} from '@mui/material';
import {useLoginUserStore} from 'stores';
import {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import InputBox from 'components/inputBox';
import {Address, useDaumPostcodePopup} from 'react-daum-postcode';
import {PatchUserResponseDTO, PostMailResponseDTO} from 'apis/response/user';
import {useNavigate, useParams} from 'react-router-dom';
import {AUTH_PATH, MAIN_PATH, USER_PATH} from 'constant';
import {getTeacherSubjectRequest, patchUserRequest, postMailReceiveRequest, postMailSendRequest} from 'apis';
import {PatchUserRequestDTO, PostMailReceiveRequestDTO, PostMailSendRequestDTO} from 'apis/reqeust/user';
import {ResponseDto} from 'apis/response';
import { Timer} from '@mui/icons-material';
import {useCookies} from 'react-cookie';
import TimerComponent from 'components/Timer';
import {GetTeacherSubjectResponseDto} from "../../apis/response/user";

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function UserInfoUpdatePage() {
    // state : 로그인 유저 상태
    const {loginUser} = useLoginUserStore();
    //state : user id path variable 상태
    const {userId} = useParams();
    // function : 네비게이트
    const navigate = useNavigate();
    const Page = () => {

        // state: 주소 요소 참조상태
        const addrRef = useRef<HTMLInputElement | null>(null);
        // state : 상세주소 요소 참조상태
        const addrDetailRef = useRef<HTMLInputElement | null>(null);
        // state : 주소 에러 상태
        const [isAddrError, setAddrError] = useState<boolean>(false);
        // state : 메일 인증하기 버튼 클릭 상태
        const [isClick, setClick] = useState<boolean>(false);
        // state : 쿠키 상태
        const [cookie, setCookie] = useCookies();

        // state : 주소 상태
        const [addr, setAddr] = useState<string>('');
        // state : 인증 번호 상태
        const [authNumber, setAuthNumber] = useState<string>('');
        // state : 상세주소 상태
        const [addrDetail, setAddrDetail] = useState<string>('');

        // state : 학교 상태
        const [school, setSchool] = useState<string>('');
        // state : 연락처 상태
        const [telNumber, setTelNumber] = useState<string>('');

        // state : 과목 체크 상태
        const [korean, setKorean] = useState<boolean>(false);
        const [math, setMath] = useState<boolean>(false);
        const [social, setSocial] = useState<boolean>(false);
        const [science, setScience] = useState<boolean>(false);
        const [english, setEnglish] = useState<boolean>(false);
        const [desc, setDesc] = useState<string>('');
        // state : desc 요소 참조상태
        const descRef = useRef<HTMLTextAreaElement | null>(null);


        // state : 주소 에러 메시지 상태
        const [addrErrorMessage, setAddrErrorMessage] = useState<string>('');
        // state : 학교 인증 여부 상태
        const [isSchoolAuth, setSchoolAuth] = useState<boolean>(false);

        // state : 타이머 상태
        const [startTimer, setStartTimer] = useState(false);
        const [resetTimer, setResetTimer] = useState(false);

        const getTeacherSubjectResponse = (responseBody: GetTeacherSubjectResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;

            if (code === 'DBE' || code === 'NU' || code !== 'SU') {
                return null;
            }
            const {korean, math, science, social, english, desc} = responseBody as GetTeacherSubjectResponseDto;
            setKorean(korean);
            setMath(math);
            setSocial(social);
            setScience(science);
            setEnglish(english);
            setDesc(desc);
        }
        // effect : user pathvaliable  변경시 실행될 함수
        useEffect(() => {
            if (!userId) {
                navigate(MAIN_PATH());
                return;
            }
            ;
            if (!loginUser) {
                navigate(AUTH_PATH());
                return;
            }
            if (!cookie.accessToken) {
                alert('토큰 유효기간이 만료되었습니다.');
                navigate(AUTH_PATH());
                return;
            }
            if (userId !== loginUser?.userId) {
                alert('비정상적인 접근입니다.');
                navigate(AUTH_PATH());
                return;
            }

            if (loginUser.emailAuth === null) return;
            setSchoolAuth(loginUser.emailAuth);
            setAddr(loginUser.addr);

            if (loginUser.addrDetail)
                setAddrDetail(loginUser.addrDetail);

            if (loginUser.telNumber)
                setTelNumber(loginUser.telNumber);

            if (loginUser.school)
                setSchool(loginUser.school);
            if (loginUser.userType === 'TEACHER') {
                getTeacherSubjectRequest(cookie.accessToken).then(getTeacherSubjectResponse);
            }

        }, [userId])

        // function :  다음 주소 검색 팝업 오픈 함수
        const open = useDaumPostcodePopup();

        // function : post mail receive response 처리
        const postMailReceiveResponse = (responseBody: PostMailResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'AF') alert('인증번호가 옳바르지 않습니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'NU') alert('인증 오류입니다.');
            if (code !== 'SU') {
                alert('오류가 발생했습니다.');
                return;
            }
            if (!loginUser) return;

            alert('인증되었습니다.');
            return;
        }

        // function : post mail send response 처리
        const postMailSendResponse = (responseBody: PostMailResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') {
                alert('오류가 발생했습니다.');
                return;
            }
            alert('인증 메일이 발송되었습니다.')
            return;
        }
        // function : patch user response 처리
        const patchUserResponse = (responseBody: PatchUserResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') {
                alert('오류가 발생했습니다.');
                return;
            }
            if (!userId) return;
            alert('수정되었습니다.');
            navigate(USER_PATH(userId));
            return;
        }

        // event handler : 주소 이벤트 처리
        const onAddrChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddr(value);
            setAddrError(false);
            setAddrErrorMessage('')
        }
        // event handler : 상세 주소 이벤트 처리
        const onAddrDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddrDetail(value);
        }

        // event handler : 과목 체크 이벤트 처리
        const onSubjectCheckBoxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            switch (event.target.name) {
                case 'korean':
                    setKorean(event.target.checked);
                    break;
                case 'math':
                    setMath(event.target.checked);
                    break;
                case 'social':
                    setSocial(event.target.checked);
                    break;
                case 'science':
                    setScience(event.target.checked);
                    break;
                case 'english':
                    setEnglish(event.target.checked);
                    break;
                default:
                    break;
            }
        }
        // event handler : desc 이벤트 처리
        const onDescChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
            const {value} = event.target;
            setDesc(value);
        }
        // event handler : 학교 이벤트 처리
        const onSchoolChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setSchool(value);
        }
        // event handler : 다음 주소 검색 완료 이벤트 처리
        const onComplete = (data: Address) => {
            const {address} = data;
            setAddr(address);
        }
        // event handler : 주소 버튼 클릭 이벤트 처리
        const onAddressButtonClickHandler = () => {
            open({onComplete});
        }
        // event handler : 주소 키입력 이벤트 처리
        const onAddrKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') return;
        }

        // event handler : 인증 번호 입력 이벤트 처리
        const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAuthNumber(value);
        }
        // event handler : 인증 번호 버튼 클릭 이벤트 처리
        const onMailAuthButtonClickHandler = () => {
            if (!loginUser) {
                navigate(AUTH_PATH());
                return;
            }
            if (loginUser.email === null) {
                alert('정보를 불러오는 중에 오류가 발생하였습니다.');
                navigate(MAIN_PATH());
                return;
            }
            ;
            if (isClick) {
                const requestBody: PostMailReceiveRequestDTO = {
                    email: loginUser.email,
                    code: authNumber,
                    userType: loginUser.userType
                }
                postMailReceiveRequest(requestBody).then(postMailReceiveResponse);
                setResetTimer(true);
                setClick(!isClick);
            } else {
                const requestBody: PostMailSendRequestDTO = {
                    email: loginUser.email
                }

                postMailSendRequest(requestBody).then(postMailSendResponse);
                setResetTimer(false);
                setStartTimer(true)
                setClick(!isClick);
            }

        }
        // event handler : 수정하기 버튼 클릭 이벤트 처리
        const onEditButtonClickHandelr = () => {
            if (!loginUser) {
                navigate(AUTH_PATH());
                return;
            }
            if (loginUser.userId !== userId) {
                alert('비정상적인 접근입니다.');
                navigate(MAIN_PATH());
                return;
            }

            const requestBody: PatchUserRequestDTO = {
                addr: addr,
                addrDetail: addrDetail,
                school: school,
                userType: loginUser.userType,
                korean: korean,
                math: math,
                social: social,
                science: science,
                english: english,
                desc: desc
            }
            patchUserRequest(requestBody, cookie.accessToken).then(patchUserResponse);
        }
        return (
            <div style={{
                width: '80%',
                justifyContent: 'center',
                display: 'flex',
                marginLeft: '5%',
                marginBottom: '1%',
                border: '1px solid',
                padding: '3%'
            }}>
                <Grid container spacing={3}>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="first-name" required>
                            회원 아이디
                        </FormLabel>
                        <OutlinedInput
                            id="userName"
                            name="userName"
                            type="name"
                            autoComplete="회원 아이디"
                            required
                            value={loginUser?.userId}
                            readOnly
                            sx={{backgroundColor: 'rgba(0,0,0,0.05)'}}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="first-name" required>
                            회원이름
                        </FormLabel>
                        <OutlinedInput
                            id="userName"
                            name="userName"
                            type="name"
                            autoComplete="회원 이름"
                            required
                            value={loginUser?.userName}
                            readOnly
                            sx={{backgroundColor: 'rgba(0,0,0,0.05)'}}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="last-name" required>
                            이메일
                        </FormLabel>
                        <OutlinedInput
                            id="last-name"
                            name="last-name"
                            type="last-name"
                            placeholder="Snow"
                            autoComplete="last name"
                            required
                            value={loginUser?.email}
                            readOnly
                            sx={{backgroundColor: 'rgba(0,0,0,0.05)'}}
                        />
                        {!isSchoolAuth &&
                            <>
                                < Button
                                    type="button"
                                    variant="contained"
                                    sx={{
                                        width: '300px', mt: 3, mb: 2, backgroundColor: 'black', '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                        }
                                    }}
                                    onClick={onMailAuthButtonClickHandler}
                                >
                                    {isClick ?
                                        <>
                                            {'인증번호 확인'}
                                        </>
                                        :
                                        <>
                                            {'메일 인증하기'}
                                        </>
                                    }
                                </Button>
                            </>
                        }
                    </FormGrid>
                    {loginUser?.emailAuth === false &&
                        <>
                            <FormGrid item xs={12} md={6}>
                                <FormLabel htmlFor="last-name">
                                    인증 번호
                                </FormLabel>
                                <OutlinedInput
                                    id="last-name"
                                    name="last-name"
                                    type="last-name"
                                    placeholder="메일을 확인해주세요."
                                    autoComplete="last name"
                                    required
                                    value={authNumber}
                                    onChange={onAuthNumberChangeHandler}
                                />
                            </FormGrid>
                            <Timer/><TimerComponent start={startTimer} reset={resetTimer}/>
                        </>
                    }
                    <FormGrid item xs={12}>
                        <InputBox ref={addrRef} label='주소*' type='text' placeholder='주소 검색' value={addr}
                                  onChange={onAddrChangeHandler} error={isAddrError} message={addrErrorMessage}
                                  icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler}
                                  onKeyDown={onAddrKeyDownHandler}/>
                    </FormGrid>
                    <FormGrid item xs={12}>
                        <FormLabel htmlFor="address2">상세 주소</FormLabel>
                        <OutlinedInput
                            id="address2"
                            name="address2"
                            type="address2"
                            placeholder="상세주소"
                            autoComplete="shipping address-line2"
                            required
                            value={addrDetail}
                            onChange={onAddrDetailChangeHandler}
                        />
                    </FormGrid>
                    <FormGrid item xs={6}>
                        <FormLabel htmlFor="city" required>
                            학교
                        </FormLabel>
                        <OutlinedInput
                            id="city"
                            name="city"
                            type="city"
                            placeholder="학교이름"
                            autoComplete="City"
                            required
                            value={school}
                            onChange={onSchoolChangeHandler}

                        />
                    </FormGrid>
                    <FormGrid item xs={6}>
                        <FormLabel htmlFor="state" required>
                            연락처
                        </FormLabel>
                        <OutlinedInput
                            id="state"
                            name="state"
                            type="state"
                            placeholder="연락처"
                            autoComplete="State"
                            required
                            value={telNumber}
                            readOnly
                            sx={{backgroundColor: 'rgba(0,0,0,0.05)'}}
                        />
                    </FormGrid>
                    {loginUser?.userType === 'TEACHER' &&
                        <>
                            <div style={{
                                width: '100%',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <div style={{ alignItems: 'center', justifyContent: 'space-evenly', width: '50%' }}>
                                    <FormControlLabel control={<Checkbox checked={korean} name={'korean'}
                                                                         onChange={onSubjectCheckBoxChangeHandler} />}
                                                      label={'국어'}
                                                      sx={{ width: '130px', minWidth: '130px', maxWidth: '130px' }} />
                                    <FormControlLabel control={<Checkbox checked={math} name={'math'}
                                                                         onChange={onSubjectCheckBoxChangeHandler} />}
                                                      label={'수학'}
                                                      sx={{ width: '130px', minWidth: '130px', maxWidth: '130px' }} />
                                    <FormControlLabel control={<Checkbox checked={social} name={'social'}
                                                                         onChange={onSubjectCheckBoxChangeHandler} />}
                                                      label={'사회'}
                                                      sx={{ width: '130px', minWidth: '130px', maxWidth: '130px' }} />
                                    <FormControlLabel control={<Checkbox checked={science} name={'science'}
                                                                         onChange={onSubjectCheckBoxChangeHandler} />}
                                                      label={'과학'}
                                                      sx={{ width: '130px', minWidth: '130px', maxWidth: '130px' }} />
                                    <FormControlLabel control={<Checkbox checked={english} name={'english'}
                                                                         onChange={onSubjectCheckBoxChangeHandler} />}
                                                      label={'영어'}
                                                      sx={{ width: '130px', minWidth: '130px', maxWidth: '130px' }} />
                                </div>
                            </div>
                            <div style={{
                                width: '100%',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <div style={{ alignItems: 'center', justifyContent: 'space-evenly', width: '80%' }}>
                                    <TextareaAutosize ref={descRef} onChange={onDescChangeHandler} value={desc}
                                                      minRows={3} placeholder={'선생님의 자기소개 글을 작성해주세요.'}
                                                      style={{ width: '100%', resize: 'none' }} />
                                </div>
                            </div>
                        </>
                    }

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3, mb: 2, backgroundColor: 'black', '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                        onClick={onEditButtonClickHandelr}
                    >
                        {'회원 정보 수정'}
                    </Button>
                </Grid>
            </div>
        )
    }
    return (
        <>
            <Page/>
        </>
    )
}