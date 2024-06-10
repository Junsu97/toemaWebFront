import axios from 'axios';
import {SignInRequestDto, SignUpRequestDTO} from './reqeust/auth';
import {SignInResponseDto, SignUpResponseDTO} from './response/auth';
import {ResponseDto} from './response';
import {
    GetSignInUserResponseDTO,
    GetTeacherSubjectResponseDto,
    GetUserResponseDTO,
    PatchNicknameResponseDTO,
    PatchProfileImageResponseDTO,
    PatchUserResponseDTO,
    PostCheckPasswordResponseDTO,
    PostMailResponseDTO,
    PostUserIdResponseDTO
} from './response/user';
import {
    PatchBoardRequestDTO,
    PatchCommentRequestDTO,
    PostBoardRequestDTO,
    PostCommentRequestDTO
} from './reqeust/board';
import {
    PostboardResponseDTO,
    GetBoardResponseDTO,
    IncreaseViewCountResponseDTO,
    GetFavoriteListResponseDTO,
    GetCommentListResponseDTO,
    PutFavoriteResponseDTO,
    PostCommentResponseDTO,
    DeleteBoardResponseDTO,
    PatchBoardResponseDTO,
    GetLatesttBoardListResponseDTO,
    GetTop3BoardListResponseDTO,
    GetSearchBoardListResonseDTO,
    GetUserBoardListResponseDTO, PatchCommentResponseDTO, DeleteCommentResponseDTO
} from './response/board';
import {GetPopularListResponseDTO, GetRelationListResponseDTO} from './response/search';
import {
    PostUserIdRequestDTO,
    PatchNicknameRequestDTO,
    PatchProfileImageRequestDTO,
    PostPasswordRequestDTO,
    PostCheckPasswordRequestDTO,
    PostMailSendRequestDTO,
    PostMailReceiveRequestDTO,
    PatchUserRequestDTO
} from './reqeust/user';
import PostPasswordResponseDTO from './response/user/post-password.response.dto';
import PatchPasswordRequestDTO from './reqeust/user/patch-password-request.dto';
import PatchPasswordResponseDTO from './response/user/patch-password.response.dto';
import {PostFaceIdRequestDTO, PostFaceIdSignInRequestDTO} from './reqeust/FaceID';
import {PostFaceIdResponseDTO, PostFaceIdSignInResponseDto} from './response/faceId';
import {
    GetApplyBeforeResponseDTO, GetApplyInfoResponseDTO, GetMatchedStudentListResponseDto,
    GetTeacherListResponseDTO,
    GetTeacherResponseDTO, PatchApplyResponseDTO,
    PostApplyTeacherResponseDTO
} from "./response/teacher";
import {PatchApplyRequestDTO, PostApplyTeacherRequestDTO} from "./reqeust/teacher";
import PostApplyListRequestDto from "./reqeust/teacher/post-apply-list-request.dto";
import PostApplyListResponseDto from "./response/teacher/post-apply-list-response.dto";
import {GetHomeworkListResponseDto, HomeAnotherResponseDTO} from "./response/homework";
import {PostPatchHomeworkRequestDto} from "./reqeust/homework";
import PostTutoringRequestDTO from "./reqeust/tutoring/post-tutoring-request.dto";
import PatchTutoringRequestDTO from "./reqeust/tutoring/patch-tutoring-request.dto";
import {GetTutoringListResponseDTO, TutoringAnotherResponseDTO} from "./response/tutoring";

const DOMAIN = 'http://localhost:11000';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return {headers: {Authorization: `Bearer ${accessToken}`}}
};

