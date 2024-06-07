import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { DatePicker, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import './style.css';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from "dayjs";
import { TextareaAutosize } from "@mui/material";
import {getHomeworkListRequest, postHomeworkRequest} from "../../../apis";
import {useNavigate, useParams} from "react-router-dom";
import {GetHomeworkListResponseDto, HomeAnotherResponseDTO,} from "../../../apis/response/homework";
import { ResponseDto } from "../../../apis/response";
import HomeworkListItemInterface from "../../../types/interface/homework-list-item.interface";
import isBetween from "dayjs/plugin/isBetween";
import HomeworkList from "../../Homework";
import { usePagination } from "../../../hooks";
import Pagenation from "../../Pagination";
import {PostPatchHomeworkRequestDto} from "../../../apis/reqeust/homework";
import {useCookies} from "react-cookie";
import {AUTH_PATH, HOMEWORK, MAIN_PATH, MATCHED_STUDENT_LIST} from "../../../constant";

dayjs.extend(isBetween);

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
    '.MuiDayCalendar-header > span:first-of-type': {
        color: 'red',
    },
    '.MuiDayCalendar-header > span:nth-of-type(7)': {
        color: 'blue',
    },
}));

export default function CalendarItem() {
    const today = dayjs(); // 오늘의 날짜 가져오기
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const disableStartDate = dayjs(today).format('YYYY-MM-DD');
    const disableEndDate = startDate;
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    const [homeworkContent, setHomeworkContent] = useState<string>('');
    const [selectDate, setSelectDate] = useState<string>(dayjs(today).format('YYYY-MM-DD'));
    const { teacherUserId, studentUserId } = useParams();
    const [isExistHomework, setExistHomework] = useState<boolean>(false);
    const [homeworkList, setHomeworkList] = useState<HomeworkListItemInterface[]>([]);
    const [hasContent, setHasContent] = useState<boolean>(true);
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<HomeworkListItemInterface>(3);

    const getHomeworkListResponse = (responseBody: GetHomeworkListResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
        if (code === 'NU' || code === 'NM') {
            alert('잘못된 요청입니다.');
            return;
        }
        if (code === 'NH') {
            setExistHomework(true);
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

        const { homeworkList } = responseBody as GetHomeworkListResponseDto;
        setHomeworkList(homeworkList);
        setTotalList(homeworkList);
    }

    useEffect(() => {

        getHomeworkListRequest(teacherUserId as string, studentUserId as string).then(getHomeworkListResponse);
    }, []);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            setSelectDate(formattedDate);

            // Check if there are homeworks for the selected date
            const homeworksForDate = homeworkList.filter(hw =>
                date.isBetween(hw.startDate, hw.endDate, 'day', '[]')
            );

            if (homeworksForDate.length > 0) {
                // Combine contents of all homeworks for the selected date with line breaks
                const combinedContent = homeworksForDate.map(homework => homework.content).join('\n');
                setHomeworkContent(combinedContent);
            } else {
                setHomeworkContent('');
            }
        } else {
            setSelectDate('');
            setHomeworkContent('');
        }
    };


    const homeworkTextChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setHomeworkContent(event.target.value);
    }

    const renderDay = (props: PickersDayProps<Dayjs>) => {
        const { day, ...DayComponentProps } = props;
        const formattedDay = day.format('YYYY-MM-DD');

        // Find all homeworks for the day
        const homeworksForDay = homeworkList.filter(hw =>
            day.isBetween(hw.startDate, hw.endDate, 'day', '[]')
        );

        // Check if there are overlapping homeworks
        const overlappingHomeworks = homeworkList.filter((hw1, index1) =>
            homeworkList.some((hw2, index2) =>
                index1 !== index2 &&
                day.isBetween(hw1.startDate, hw1.endDate, 'day', '[]') &&
                day.isBetween(hw2.startDate, hw2.endDate, 'day', '[]')
            )
        );

        return (
            <PickersDay
                {...DayComponentProps}
                day={day}
                style={{
                    backgroundColor: homeworksForDay.length === 1
                        ? '#adc8e6' // First color for single homework
                        : homeworksForDay.length > 1 || overlappingHomeworks.length > 0
                            ? '#5b627d' // Second color for overlapping homeworks
                            : undefined,
                    borderRadius: homeworksForDay.length > 0 || overlappingHomeworks.length > 0 ? '50%' : undefined,
                }}
            />
        );
    };

    const postHomeworkResponse = (responseBody: HomeAnotherResponseDTO | ResponseDto | null) => {
        if(!teacherUserId || !studentUserId){
            return;
        }
        if (!responseBody) {
            alert('서버로부터 데이터를 불러올 수 없습니다.');
            return;
        }
        const { code } = responseBody;
        if(code === 'VF'){
            alert('비정상적인 접근입니다.');
            return;
        }
        if(code === 'NU'){
            alert('사용자 정보가 옳바르지 않습니다.');
            return;
        }
        if(code === 'NM'){
            alert('관리중인 학생이 아닙니다. 다시 확인해주세요.');
            navigate(MATCHED_STUDENT_LIST(teacherUserId));
            return;
        }
        if(code === 'DBE'){
            alert('데이터베이스 오류입니다.');
            return;
        }
        if(code !== 'SU'){
            alert('알 수 없는 에러가 발생하였습니다.');
            navigate(MAIN_PATH());
            return;
        }

        alert('숙제 등록을 완료하였습니다.');
        window.location.reload();
        return;
    }

    const onPostButtonClickHandler = () => {
        if(!cookies.accessToken){
            alert('로그인 후 이용해주세요.');
            navigate(AUTH_PATH());
            return;
        }
        if(!studentUserId || !teacherUserId){
            alert('비정상적인 접근입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(!startDate || !endDate){
            alert('시작날짜와 종료날짜는 비워둘 수 없습니다.');
            return;
        }
        if(!homeworkContent){
            alert('숙제 내용을 입력해주세요.');
            return;
        }
        const startDateStr = startDate ? startDate.format('YYYY-MM-DD') : '';
        const endDateStr = endDate ? endDate.format('YYYY-MM-DD') : '';
        const requestBody : PostPatchHomeworkRequestDto = {
            studentId: studentUserId,
            teacherId: teacherUserId,
            startDate: startDateStr,
            endDate: endDateStr,
            content: homeworkContent
        }

        postHomeworkRequest(requestBody, cookies.accessToken).then(postHomeworkResponse);
    }


    return (
        <div className="calendar-container">
            <div className="left-container">
                <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ monthShort: 'M' }}>
                    <StyledDateCalendar
                        defaultValue={today}
                        onChange={(date) => handleDateChange(date)}
                        sx={{ width: '100%' }}
                        slots={{ day: renderDay }}
                    />
                    <div className={'date-picker-container'}>
                        <div className={'start-date-header'}>시작 날짜</div>
                        <div className={'end-date-header'}>마감 날짜</div>
                    </div>
                    <div className={'date-picker-container'}>
                        <DatePicker
                            format={'YYYY-MM-DD'}
                            onChange={(date) => setStartDate(date)}
                            value={startDate}
                            shouldDisableDate={day => {
                                return dayjs(day as Dayjs).isBefore(disableStartDate);
                            }}
                        />
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={(date) => setEndDate(date)}
                            value={endDate}
                            shouldDisableDate={(day) =>
                                startDate ? dayjs(day).isBefore(disableEndDate) : true // startDate가 있는 경우에만 이전 날짜를 비활성화
                            }
                        />
                    </div>
                </LocalizationProvider>

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
                    <div className={'black-button'} onClick={onPostButtonClickHandler}>제출</div>
                </div>
            </div>
            <div className='right-container'>
                <div className={'right-container-title'}>{'숙제 내용'}</div>
                {!hasContent &&
                    <>
                        <div className={'right-container-not-content-box'}>
                            <div className={'right-container-not-content'}>{'해당 날짜에 등록된 숙제가 없습니다.'}</div>
                        </div>
                    </>
                }
                {
                    hasContent &&
                    <>
                        {viewList.map((homework) => (
                            <HomeworkList key={homework.seq} homeworkListItem={homework} />
                        ))}
                        <div className='list-bottom-pagination-box'>
                            <Pagenation
                                currentPage={currentPage}
                                currentSection={currentSection}
                                setCurrentPage={setCurrentPage}
                                setCurrentSection={setCurrentSection}
                                viewPageList={viewPageList}
                                totalSection={totalSection} />
                        </div>
                    </>
                }

            </div>
        </div>
    );
}
