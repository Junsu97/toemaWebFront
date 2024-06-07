import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import ReactModal from "react-modal";
import dayjs, {Dayjs} from "dayjs";
import './style.css';
import {TextareaAutosize} from "@mui/material";
import {patchHomeworkRequest} from "../../../apis";
import {PostPatchHomeworkRequestDto} from "../../../apis/reqeust/homework";
import HomeworkListItemInterface from "../../../types/interface/homework-list-item.interface";
import loginUserStore from "../../../stores/login-user.store";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH, MAIN_PATH} from "../../../constant";
import {HomeAnotherResponseDTO} from "../../../apis/response/homework";
import {ResponseDto} from "../../../apis/response";

interface ModalProps {
    onOpen?: () => void;
    onClose?: () => void;
    open: boolean;
    homework: HomeworkListItemInterface;
}

const CalendarModal: React.FC<ModalProps> = ({onOpen, onClose, open,homework}) => {
    const today = dayjs(); // 오늘의 날짜 가져오기
    const [hStartDate, setStartDate] = useState<Dayjs | null>(null);
    const [hEndDate, setEndDate] = useState<Dayjs | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const disableStartDate = dayjs(today).format('YYYY-MM-DD');
    const disableEndDate = hStartDate;
    const [modalOpen, setModalOpen] = useState<boolean>(open);
    const [homeworkContent, setHomeworkContent] = useState<string>('');
    const {seq, studentId, teacherId, startDate, endDate, content, submit} = homework;
    const {loginUser} = loginUserStore();
    const [cookies] = useCookies();
    const navigate = useNavigate();
    useEffect(() => {
        setModalOpen(open);
    }, [open]);

    useEffect(() => {
        if (modalOpen && onOpen) {
            onOpen();
        }
    }, [modalOpen, onOpen]);

    const handleClose = () => {
        setModalOpen(false);
        if (onClose) {
            onClose();
        }
    };
    const patchHomeworkResponse = (responseBody: HomeAnotherResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
        if(code === 'NH'){
            alert('존재하지 않는 숙제 정보입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'NP'){
            alert('수정 권한이 없습니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'DBE'){
            alert('데이터베이스 오류입니다.')
            navigate(MAIN_PATH());
            return;
        }
        if(code !== 'SU'){
            alert('알 수 없는 에러가 발생하였습니다.');
            return;
        }
        alert('수정되었습니다.');
        handleClose();
        window.location.reload();
        return;
    }

    const updateButtonClickHandler = () => {
        if(!loginUser || !cookies.accessToken){
            alert('로그인 후 이용해주세요.');
            navigate(AUTH_PATH());
            return;
        }
        if(loginUser.userType !== 'TEACHER'){
            alert('권한이 없는 사용자입니다.');
            navigate(MAIN_PATH());
            return;
        }
        const startDateStr = hStartDate ? hStartDate.format('YYYY-MM-DD') : '';
        const endDateStr = hEndDate ? hEndDate.format('YYYY-MM-DD') : '';
        const requestBody : PostPatchHomeworkRequestDto = {
            studentId: studentId,
            teacherId: teacherId,
            startDate: startDateStr,
            endDate: endDateStr,
            content: homeworkContent
        }

        patchHomeworkRequest(requestBody, seq, cookies.accessToken).then(patchHomeworkResponse);
    }

    const homeworkTextChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setHomeworkContent(event.target.value);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{monthShort: 'M'}}>
            <ReactModal
                isOpen={modalOpen}
                onRequestClose={handleClose}
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
                className={'calendar-modal'}
                overlayClassName={'overlay'}
                style={{
                    overlay: {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <div className={'close-icon-wrapper'}>
                    <div className={'icon close-icon'} style={{width: '30px', height: '30px', cursor:'pointer'}} onClick={handleClose}></div>
                </div>
                <div className="date-picker-container">
                    <DatePicker
                        label="시작 날짜"
                        format="YYYY-MM-DD"
                        onChange={(date) => setStartDate(date)}
                        value={hStartDate}
                        // renderInput={(params) => <input {...params} />}
                        shouldDisableDate={day => {
                            return dayjs(day as Dayjs).isBefore(disableStartDate);
                        }}
                    />
                    <DatePicker
                        label="마감 날짜"
                        format="YYYY-MM-DD"
                        onChange={(date) => setEndDate(date)}
                        value={hEndDate}
                        // renderInput={(params) => <input {...params} />}
                        shouldDisableDate={(day) =>
                            startDate ? dayjs(day).isBefore(disableEndDate) : true // startDate가 있는 경우에만 이전 날짜를 비활성화
                        }
                    />
                </div>
                <div className={'homework-text-area'}>
                    <TextareaAutosize
                        minRows={3}
                        maxRows={7}
                        aria-valuetext={'숙제내용'}
                        placeholder={'학생에게 줄 숙제 내용을 작성해주세요.' +
                            '\n수학 익힘책 : 39p~41p'}
                        onChange={homeworkTextChangeHandler}
                        value={homeworkContent}
                        style={{ width: '100%', resize: 'none' }}
                        ref={contentRef}
                    />
                </div>
                <div className={'button-wrapper'}>
                    <div className={'black-button'} onClick={updateButtonClickHandler}>수정하기</div>
                </div>
            </ReactModal>
        </LocalizationProvider>
    );
};

export default CalendarModal;
