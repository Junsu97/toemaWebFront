import CalendarModal from "../Calender/calendarmodal";
import React, {useState} from "react";
import './style.css';
import TutoringListItemInterface from "../../types/interface/tutoring-list-item.interface";
import {DateCalendar, LocalizationProvider, PickersDay, PickersDayProps, TimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {styled} from "@mui/material/styles";
import dayjs, {Dayjs} from "dayjs";
import {FormControl, Radio, RadioGroup} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import {AUTH_PATH, MAIN_PATH, MATCHED_STUDENT_LIST} from "../../constant";
import PostTutoringRequestDTO from "../../apis/reqeust/tutoring/post-tutoring-request.dto";
import {deleteTutoringRequest, patchTutoringRequest, postTutoringRequest} from "../../apis";
import loginUserStore from "../../stores/login-user.store";

import {useNavigate} from "react-router-dom";
import PatchTutoringRequestDTO from "../../apis/reqeust/tutoring/patch-tutoring-request.dto";
import {TutoringAnotherResponseDTO} from "../../apis/response/tutoring";
import {ResponseDto} from "../../apis/response";
import {useCookies} from "react-cookie";

interface Props {
    tutoringList: TutoringListItemInterface
}

const StyledDateCalendar = styled(DateCalendar)(({theme}) => ({
    '.MuiDayCalendar-header > span:first-of-type': {
        color: 'red',
    },
    '.MuiDayCalendar-header > span:nth-of-type(7)': {
        color: 'blue',
    },
}));
export default function TutoringItem({tutoringList}: Props) {
    const blank = '\u00A0';
    const today = dayjs();
    const disableStartDate = dayjs(today).format('YYYY-MM-DD');
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(today);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);
    const [formattedStartTime, setFormattedStartTime] = useState('');
    const [formattedEndTime, setFormattedEndTime] = useState('');
    const [subject, setSubject] = useState('국어');
    const [isClick, setClick] = useState<boolean>(false);
    const disableEndTime = startTime;
    const {loginUser} = loginUserStore();
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const handleStartTimeChange = (newTime: Dayjs | null) => {
        setStartTime(newTime);
        if (newTime) {
            setFormattedStartTime(dayjs(newTime).format('HH:mm'));
            // 만약 마감 시간이 시작 시간보다 이전이면 마감 시간을 초기화합니다.
            if (endTime && newTime.isAfter(endTime)) {
                setEndTime(null);
                setFormattedEndTime('');
                alert('마감 시간은 시작 시간보다 과거일 수 없습니다. 마감 시간을 다시 설정해주세요.');
            }

        }
    };

    const handleEndTimeChange = (newTime: Dayjs | null) => {
        if (newTime && startTime && newTime.isBefore(startTime)) {
            alert('마감 시간은 시작 시간보다 과거일 수 없습니다.');
        } else {
            setEndTime(newTime);
            if (newTime) {
                setFormattedEndTime(dayjs(newTime).format('HH:mm'));
            }
        }
    };

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);

    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject((event.target as HTMLInputElement).value);
    };

    const onUpdateButtonClickHandler = () => {
        setClick(true);
    }

    const deleteTutoringResponse = (responseBody: TutoringAnotherResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
        if(code === 'NU'){
            alert('선생 또는 학생이 DB에 존재하지 않는 유저입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'NT'){
            alert('존재하지 않는 과외 정보입니다.');
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

        alert('삭제되었습니다.');
        window.location.reload();
        return;
    }
    const onDeleteButtonClickHandler = () => {
        if(!cookies.accessToken){
            alert('로그인 후 이용해주세요');
            return;
        }
        deleteTutoringRequest(tutoringList.seq, cookies.accessToken).then(deleteTutoringResponse);
    }
    const patchTutoringResponse = (responseBody: TutoringAnotherResponseDTO | ResponseDto | null) => {
        setClick(false);
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const {code} = responseBody;
        if (code === 'VF') {
            alert('비정상적인 접근입니다.');
            return;
        }
        if (code === 'NU') {
            alert('사용자 정보가 옳바르지 않습니다.');
            return;
        }
        if (code === 'NM') {
            alert('관리중인 학생이 아닙니다. 다시 확인해주세요.');
            navigate(MATCHED_STUDENT_LIST(tutoringList.teacherId));
            return;
        }
        if (code === 'ET') {
            alert('선택하신 일정에 ' + tutoringList.studentId + '학생이 이미 수업이 존재합니다.\n다른 시간대를 선택해주세요.');
            return;
        }
        if (code === 'DBE') {
            alert('데이터베이스 에러입니다.');
            return;
        }
        if (code !== 'SU') {
            alert('알 수 없는 에러가 발생했습니다.');
            return;
        }

        alert('과외 일정 수정을 완료하였습니다.');
        window.location.reload();
        return;

    }
    const handleScheduleClick = () => {
        if (!loginUser || !cookies.accessToken) {
            alert('로그인 후 이용해주세요');
            navigate(AUTH_PATH());
            return;
        }
        if (!startTime || !endTime || !selectedDate) {
            alert('날짜 및 시작시간 종료시간은 필수 입력 사항입니다.');
            return;
        }
        if (!tutoringList.studentId || !tutoringList.teacherId) {
            alert('비정상적인 접근입니다.');
            alert('응애');
            navigate(MAIN_PATH());
            return;
        }

        if (selectedDate && selectedDate.isBefore(today, 'day')) {
            alert('오늘보다 이전의 날짜는 선택할 수 없습니다.');
        } else if (startTime && endTime && endTime.isBefore(startTime)) {
            alert('마감 시간은 시작 시간보다 과거일 수 없습니다.');
            return;
        } else {
            // 일정 잡기 로직 추가

            if (tutoringList.teacherId !== loginUser.userId) {
                alert('비정상적인 접근입니다.');
                return;
            }
            const startTimeStr = startTime ? startTime.format('HH:mm') : today.format('HH:mm');
            const endTimeStr = endTime ? endTime.format('HH:mm') : today.format('HH:mm');
            const requestBody: PatchTutoringRequestDTO = {
                tutoringStartTime: startTimeStr,
                tutoringEndTime: endTimeStr,
                tutoringDate: dayjs(selectedDate).format('YYYY-MM-DD'),
                tutoringSubject: subject
            };
            patchTutoringRequest(requestBody, tutoringList.seq, cookies.accessToken).then(patchTutoringResponse);
        }
    };
    return (
        <div id="homework">
            <div className="homework-wrapper">
                {isClick &&
                    <>
                        <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{monthShort: 'M'}}>
                            <StyledDateCalendar
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                            <div className="date-picker-container">
                                <div className="start-date-header">시작 시간</div>
                                <div className="end-date-header">종료 시간</div>
                            </div>
                            <div className="time-picker-container">
                                <div className="time-picker">
                                    <TimePicker
                                        shouldDisableTime={day => {
                                            return dayjs(day as Dayjs).isBefore(disableStartDate);
                                        }}
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                    />
                                </div>
                                <div className="time-picker">
                                    <TimePicker

                                        value={endTime}
                                        onChange={handleEndTimeChange}
                                        shouldDisableTime={(day) =>
                                            startTime ? dayjs(day).isBefore(disableEndTime) : true
                                        }
                                    />
                                </div>
                            </div>
                        </LocalizationProvider>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">
                                수업 할 과목
                            </FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="국어"
                                name="radio-buttons-group"
                                row
                                value={subject}
                                onChange={handleSubjectChange}
                            >
                                <FormControlLabel value="국어" control={<Radio/>} label="국어"/>
                                <FormControlLabel value="수학" control={<Radio/>} label="수학"/>
                                <FormControlLabel value="사회" control={<Radio/>} label="사회"/>
                                <FormControlLabel value="과학" control={<Radio/>} label="과학"/>
                                <FormControlLabel value="영어" control={<Radio/>} label="영어"/>
                            </RadioGroup>
                        </FormControl>

                        <div>
                            <div className="black-button" onClick={handleScheduleClick}>일정 수정</div>
                        </div>
                    </>
                }
                {!isClick &&
                    <>
                        <div className="content-date-container">
                            {tutoringList.tutoringDate}{blank}-{blank}{tutoringList.tutoringStartTime}{blank}~{blank}{tutoringList.tutoringEndTime}
                            {/*<div className="content-date">{startDate}</div>*/}
                            {/*<div className="content-date">{endDate}</div>*/}
                        </div>
                        <div className="homework-content">{tutoringList.tutoringSubject}</div>
                        <div className="button-box">
                            <div className="black-button" onClick={onUpdateButtonClickHandler}>수정하기</div>
                            <div className="black-button" onClick={onDeleteButtonClickHandler}>삭제하기</div>
                            {/*<CalendarModal open={isOpen} onClose={handleClose} homework={homeworkListItem}/>*/}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}