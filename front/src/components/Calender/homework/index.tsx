import Calendar from "react-calendar";
import {DatePicker} from "@mui/x-date-pickers";
import {DateCalendar, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import './style.css';
import {styled} from '@mui/material/styles';
import dayjs, {Dayjs} from "dayjs";
import {ChangeEvent, useRef, useState} from "react";
import {TextareaAutosize} from "@mui/material";

const StyledDateCalendar = styled(DateCalendar)(({theme}) => ({
    '.MuiDayCalendar-header > span:first-of-type': {
        color: 'red',
    },
    '.MuiDayCalendar-header > span:nth-of-type(7)': {
        color: 'blue',
    },
}));
export default function CalenderItem() {
    const today = dayjs(); // 오늘의 날짜 가져오기
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const disableStartDate = dayjs(today).format('YYYY-MM-DD');
    const disableEndDate = startDate;

    const [homeworkContent, setHomeworkContent] = useState<string>('');
    const [selectDate, setSelectDate] = useState<string>(dayjs(today).format('YYYY-MM-DD'));
    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            setSelectDate(formattedDate);
        } else {
            const formattedDate = dayjs(today).format('YYYY-MM-DD');
            setSelectDate('');
        }
    };

    const homeworkTextChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
        setHomeworkContent(event.target.value);
    }
    return (
        <div className="calendar-container">
            <div className="left-container">
                <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{monthShort: 'M'}}>
                    <StyledDateCalendar
                        defaultValue={today}
                        onChange={(date) => handleDateChange(date)}
                        sx={{width:'100%'}}
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
                                return dayjs(dayjs(day as Dayjs)).isBefore(disableStartDate);
                            }}
                        />
                        <DatePicker
                            format="YYYY-MM-DD"
                            shouldDisableDate={(day) =>
                                startDate ? dayjs(day).isBefore(disableEndDate) : true // startDate가 있는 경우에만 이전 날짜를 비활성화
                            }
                        />
                    </div>
                </LocalizationProvider>

                <div className={'homework-text-area'}>
                    <TextareaAutosize
                        minRows={3}
                        maxRows={8}
                        aria-valuetext={'숙제내용'}
                        placeholder={'학생에게 줄 숙제 내용을 작성해주세요.' +
                            '\n수학 익힘책 : 39p~41p'}
                        onChange={homeworkTextChangeHandler}
                        style={{width:'100%', resize: 'none'}}

                    />
                </div>
            </div>
            <div className='right-container'></div>
        </div>
    )
}
