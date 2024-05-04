import React, { useState, KeyboardEvent, useRef, ChangeEvent, useEffect, FormEvent } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AUTH_PATH, FIND_ID } from 'constant';
import { useNavigate } from 'react-router-dom';
import { postPasswordRequest, postUserIdRequest } from 'apis';
import { PostUserIdResponseDTO } from 'apis/response/user';
import { PostPasswordRequestDTO, PostUserIdRequestDTO } from 'apis/reqeust/user';
import { ResponseDto } from 'apis/response';
import PostPasswordResponseDTO from 'apis/response/user/post-password.response.dto';


// component :비밀번호 찾기 화면 컴포넌트
export default function FindPassword() {
    const defaultTheme = createTheme();
    // state : 유저 타입 상태
    const [userType, setUserType] = useState('STUDENT');
    // state : 유저 이름 상태
    const [userName, setUserName] = useState<string>('');
    // state : 이메일 상태
    const [email, setEmail] = useState<string>();
    const [userId, setUserId] = useState<string>('');

    const form = useRef<HTMLFormElement>(null);
    // event handler : 유저타입 변경 이벤트 처리
    const onUserTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserType(event.target.value);
    }

    // function : 네비게이트 함수
    const navigate = useNavigate();

    // function : post passwrod response 처리함수
    const postPasswordResponse = (responseBody: PostPasswordResponseDTO | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NU') alert('존재하지 않는 유저입니다.');
        if (code !== 'SU') return;

        alert('회원님의 임시 비밀번호를 이메일로 전송하였습니다.');
    }

    // event handler : 로그인하기 클릭 이벤트 처리 함수
    const onFindIdClickHandler = () => {
        navigate(FIND_ID());
    }

    // event handler : 아이디 찾기 버튼 클릭 이벤트 처리 함수
    const onFindPasswordButtonClickHandler = () => {
        if (!email || !userName || !userId) {
            alert('모든 항목을 기입해주세요');
            return;
        }

        const requestBody: PostPasswordRequestDTO = {
            userId,
            userName,
            userType,
            email
        };

        postPasswordRequest(requestBody).then(postPasswordResponse);

    }

    //event handler : ID 변경 이벤트 처리
    const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserId(value);
    }
    // event handler : 유저 이름 변경 이벤트 처리
    const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserName(value);
    }
    // event handler : email 변경 이벤트 처리
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
    }
    // render : 아이디 찾기 화면 렌더링
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
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
                        비밀번호 찾기
                    </Typography>
                    <Box component="div" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="userName"
                                    required
                                    fullWidth
                                    id="userName"
                                    label="회원 이름"
                                    autoFocus
                                    onChange={onUserNameChangeHandler}
                                    value={userName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="userId"
                                    label="회원 ID"
                                    name="userId"
                                    autoComplete="family-name"
                                    onChange={onUserIdChangeHandler}
                                    value={userId}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일을 입력해주세요"
                                    name="email"
                                    autoComplete="email"
                                    onChange={onEmailChangeHandler}
                                    value={email}
                                />
                            </Grid>
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
                            onClick={onFindPasswordButtonClickHandler}
                        >
                            {'비밀번호 찾기'}
                        </Button>
                        <div className='auth-user-type'>
                            <label>
                                <input type="radio" value={'STUDENT'} checked={userType === 'STUDENT'} onChange={onUserTypeChange} />
                                <span>학생</span>
                            </label>
                            <label>
                                <input type="radio" value={'TEACHER'} checked={userType === 'TEACHER'} onChange={onUserTypeChange} />
                                <span>선생님</span>
                            </label>
                        </div>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link variant="body2" sx={{ fontSize: '14px', fontFamily: 'GimhaeGaya', cursor: 'pointer' }}>
                                    <span onClick={onFindIdClickHandler}>
                                        {'아이디 찾기'}
                                    </span>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}