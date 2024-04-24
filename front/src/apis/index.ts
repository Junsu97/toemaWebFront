import axios from 'axios';
import { SignInRequestDto, SignUpRequestDTO } from './reqeust/auth';
import { SignInResponseDto, SignUpResponseDTO } from './response/auth';
import { ResponseDto } from './response';
import { GetSignInUserResponseDTO } from './response/user';
import { PostBoardRequestDTO, PostCommentRequestDTO } from './reqeust/board';
import { PostboardResponseDTO, GetBoardResponseDTO, IncreaseViewCountResponseDTO, GetFavoriteListResponseDTO, GetCommentListResponseDTO, PutFavoriteResponseDTO, PostCommentResponseDTO, DeleteBoardResponseDTO } from './response/board';

const DOMAIN = 'http://localhost:10000';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
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
const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board/write`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;
const PUT_FAVORITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`

export const getBoardRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardNumber))
        .then(response => {
            const responseBody: GetBoardResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.reponse.data;
            return responseBody;
        })
    return result;
}

export const increaseViewCountRequest = async (boardNumber: number | string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getFavoriteListReqeust = async (boardNumber: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardNumber))
        .then(response => {
            const reqeustBody: GetFavoriteListResponseDTO = response.data;
            return reqeustBody;
        })
        .catch(error => {
            if (!error.reponse) return null;
            const reqeustBody: ResponseDto = error.reponse.data;
            return reqeustBody;
        })
    return result;
}
export const getCommentListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
        .then(response => {
            const reqeustBody: GetCommentListResponseDTO = response.data;
            return reqeustBody;
        })
        .catch(error => {
            if (!error.reponse) return null;
            const reqeustBody: ResponseDto = error.reponse.data;
            return reqeustBody;
        })
    return result;
}

export const postBoardRequest = async (reqeustBody: PostBoardRequestDTO, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), reqeustBody, authorization(accessToken))
        .then(response => {
            console.log(reqeustBody);
            const responseBody: PostboardResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postCommentRequest = async (boardNumber: number | string, reqeustBody: PostCommentRequestDTO, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardNumber), reqeustBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCommentResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const putFavoriteRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardNumber), {}, authorization(accessToken))
        .then(response => {
            const responseBody: PutFavoriteResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardNumber), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

const GET_SIGN_IN_USER = () => `${API_DOMAIN}/user`;
export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = { headers: { 'Content-Type': 'multipart/form-data' } }
export const fileUploadRequest = async (data: FormData) => {
    console.log("이미지 파일 : " + data);
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
}
