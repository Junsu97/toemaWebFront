import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useLoginUserStore } from "stores";
import React, { useState, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { USER_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import { ResponseDto } from 'apis/response';
import './style.css';
import { patchPasswordRequest, postCheckPasswordRequest } from "apis";
import { PatchPasswordResponseDTO, PostCheckPasswordResponseDTO } from "apis/response/user";
import PatchPasswordRequestDTO from "apis/reqeust/user/patch-password-request.dto";
import { PostCheckPasswordRequestDTO } from "apis/reqeust/user";

const defaultTheme = createTheme();

// component : 비밀번호 변경 컴포넌트
export default function ChangePassword() {
    // state : 화면상태
    const [view, setView] = useState<'auth' | 'unAuth'>('unAuth');
    // state : login user 상태
    const { loginUser } = useLoginUserStore();
    const { userId } = useParams();
    const [cookies, setCookies] = useCookies();
    // state : 인증 상태
    const [isCheckedPassword, setIsCheckedPassword] = useState<boolean>(false);
    // state : 

    // effect : user Id path variable 변경시 실행 할 함수
    useEffect(() => {
        if (!userId || !loginUser || !cookies.accessToken || loginUser.userId !== userId) setView('unAuth');
        if (userId === loginUser?.userId) setView('auth');
    })
    // component : 비밀번호 확인 컴포넌트
    const CheckPassword = () => {
        // state : password 상태
        const [password, setPassword] = useState<string>('');
        // state : password ref 상태
        const passwordInputRef = useRef<HTMLInputElement | null>(null);

        // function : post check password response 처리 함수
        const postCheckPasswordResponse = (responseBody: PostCheckPasswordResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'AF') {
                alert('비밀번호가 옳바르지 않습니다.');
                setPassword('');
                passwordInputRef.current?.focus();
            }
            if (code === 'VF') alert('비밀번호를 입력해주세요.');
            if (code !== 'SU') return;
            alert('인증되었습니다.');
            setIsCheckedPassword(true);
        }

        // event handler : 비밀번호 변경 이벤트 처리
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setPassword(value);
        }
        // event handler : 비밀번호 확인 버튼 클릭 이벤트 처리
        const onPasswordCheckButtonClickHandler = () => {
            if (!loginUser || !cookies.accessToken || loginUser.userId !== userId) {
                setView('unAuth');
                return;
            }
            const requestBody: PostCheckPasswordRequestDTO = {
                password: password,
                userType: loginUser.userType
            }
            postCheckPasswordRequest(requestBody, cookies.accessToken).then(postCheckPasswordResponse);
        }

        // render : 비밀번호 확인 컴포넌트 렌더링
        return (
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs" sx={{ minWidth: '600px' }}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'black' }}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            비밀번호 확인
                        </Typography>
                        <Box component="div" sx={{ mt: 3, width: '450px' }}>
                            <Grid item xs={12}>
                                <TextField
                                    type="password"
                                    required
                                    fullWidth
                                    id="password"
                                    label="비밀번호 확인"
                                    name="password"
                                    autoComplete="password"
                                    value={password}
                                    ref={passwordInputRef}
                                    onChange={onPasswordChangeHandler}
                                />
                            </Grid>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3, mb: 2, backgroundColor: 'black', '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                    }
                                }}
                                onClick={onPasswordCheckButtonClickHandler}
                            >
                                {'비밀번호 확인'}
                            </Button>
                        </Box>
                    </Box>
                </Container>

            </ThemeProvider>
        )
    }

    // component : 인증된 사용자 화면 컴포넌트
    const Auth = () => {
        // state : 새로운 비밀번호 상태
        const [newPassword, setNewPassword] = useState<string>('');
        const [passwordCheck, setPasswordCheck] = useState<string>('');

        // function : 네비게이트 함수
        const navigate = useNavigate();

        // function : patch password response 처리 함수
        const patchPasswordResponse = (responseBody: PatchPasswordResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'NU') alert('회원정보가 잘못되었습니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'VF') alert('모든 항목을 기입해주세요.');
            if (code !== 'SU') return;
            if (!loginUser) return;
            alert('비밀번호가 변경되었습니다.');

            navigate(USER_PATH(loginUser?.userId));
        }

        // event handler : 새 비밀번호 입력 변경 이벤트 처리
        const onNewPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setNewPassword(value);
        }
        const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setPasswordCheck(value);
        }
        // event handler : 비밀번호 변경 버튼 클릭 이벤트 처리 함수
        const onChangePasswordButtonClickHandler = () => {
            let isMatched = newPassword === passwordCheck;
            if (!isMatched) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            }
            if (!userId || !loginUser || !cookies.accessToken || loginUser.userId !== userId) {
                setView('unAuth');
                return;
            }
            const requestBody: PatchPasswordRequestDTO = {
                newPassword: newPassword,
                userType: loginUser?.userType
            };
            patchPasswordRequest(requestBody, cookies.accessToken).then(patchPasswordResponse);
        }
        // render : 인증된 사용자 화면 컴포넌트 렌더링
        return (
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs" sx={{ minWidth: '600px' }}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'black' }}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            비밀번호 변경
                        </Typography>
                        <Box component="div" sx={{ mt: 3, width: '450px' }}>
                            <Grid item xs={12}>
                                <TextField
                                    type="password"
                                    required
                                    fullWidth
                                    id="password"
                                    label="새로운 비밀번호"
                                    name="password"
                                    autoComplete="password"
                                    onChange={onNewPasswordChangeHandler}
                                    value={newPassword}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <TextField
                                    type="password"
                                    required
                                    fullWidth
                                    id="checkPasswrod"
                                    label="비밀번호 확인"
                                    name="checkPasswrod"
                                    autoComplete="checkPasswrod"
                                    onChange={onPasswordCheckChangeHandler}
                                    value={passwordCheck}
                                />
                            </Grid>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3, mb: 2, backgroundColor: 'black', '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                    }
                                }}
                                onClick={onChangePasswordButtonClickHandler}
                            >
                                {'비밀번호 변경'}
                            </Button>
                        </Box>
                    </Box>
                </Container>

            </ThemeProvider>
        )
    }
    // component : 비정상 접근자 화면 컴포넌트
    const UnAuth = () => {
        // render : 비정상 접근자 화면 컴포넌트 렌더링
        return (
            <div style={{ height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', width: '100%' }}>
                <div style={{ fontFamily: 'GimhaeGaya', width: '500px' }}>
                    <h1>비정상적인 접근입니다.</h1>
                </div>
            </div>
        )
    }
    return (
        <>
            {isCheckedPassword &&
                <>
                    {view === "auth" && <Auth />}
                    {view === "unAuth" && <UnAuth />}
                </>
            }

            {!isCheckedPassword &&
                <CheckPassword />
            }
            {!isCheckedPassword && view === "unAuth" && <UnAuth />}
        </>
    )
}