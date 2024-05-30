import './style.css';
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import Calendar from "react-calendar";
import CalenderItem from "../../components/Calender";
import {DateCalendar, DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


export default function Homework() {
    const {teacherUserID,studentUserId} = useParams();
    useEffect(() => {

    }, []);
    return (
        <div className={'wrapper'}>
            <div className={'container'}>
                <CalenderItem></CalenderItem>
            </div>
        </div>
    )
}