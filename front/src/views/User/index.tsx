import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import Swal, {SweetAlertResult} from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {useLoginUserStore} from 'stores';
import {BoardListDTO} from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {useNavigate, useParams} from 'react-router-dom';
import BoardListItem from 'components/BoarListItem';
import {useCookies} from 'react-cookie';
import {AUTH_PATH, BOARD_WRITE_PATH, CHANGE_PASSWORD, FACE_ID, MAIN_PATH, USER_PATH, USER_UPDATE_PATH} from 'constant';
import {
    deleteUserRequest,
    fileUploadRequest,
    getUserBoardListRequest,
    getUserRequest,
    patchNicknameRequest,
    patchProfileImageRequest
} from 'apis';
import {GetUserResponseDTO, PatchNicknameResponseDTO, PatchProfileImageResponseDTO} from 'apis/response/user';
import {ResponseDto} from 'apis/response';
import {PatchNicknameRequestDTO, PatchProfileImageRequestDTO} from 'apis/reqeust/user';
import {usePagination} from 'hooks';
import {GetUserBoardListResponseDTO} from 'apis/response/board';
import Pagenation from 'components/Pagination';
import DeleteUserResponseDTO from "../../apis/response/user/delete-user-response.dto";

// component : 유저 화면 컴포넌트
export default function UserPage() {
    // state : 마이페이지 여부 상태
    const [isMyPage, setMyPage] = useState<boolean>(true);
    //state : user id path variable 상태
    const {userId} = useParams();
    const {loginUser} = useLoginUserStore();
    const [cookies, setCookies] = useCookies();
    // function : 네비게이트 함수
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    // component : 유저 화면 상단 컴포넌트
    const UserTop = () => {
        // state : 이미지 파일 인풋 참조 상태
        const imageInputRef = useRef<HTMLInputElement | null>(null);
        // state : 닉네임  상태
        const [nickname, setNickname] = useState<string>('');
        // state : 변경 닉네임 상태
        const [changeNickname, setChangeNickname] = useState<string>('');
        // state : 프로필 이미지 상태
        const [profileImage, setProfileImage] = useState<string | null>(null);
        // state : 닉네임 변경 여부 상태
        const [isNicknameChane, setNicknameChange] = useState<boolean>(false);

        // function : get user response 처리 함수
        const getUserResponse = (responseBody: GetUserResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                return;
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code !== 'SU') {
                navigate(MAIN_PATH());
                return;
            }

            const {userId, nickname, profileImage} = responseBody as GetUserResponseDTO;
            setNickname(nickname);
            setProfileImage(profileImage);
            const isMyPage = userId === loginUser?.userId;
            setMyPage(isMyPage);
        }

        // function : file upload response 처리 함수
        const fileUploadResponse = (profileImage: string | null) => {
            if (!profileImage) return;
            console.log('profileImage : ' + profileImage);
            if (!cookies.accessToken) return;
            if (!loginUser) return;
            const userType = loginUser.userType;
            const requestBody: PatchProfileImageRequestDTO = {profileImage, userType};
            patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
        }

        // function : patch profile image response 처리 함수
        const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'AF') {
                alert('인증에 실패했습니다.');
                return;
            }
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                return;;
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code !== 'SU') {
                alert('알 수 없는 에러가 발생했습니다.')
                return;
            }

            if (!userId) return;
            getUserRequest(userId).then(getUserResponse);
        }

        // function: patch nickname response 처리 함수
        const patchNicknameResponse = (responseBody: PatchNicknameResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'AF') {
                alert('인증에 실패했습니다.');
                return;
            }
            if (code === 'VF') {
                alert('닉네임은 필수입니다.');
                return;
            }
            if (code === 'DN') {
                alert('중복되는 닉네임입니다.');
                return;
            }
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                return;
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code !== 'SU') return;

            if (!userId) return;
            getUserRequest(userId).then(getUserResponse);
            setNicknameChange(false);
        }

        // event handler : 프로필 사진 클릭 이벤트 처리
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!imageInputRef.current) return;
            imageInputRef.current.click();
        }

        // event handler : 닉네임 수정버튼 클릭 이벤트 처리
        const onNicknameEditButtonClickHandler = () => {
            if (!loginUser) return;
            if (!isNicknameChane) {
                setChangeNickname(nickname);
                setNicknameChange(!isNicknameChane);
                return;
            }
            if (!cookies.accessToken) return;
            const requestBody: PatchNicknameRequestDTO = {
                nickname: changeNickname,
                userType: loginUser?.userType
            };
            patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
        };
        // event handler : 프로필 이미지 변경 이벤트 처리
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || !event.target.files?.length) return;

            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);

            fileUploadRequest(data).then(fileUploadResponse);
        }
        // event handler : 닉네임 변경 이벤트 처리
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setChangeNickname(value);
        }


        // effect : userId  path variable 변경시 실행 할 함수
        useEffect(() => {
            if (!userId) return;
            getUserRequest(userId).then(getUserResponse);
        }, [userId])
        // render : 유저 화면 상단 컴포넌트 렌더링
        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ?
                        <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                            {profileImage !== null ?
                                <div className='user-top-profile-image'
                                     style={{backgroundImage: `url(${profileImage})`}}></div>
                                :

                                <div className='icon-box-large'>
                                    <div className='icon image-box-white-icon'></div>
                                </div>

                            }

                            <input ref={imageInputRef} type="file" accept='image/*' style={{display: 'none'}}
                                   onChange={onProfileImageChangeHandler}/>
                        </div> :
                        <div className='user-top-profile-image-box'
                             style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
                    }

                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ?
                                <>
                                    {isNicknameChane ?
                                        <input type="text" className='user-top-info-nickname-input'
                                               size={changeNickname.length + 2} value={changeNickname}
                                               onChange={onNicknameChangeHandler}/>
                                        :
                                        <div className='user-top-info-nickname'>{nickname}</div>
                                    }

                                    <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                                        <div className='icon edit-icon'></div>
                                    </div>
                                </>
                                :
                                <div className='user-top-info-nickname'>{nickname}</div>
                            }
                        </div>
                        <div className='user-top-info-userid'>{userId}</div>
                    </div>
                </div>
            </div>
        );
    };

    // component : 유저 화면 하단 컴포넌트
    const UserBottom = () => {
        // state : 게시물 개수 상태
        const [count, setCount] = useState<number>(0);
        // state : 페이지 네이션 관련 상태
        const {
            currentPage, currentSection, viewList, viewPageList, totalSection,
            setCurrentPage, setCurrentSection, setTotalList
        } = usePagination<BoardListDTO>(5);
        const accessToken = cookies.accessToken;
        const [isUserDeleted, setIsUserDeleted] = useState(false);
        // function :  get user board list response 처리 함수
        const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                navigate(MAIN_PATH());
                return;
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code !== 'SU') return;

            const {userBoardList} = responseBody as GetUserBoardListResponseDTO;
            setTotalList(userBoardList);
            setCount(userBoardList.length);
        }


        // event handler : 게시글 쓰기 버튼 클릭 이벤트 처리
        const onBoardWriterClickHandler = () => {
            if (!loginUser) return;
            if (loginUser.userType === 'TEACHER') {
                alert('공부인증 게시글은 학생회원만 작성할 수 있습니다.');
                return;
            }
            navigate(BOARD_WRITE_PATH());
        }

        // event handler : 내 정보 수정 버튼 클릭 이벤트 처리
        const onUpdateUserInfoClickHandler = () => {
            if (!loginUser) return;
            navigate(USER_UPDATE_PATH(loginUser?.userId));
        }
        const onChangePasswordClickHandler = () => {
            if (!loginUser || !cookies.accessToken) {
                alert('인증이 만료되었습니다.\n다시 로그인 해주세요');
                navigate(AUTH_PATH());
                return;
            }
            navigate(CHANGE_PASSWORD(loginUser.userId));
        }

        // event handler : FaceID 등록 버튼 클릭 이벤트 처리
        const onFaceIDButtonClickHandler = () => {
            if (!loginUser || !cookies.accessToken) {
                alert('인증이 만료되었습니다.\n다시 로그인 해주세요');
                navigate(AUTH_PATH());
                return;
            }
            if (loginUser.faceId) {
                alert('이미 등록된 FaceID가 존재합니다.');
                return;
            }
            navigate(FACE_ID());
        }

        // event handler : 로그인 하기 버튼 클릭 이벤트 처리
        const onLoginButtonClickHandler = () => {
            navigate(AUTH_PATH());
        }

        // event handler : 마이페이로 이동 버튼 클릭 이벤트 처리 함수
        const onMyPageButtonClickHandler = () => {
            if (!loginUser) return;
            navigate(USER_PATH(loginUser?.userId));
        }

        const deleteUserResponse = (responseBody: DeleteUserResponseDTO | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'NU') {
                navigate(MAIN_PATH());
                alert('존재하지 않는 유저입니다.');
                return;
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code !== 'SU') {
                alert('알수 없는 오류가 발생하였습니다');
                return;
            }

            alert('탈퇴되었습니다.');
            setCookies('accessToken', '', {path: AUTH_PATH(), expires: new Date()});
            setIsUserDeleted(true);
            navigate(AUTH_PATH());
            return;
        }
        const onDeleteUserButtonClickHandler = () => {
            if (!loginUser || !cookies) return;

            MySwal.fire({
                title: '정말 탈퇴하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '예',
                cancelButtonText: '아니오',
            }).then((result: SweetAlertResult) => {
                if (result.isConfirmed) {
                    deleteUserRequest(loginUser.userType, cookies.accessToken)
                        .then(deleteUserResponse);
                    return;
                }
            });

        }


        // effect : userid path variable이 변경될 때마다 실행될 함수
        useEffect(() => {
            if(isUserDeleted) return;

            if (!userId) {
                alert('잘못된 접근입니다.');
                navigate(MAIN_PATH());
                return;
            }
            if (loginUser?.userType === 'TEACHER') return;
            else {
                getUserBoardListRequest(userId).then(getUserBoardListResponse);
            }

        }, [userId, isUserDeleted])

        // render : 유저 화면 하단 컴포넌트 렌더링
        return (
            <div id='user-bottom-wrapper'>
                <div className='user-bottom-container'>
                    {loginUser?.userType === 'STUDENT' &&
                        <div className='user-bottom-title'>{isMyPage ? '내 게시물 ' : '게시물 '}<span
                            className='emphasis'>{count}</span></div>
                    }

                    <div className='user-bottom-contents-box'>
                        {count === 0 ?
                            <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div>
                            :
                            <div className='user-bottom-contents'>
                                {viewList.map(boardListItem => <BoardListItem boardListItem={boardListItem}/>)}
                            </div>
                        }
                        <div className='user-bottom-side-box'>
                            {loginUser?.userType === 'STUDENT' &&
                                <div className='user-bottom-side-card'>
                                    <div className='user-bottom-side-container'>
                                        {isMyPage &&
                                            <>
                                                <div className='icon-box'>
                                                    <div className='icon edit-icon'></div>
                                                </div>
                                                <div className='user-bottom-side-text'
                                                     onClick={onBoardWriterClickHandler}>{'공부인증 게시글쓰기'}</div>
                                            </>
                                        }

                                        {!isMyPage && accessToken &&
                                            <>
                                                <div className='user-bottom-side-text'
                                                     onClick={onMyPageButtonClickHandler}>{'마이페이지로 이동'}</div>
                                                <div className='icon-box'>
                                                    <div className='icon arrow-right-icon'></div>
                                                </div>
                                            </>
                                        }
                                        {!isMyPage && !accessToken &&
                                            <>
                                                <div className='user-bottom-side-text'
                                                     onClick={onLoginButtonClickHandler}>{'로그인 하기'}</div>
                                                <div className='icon-box'>
                                                    <div className='icon arrow-right-icon'></div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            }

                            {isMyPage &&
                                <>
                                    <div className='user-bottom-side-card'>
                                        <div className='user-bottom-side-container'>
                                            <div className='icon-box'>
                                                <div className='icon my-page-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-text'
                                                 onClick={onUpdateUserInfoClickHandler}>{'내 정보 수정'}</div>
                                        </div>
                                    </div>
                                    <div className='user-bottom-side-card'>
                                        <div className='user-bottom-side-container'>
                                            <div className='icon-box-middle'>
                                                <div className='icon password-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-text'
                                                 onClick={onChangePasswordClickHandler}>{'비밀번호 변경'}</div>
                                        </div>
                                    </div>
                                    <div className='user-bottom-side-card'>
                                        <div className='user-bottom-side-container'>
                                            <div className='icon-box-large'>
                                                <div className='icon face-id-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-text'
                                                 onClick={onFaceIDButtonClickHandler}>{'FaceID 등록하기'}</div>
                                        </div>
                                    </div>
                                    <div className='user-bottom-side-card'>
                                        <div className='user-bottom-side-container'>
                                            <div className='icon-box-large'>
                                                <div className='icon face-id-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-text'
                                                 onClick={onDeleteUserButtonClickHandler}>{'회원 탈퇴하기'}</div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className='user-bottom-pagination-box'>
                        {count !== 0 &&
                            <Pagenation
                                currentPage={currentPage}
                                currentSection={currentSection}
                                setCurrentPage={setCurrentPage}
                                setCurrentSection={setCurrentSection}
                                viewPageList={viewPageList}
                                totalSection={totalSection}
                            />}
                    </div>
                </div>
            </div>
        );
    };
    // render : 유저 화면 컴포넌트 렌더링
    return (
        <div>
            <UserTop/>
            <UserBottom/>
        </div>
    )
}