const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/${searchWord}/relation-list`;
export const getPopularListRequestDTO = async () => {
    const result = await axios.get(GET_POPULAR_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result
}

export const getRelationListRequest = async (searchWord: string) => {
    const result = await axios.get(GET_RELATION_LIST_URL(searchWord))
        .then(response => {
            const responseBody: GetRelationListResponseDTO = response.data;
            console.log("dsfasd" + responseBody.relativeWordList);
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result
}

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
    console.log("회원가입 요청");
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
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => {
    if (preSearchWord) {
        return `${API_DOMAIN}/board/search-list/${searchWord}/${preSearchWord}`;
    } else {
        return `${API_DOMAIN}/board/search-list/${searchWord}`;
    }
};

const GET_TEACHER_LIST_URL = (...subjects: (string | null)[]) => {
    const validSubjects = subjects.filter(subject => subject !== null); // null이 아닌 항목들만 필터링
    // 유효한 항목들이 없을 경우 기본 경로 반환
    if (validSubjects.length === 0) {
        return `${API_DOMAIN}/teacher/list`;
    }
    const path = validSubjects.join('/'); // 유효한 항목들을 '/'로 연결
    return `${API_DOMAIN}/teacher/list/${path}`; // 최종 URL 구성
}

const GET_MATCHED_STUDENT_LIST_URL = () => `${API_DOMAIN}/teacher/getStudentList`;

const GET_USER_BOARD_LIST_URL = (userId: string) => `${API_DOMAIN}/board/user-board-list/${userId}`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const PATCH_COMMENT_URL = () => `${API_DOMAIN}/board/comment`;
const DELETE_COMMENT_URL = (boardNumber: number | string, commentNumber: number | string) => `${API_DOMAIN}/board/comment/${boardNumber}/${commentNumber}`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board/write`;
const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;
const PUT_FAVORITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`

export const getMatchedStudentListRequest = async (accessToken: string) => {
    const result = await axios.get(GET_MATCHED_STUDENT_LIST_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetMatchedStudentListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getTeacherListRequest = async (sub1: string | null, sub2: string | null, sub3: string | null, sub4: string | null, sub5: string | null) => {
    const result = await axios.get(GET_TEACHER_LIST_URL(sub1, sub2, sub3, sub4, sub5))
        .then(response => {
            const responseBody: GetTeacherListResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
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

export const getLatestBoardListRequest = async () => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetLatesttBoardListResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.reponse.data;
            return responseBody;
        })
    return result;
}

export const getTop3BoardListRequest = async () => {
    const result = await axios.get(GET_TOP_3_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetTop3BoardListResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.reponse.data;
            return responseBody;
        })
    return result;
}

export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        .then(response => {
            const responseBody: GetSearchBoardListResonseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getUserBoardListRequest = async (userId: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(userId))
        .then(response => {
            const responseBody: GetUserBoardListResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
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
            console.error("An error occurred:", error);
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

export const patchCommentRequest = async (requestBody: PatchCommentRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_COMMENT_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchCommentResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.reponse) return null;
            const reqeustBody: ResponseDto = error.reponse.data;
            return reqeustBody;
        })
    return result;
}

export const deleteCommentRequest = async (boardNumber: number | string, commentNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_COMMENT_URL(boardNumber, commentNumber), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteCommentResponseDTO = response.data;
            return responseBody;
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

export const patchBoardRequest = async (boardNumber: number | string, reqeustBody: PatchBoardRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNumber), reqeustBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
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
const GET_TEACHER_SUBJECT_URL = () => `${API_DOMAIN}/user/subject`;
const GET_APPLY_BEFORE_URL = () => `${API_DOMAIN}/teacher/apply`;
const GET_APPLY_INFO_URL = (teacherId: string, studentId: string) => `${API_DOMAIN}/teacher/${teacherId}/${studentId}`;
const POST_APPLY_LIST_URL = () => `${API_DOMAIN}/teacher/apply-list`;
const GET_USER_URL = (userId: string) => `${API_DOMAIN}/user/${userId}`;
const GET_TEACHER_URL = (teacherUserId: string) => `${API_DOMAIN}/teacher/${teacherUserId}`;
const POST_USER_ID_URL = () => `${API_DOMAIN}/user/find-id`;
const POST_PASSWORD_URL = () => `${API_DOMAIN}/user/password`;
const POST_CHECK_PASSWORD_URL = () => `${API_DOMAIN}/user/check-password`;
const POST_MAIL_SEND_URL = () => `${API_DOMAIN}/user/send-mail`;
const POST_MAIL_RECEIVE_URL = () => `${API_DOMAIN}/user/receive-mail`;
const POST_APPLY_TEACHER_URL = () => `${API_DOMAIN}/teacher/apply`;
const PATCH_APPLY_URL = () => `${API_DOMAIN}/teacher/apply`;

const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_USER_URL = () => `${API_DOMAIN}/user/edit-user`;
const PATCH_PASSWORD_URL = () => `${API_DOMAIN}/user/password`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;
export const getUserRequest = async (userId: string) => {
    const result = await axios.get(GET_USER_URL(userId))
        .then(response => {
            const responseBody: GetUserResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const getApplyInfoRequest = async (teacherId: string, studentId: string) => {
    const result = await axios.get(GET_APPLY_INFO_URL(teacherId, studentId))
        .then(response => {
            const responseBody: GetApplyInfoResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const patchApplyRequest = async (requestBody: PatchApplyRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_APPLY_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchApplyResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;

}

export const getTeacherRequest = async (teacherUserId: string) => {
    const result = await axios.get(GET_TEACHER_URL(teacherUserId))
        .then(response => {
            const responseBody: GetTeacherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const getApplyBeforeRequest = async (accessToken: string) => {
    const result = await axios.get(GET_APPLY_BEFORE_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetApplyBeforeResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postApplyListRequest = async (requestBody: PostApplyListRequestDto) => {
    const result = await axios.post(POST_APPLY_LIST_URL(), requestBody)
        .then(response => {
            const responseBody: PostApplyListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getTeacherSubjectRequest = async (accessToken: string) => {
    const result = await axios.get(GET_TEACHER_SUBJECT_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetTeacherSubjectResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const postApplyTeacherRequest = async (requestBody: PostApplyTeacherRequestDTO, accessToken: string) => {
    const result = await axios.post(POST_APPLY_TEACHER_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostApplyTeacherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const postMailSendRequest = async (requestBody: PostMailSendRequestDTO) => {
    const result = await axios.post(POST_MAIL_SEND_URL(), requestBody)
        .then(response => {
            const responseBody: PostMailResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const postMailReceiveRequest = async (requestBody: PostMailReceiveRequestDTO) => {
    const result = await axios.post(POST_MAIL_RECEIVE_URL(), requestBody)
        .then(response => {
            const responseBody: PostMailResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postPasswordRequest = async (requestBody: PostPasswordRequestDTO) => {
    const result = await axios.post(POST_PASSWORD_URL(), requestBody)
        .then(response => {
            const responseBody: PostPasswordResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postCheckPasswordRequest = async (requestBody: PostCheckPasswordRequestDTO, accessToken: string) => {
    const result = await axios.post(POST_CHECK_PASSWORD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCheckPasswordResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postUserIdRequest = async (requestBody: PostUserIdRequestDTO) => {
    const result = await axios.post(POST_USER_ID_URL(), requestBody)
        .then(response => {
            const responseBody: PostUserIdResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

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

export const patchNicknameRequest = async (requestBody: PatchNicknameRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchNicknameResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const patchUserRequest = async (requestBody: PatchUserRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_USER_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchUserResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_PASSWORD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchPasswordResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const patchProfileImageRequest = async (requestBody: PatchProfileImageRequestDTO, accessToken: string) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchProfileImageResponseDTO = response.data;
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
const multipartFormData = {headers: {'Content-Type': 'multipart/form-data'}}
export const fileUploadRequest = async (data: FormData) => {
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

const POST_FACE_ID_URL = () => `${API_DOMAIN}/auth/face-id`;
const POST_FACE_ID_SIGN_IN_URL = () => `${API_DOMAIN}/auth/face-sign-in`;
export const postFaceIdRequest = async (requestBody: PostFaceIdRequestDTO) => {
    const result = await axios.post(POST_FACE_ID_URL(), requestBody)
        .then(response => {
            const responseBody: PostFaceIdResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    console.log("API요청 : ", requestBody);
    return result;
}

export const postFaceIdSignRequest = async (requestBody: PostFaceIdSignInRequestDTO) => {
    const result = await axios.post(POST_FACE_ID_SIGN_IN_URL(), requestBody)
        .then(response => {
            if (!response) return null;
            console.log(requestBody);
            const responseBody: PostFaceIdSignInResponseDto = response.data;

            return responseBody;
        }).catch(error => {
            if (!error) return null;
            if (!error.response.data) return null;

            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_HOMEWORK_URL = () => ``;
const GET_HOMEWORK_LIST_URL = (teacherUserId: string, studentUserId: string) => `${API_DOMAIN}/homework/from-teacher/${teacherUserId}/${studentUserId}/list`;
const GET_STUDENT_HOMEWORK_LIST_URL = (studentUserId: string) => `${API_DOMAIN}/homework/from-student/${studentUserId}/list`;
const POST_HOMEWORK_URL = () => `${API_DOMAIN}/homework/write`;
const PATCH_HOMEWORK_URL = (seq: number | string) => `${API_DOMAIN}/homework/update/${seq}`;
const DELETE_HOMEWORK_URL = (seq: number | string) => `${API_DOMAIN}/homework/delete/${seq}`;
const GET_HOMEWORK_STUDENT_LIST_URL = (studentUserId: string) => `${API_DOMAIN}/homework/from-student/${studentUserId}/list`;


const GET_TUTORING_LIST_FROM_STUDENT_URL = (studentUserId: string) => `${API_DOMAIN}/tutoring/from-student/${studentUserId}/list`;
const GET_TUTORING_LIST_FROM_TEACHER_URL = (teacherUserId: string, studentUserId: string) => `${API_DOMAIN}/tutoring/from-teacher/${teacherUserId}/${studentUserId}/list`;
const POST_TUTORING_URL = () => `${API_DOMAIN}/tutoring/write`;
const PATCH_TUTORING_URL = (seq: number | string) => `${API_DOMAIN}/tutoring/update/${seq}`;
const DELETE_TUTORING_URL = (seq: number | string) => `${API_DOMAIN}/tutoring/delete/${seq}`;

export const getHomeworkListRequest = async (teacherUserId: string, studentUserId: string) => {
    const result = await axios.get(GET_HOMEWORK_LIST_URL(teacherUserId, studentUserId))
        .then(response => {
            const responseBody: GetHomeworkListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getHomeworkListStudentRequest = async (studentUserId: string) => {
    const result = await axios.get(GET_HOMEWORK_STUDENT_LIST_URL(studentUserId))
        .then(response => {
            const responseBody: GetHomeworkListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postHomeworkRequest = async (requestBody: PostPatchHomeworkRequestDto, accessToken: string) => {
    const result = await axios.post(POST_HOMEWORK_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: HomeAnotherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchHomeworkRequest = async (requestBody: PostPatchHomeworkRequestDto, seq: number | string, accessToken: string) => {
    const result = await axios.patch(PATCH_HOMEWORK_URL(seq), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: HomeAnotherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const deleteHomeworkRequest = async (seq: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_HOMEWORK_URL(seq), authorization(accessToken))
        .then(response => {
            const responseBody: HomeAnotherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

export const getTutoringListFromTeacherRequest = async (teacherUserId: string, studentUserId: string) => {
    const result = await axios.get(GET_TUTORING_LIST_FROM_TEACHER_URL(teacherUserId, studentUserId))
        .then(response => {
            const responseBody: GetTutoringListResponseDTO = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getTutoringListFromStudentRequest = async (studentUserId: string) => {
    const result = await axios.get(GET_TUTORING_LIST_FROM_STUDENT_URL(studentUserId))
        .then(response => {
            const responseBody: GetTutoringListResponseDTO = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const postTutoringRequest = async (requestBody: PostTutoringRequestDTO, accessToken: string) => {
    const result = await axios.post(POST_TUTORING_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: TutoringAnotherResponseDTO = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const patchTutoringRequest = async (requestBody: PatchTutoringRequestDTO, seq: number | string, accessToken: string) => {
    const result = await axios.patch(PATCH_TUTORING_URL(seq), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: TutoringAnotherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const deleteTutoringRequest = async (seq: number | string, accessToken : string) => {
    const result = await axios.delete(DELETE_TUTORING_URL(seq), authorization(accessToken))
        .then(response => {
            const responseBody: TutoringAnotherResponseDTO = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    return result;

}