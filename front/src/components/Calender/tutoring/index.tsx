import {DateCalendar, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import './style.css';
import {styled} from '@mui/material/styles';
import dayjs from "dayjs";
import {useState} from "react";

const StyledDateCalendar = styled(DateCalendar)(({theme}) => ({
    '.MuiDayCalendar-header > span:first-of-type': {
        color: 'red',
    },
    '.MuiDayCalendar-header > span:nth-of-type(7)': {
        color: 'blue',
    },
}));

export default function tutoringCalendar(){
    const today = dayjs(); // 오늘의 날짜 가져오기
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
    return (
        <div className="calendar-container">
            <div className="left-container">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StyledDateCalendar
                        defaultValue={today}
                        onChange={(date) => handleDateChange(date)}
                    />

                </LocalizationProvider>

                <div className={'date-text'}>{selectDate}</div>
            </div>
            <div className='right-container'></div>
        </div>
    )
}