import './style.css';
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import Calendar from "react-calendar";
import CalenderItem from "../../components/Calender/homework";
import {DateCalendar, DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import * as React from "react";


export default function Homework() {
    const {teacherUserID, studentUserId} = useParams();
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