import axios from 'axios';
import { SignInRequestDto, SignUpRequestDTO } from './reqeust/auth';
import { SignInResponseDto, SignUpResponseDTO } from './response/auth';
import { ResponseDto } from './response';
import { GetSignInUserResponseDTO } from './response/user';

const DOMAIN = 'http://localhost:10000';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken : string) => {
    return {headers: {Authorization: `Bearer ${accessToken}`}}
};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
    // 자바스크립트나 타입스크립트는 비동기처럼 동작하기 때문에 axios request 보내면 response가 오기전에 처리시킴
    // 그래서 awaint을 걸어서 response를 기다리겠다고 선언
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            if (!response) return null;
            console.log(requestBody);
            const responseBody: SignInResponseDto = response.data;

            return responseBody;
        }).catch(error => {
            if (!error) return null;
            if (!error.response.data) return null;

            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const signUpRequest = async (reqeustBody: SignUpRequestDTO) => {
    const result = await axios.post(SIGN_UP_URL(), reqeustBody)
        .then(response => {
            const responseBody: SignUpResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result
}

const GET_SIGN_IN_USER = () => `${API_DOMAIN}/user`;
export const getSignInUserRequest = async (accessToken : string) => {
    const result = await axios.get(GET_SIGN_IN_USER(), authorization(accessToken))
    .then(response => {
        const responseBody: GetSignInUserResponseDTO = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    });

    return result;
}