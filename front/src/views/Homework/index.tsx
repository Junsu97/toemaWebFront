import './style.css';
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Calendar from "react-calendar";
import CalenderItem from "../../components/Calender/homework";
import {DateCalendar, DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import * as React from "react";
import loginUserStore from "../../stores/login-user.store";
import {AUTH_PATH, MAIN_PATH} from "../../constant";
import {useCookies} from "react-cookie";


export default function Homework() {
    const {teacherUserId, studentUserId} = useParams();
    const {loginUser} = loginUserStore();
    const navigate = useNavigate();
    const [cookies] = useCookies();
    useEffect(() => {
        if(!loginUser){
            return;
        }
        if(!teacherUserId || !studentUserId || teacherUserId === '' || studentUserId === ''){
            alert('비정상적인 접근입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if(loginUser.userId !== teacherUserId || loginUser.userType !== 'TEACHER'){
            alert('비정상적인 접근입니다.')

            navigate(MAIN_PATH());
            return;
        }
    }, []);
    return (

        <div className={'wrapper'}>
            <div className={'container'}>
                <CalenderItem></CalenderItem>
            </div>
        </div>

    )
}