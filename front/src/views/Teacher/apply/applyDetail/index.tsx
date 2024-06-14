import defautltProfileImage from "../../../../assets/image/default-profile-image.png";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {AUTH_PATH, MAIN_PATH, TEACHER_APPLY_LIST, TEACHER_APPLY_UPDATE, TEACHER_LIST} from "../../../../constant";
import {getApplyInfoRequest, patchApplyRequest} from "../../../../apis";
import {GetApplyInfoResponseDTO, PatchApplyResponseDTO} from "../../../../apis/response/teacher";
import {ResponseDto} from "../../../../apis/response";
import {PatchApplyRequestDTO} from "../../../../apis/reqeust/teacher";
import loginUserStore from "../../../../stores/login-user.store";

export default function ApplyDetail() {
    const {teacherUserId, studentUserId} = useParams();
    const [content, setContent] = useState<string>('');
    const [status , setStatus] = useState<string>('');
    const [isShowButton, setShowButton] = useState<boolean>(true);
    const [buttonTag, setButtonTag] = useState<boolean>(false);
    const [buttonMessage, setButtonMessage] = useState<string>('신청 취소');
    const [buttonMsg, setButtonMsg] = useState<string>('');
    const {loginUser} = loginUserStore();
    const [cookies, setCookies] = useCookies();
    const [isWriter, setIsWriter] = useState<boolean>(false);

    const navigate = useNavigate();

    const getApplyInfoResponse = (responseBody: GetApplyInfoResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        const {code} = responseBody;
        if (code === 'NU' || code === 'NA') {
            alert('잘못된 접근입니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        if (code === 'DBE') {
            alert('데이터베이스 에러입니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        if (code !== 'SU') {
            alert('잘못된 요청입니다.\n다시 시도해주세요.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }

        const {teacherId, studentId, content, writeDatetime, status} = responseBody as GetApplyInfoResponseDTO;
        setContent(content);
        setStatus(status);
    }

    const patchApplyResponse = (responseBody: PatchApplyResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        const {code} = responseBody;
        if (code === 'NA' || code === 'NP') {
            alert('잘못된 접근입니다.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        if (code !== 'SU') {
            alert('잘못된 요청입니다.\n다시 시도해주세요.');
            navigate(TEACHER_APPLY_LIST());
            return;
        }
        alert('완료되었습니다.');
        navigate(TEACHER_APPLY_LIST());
        return;
    }
    const updateButtonClickHandler = () => {
        if (!loginUser) {
            alert('로그인 후 이용해주세요;');
            navigate(AUTH_PATH());
            return;
        }

        if(buttonTag){
            navigate(TEACHER_APPLY_UPDATE(teacherUserId as string, studentUserId as string));
        }else{
            const requestBody: PatchApplyRequestDTO = {
                studentId: studentUserId as string,
                teacherId: teacherUserId as string,
                content: content,
                status: '승인됨',
                userType: loginUser.userType
            }
            patchApplyRequest(requestBody, cookies.accessToken).then(patchApplyResponse);
        }
    }

    const cancelButtonClickHandler = () => {
        if (!loginUser) {
            alert('로그인 후 이용해주세요;');
            navigate(AUTH_PATH());
            return;
        }
        const requestBody: PatchApplyRequestDTO = {
            studentId: studentUserId as string,
            teacherId: teacherUserId as string,
            content: content,
            status: '거절됨',
            userType: loginUser.userType
        }
        patchApplyRequest(requestBody, cookies.accessToken).then(patchApplyResponse);
    }

    useEffect(() => {
        if (!teacherUserId || !studentUserId || !cookies.accessToken || !loginUser) {
            alert('비정상적인 접근입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(loginUser.userId === teacherUserId || loginUser.userId === studentUserId){
            setIsWriter(true);
        }
        if (loginUser.userType === 'STUDENT' && loginUser.userId === studentUserId) {
            setButtonTag(true);
            setButtonMessage('신청 취소');
            setButtonMsg('수정하기')
        } else {
            setButtonMessage('거절하기');
            setButtonMsg('승인하기');
            setButtonTag(false);
        }


        getApplyInfoRequest(teacherUserId, studentUserId).then(getApplyInfoResponse);

        if(status === '거절됨' || loginUser.userType === 'STUDENT'){
            setButtonMsg('다시 신청하기');
        }
        if(status === '거절됨'){
            setShowButton(false);
        }
    }, []);
    return (
        <div id='wrapper'>{isWriter ? <div className="side_wrapper">
            <section className="about-dev">
                <header className="profile-card_header">
                    <div className="profile-card_header-container">
                        <h1>{teacherUserId}<span>{studentUserId}</span></h1>
                    </div>
                </header>
                <div className="profile-card_about">
                    <h2>신청 메시지</h2>
                    <p>{content}</p>
                    <footer className="profile-card_footer">
                        <div className="social-row">
                            <div className="heart-icon" title="No Health Issues">
                                {/* SVG content here */}
                            </div>
                            <div className="paw-icon" title="Gets Along Well With Other Animals">
                                {/* SVG content here */}
                            </div>
                        </div>
                        <p>

                            <a className="back-to-profile" onClick={updateButtonClickHandler}>{buttonMsg}</a>
                            {isShowButton &&
                                <a className="back-to-profile" onClick={cancelButtonClickHandler}>{buttonMessage}</a>
                            }

                        </p>
                    </footer>
                </div>
            </section>
        </div>:
            <div>

            </div>
        }

        </div>
    )
}