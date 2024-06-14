import React, { useEffect, useState } from 'react';
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import './style.css';
import { FormControl, Radio, RadioGroup } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from 'react-modal';
import TutoringListItemInterface from "../../../types/interface/tutoring-list-item.interface";
import { getTutoringListFromTeacherRequest, postTutoringRequest } from "../../../apis";
import PostTutoringRequestDTO from "../../../apis/reqeust/tutoring/post-tutoring-request.dto";
import { useNavigate, useParams } from "react-router-dom";
import loginUserStore from "../../../stores/login-user.store";
import { AUTH_PATH, MAIN_PATH, MATCHED_STUDENT_LIST } from "../../../constant";
import { GetTutoringListResponseDTO, TutoringAnotherResponseDTO } from "../../../apis/response/tutoring";
import { ResponseDto } from "../../../apis/response";
import { useCookies } from "react-cookie";
import TutoringItem from "../../TutoringItem";
import Pagination from "../../Pagination";
import { usePagination } from "../../../hooks";
import HomeworkListItemInterface from "../../../types/interface/homework-list-item.interface";

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
    '.MuiDayCalendar-header > span:first-of-type': {
        color: 'red',
    },
    '.MuiDayCalendar-header > span:nth-of-type(7)': {
        color: 'blue',
    },
}));

Modal.setAppElement('#root');

export default function CalendarComponent() {
    const today = dayjs();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(today);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);
    const [formattedStartTime, setFormattedStartTime] = useState('');
    const [formattedEndTime, setFormattedEndTime] = useState('');
    const [tutoringList, setTutoringList] = useState<TutoringListItemInterface[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [subject, setSubject] = useState('국어');
    const { loginUser } = loginUserStore();
    const [cookies] = useCookies();
    const disableEndTime = startTime;
    const { teacherUserId, studentUserId } = useParams();
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<TutoringListItemInterface>(3);

    const navigate = useNavigate();

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        if (date) {
            const selectedDateTutoringList = tutoringList.filter(tutoring => dayjs(tutoring.tutoringDate).isSame(date, 'day'));
            if (selectedDateTutoringList.length > 0) {
                setModalIsOpen(true);
            }
        }
    };

    const handleStartTimeChange = (newTime: Dayjs | null) => {
        setStartTime(newTime);
        if (newTime) {
            setFormattedStartTime(dayjs(newTime).format('HH:mm'));
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

    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject((event.target as HTMLInputElement).value);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const postTutoringResponse = (responseBody: TutoringAnotherResponseDTO | ResponseDto | null) => {
        if (!teacherUserId) {
            return;
        }
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
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
            navigate(MATCHED_STUDENT_LIST(teacherUserId));
            return;
        }
        if (code === 'ET') {
            alert('선택하신 일정에 ' + studentUserId + '학생이 이미 수업이 존재합니다.\n다른 시간대를 선택해주세요.');
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

        alert('과외 일정 추가를 완료하였습니다.');
        window.location.reload();
        return;
    };

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
        if (!studentUserId || !teacherUserId) {
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
            if (teacherUserId !== loginUser.userId) {
                alert('비정상적인 접근입니다.');
                return;
            }
            const startTimeStr = startTime ? startTime.format('HH:mm') : today.format('HH:mm');
            const endTimeStr = endTime ? endTime.format('HH:mm') : today.format('HH:mm');
            const requestBody: PostTutoringRequestDTO = {
                teacherId: teacherUserId,
                studentId: studentUserId,
                tutoringStartTime: startTimeStr,
                tutoringEndTime: endTimeStr,
                tutoringDate: dayjs(selectedDate).format('YYYY-MM-DD'),
                tutoringSubject: subject
            };
            postTutoringRequest(requestBody, cookies.accessToken).then(postTutoringResponse);
        }
    };

    const getTutoringListFromTeacherResponse = (responseBody: GetTutoringListResponseDTO | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
        if (code === 'NU' || code === 'NM') {
            alert('잘못된 요청입니다.');
            return;
        }
        if (code === 'NT') {
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

        const { tutoringList } = responseBody as GetTutoringListResponseDTO;
        setTotalList(tutoringList);
        setTutoringList(tutoringList);
    };

    useEffect(() => {
        if(!loginUser || !cookies.accessToken){
            alert('비정상적인 접근입니다.');
            navigate(AUTH_PATH());
            return
        }
        getTutoringListFromTeacherRequest(teacherUserId as string, studentUserId as string).then(getTutoringListFromTeacherResponse);
    }, []);

    const renderDay = (props: PickersDayProps<Dayjs>) => {
        const { day, ...DayComponentProps } = props;
        const formattedDay = day.format('YYYY-MM-DD');

        const homeworksForDay = tutoringList.filter(tt =>
            day.isSame(tt.tutoringDate, 'day')
        );

        const overlappingHomeworks = homeworksForDay.length > 1;

        return (
            <PickersDay
                {...DayComponentProps}
                day={day}
                style={{
                    backgroundColor: homeworksForDay.length === 1
                        ? '#adc8e6'
                        : homeworksForDay.length > 1 || overlappingHomeworks
                            ? '#5b627d'
                            : undefined,
                }}
            />
        );
    };

    return (
        <div className="tutoring-calendar-container">
            <div className="header">과외 일정 관리</div>
            <div className="calendar-wrapper">
                <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ monthShort: 'M' }}>
                    <StyledDateCalendar
                        value={selectedDate}
                        onChange={handleDateChange}
                        slots={{ day: renderDay }}
                    />
                    <div className="date-picker-container">
                        <div className="start-date-header">시작 시간</div>
                        <div className="end-date-header">종료 시간</div>
                    </div>
                    <div className="time-picker-container">
                        <div className="time-picker">
                            <TimePicker
                                label={'  '}
                                value={startTime}
                                onChange={handleStartTimeChange}
                            />
                        </div>
                        <div className="time-picker">
                            <TimePicker
                                label={'  '}
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
                        <FormControlLabel value="국어" control={<Radio />} label="국어" />
                        <FormControlLabel value="수학" control={<Radio />} label="수학" />
                        <FormControlLabel value="사회" control={<Radio />} label="사회" />
                        <FormControlLabel value="과학" control={<Radio />} label="과학" />
                        <FormControlLabel value="영어" control={<Radio />} label="영어" />
                    </RadioGroup>
                </FormControl>
                <div>
                    <div className="black-button" onClick={handleScheduleClick}>일정 잡기</div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Tutoring List"
                className="custom-modal-content"
                overlayClassName="custom-modal-overlay"
            >
                <div className={'modal-flex-box'}>
                    <h2>과외 일정</h2>
                    <div className={'close-icon-wrapper'}>
                        <div className={'icon close-icon'} style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                             onClick={closeModal}></div>
                    </div>
                    <div className={'tutoring-item-container'}>
                        {tutoringList
                            .filter(tutoring => dayjs(tutoring.tutoringDate).isSame(selectedDate, 'day'))
                            .map((tutoring, index) => (
                                <TutoringItem key={tutoring.seq} tutoringList={tutoring}></TutoringItem>
                            ))}
                    </div>
                </div>
                <div className='list-bottom-pagination-box'>
                    <Pagination
                        currentPage={currentPage}
                        currentSection={currentSection}
                        setCurrentPage={setCurrentPage}
                        setCurrentSection={setCurrentSection}
                        viewPageList={viewPageList}
                        totalSection={totalSection} />
                </div>
            </Modal>
        </div>
    );
}
