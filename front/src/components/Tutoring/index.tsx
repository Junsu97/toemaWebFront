import Modal from "react-modal";
import React, {useState} from "react";
import TutoringListItemInterface from "../../types/interface/tutoring-list-item.interface";
import {useCookies} from "react-cookie";
import loginUserStore from "../../stores/login-user.store";
import CalendarModal from "../Calender/calendarmodal";

interface Props{
    tutoringListItem : TutoringListItemInterface;
}
export default function TutoringList({tutoringListItem}: Props){
    const [isOpen, setOpen] = useState<boolean>(false);
    const {seq, studentId, teacherId, tutoringDate, tutoringSubject, tutoringStartTime, tutoringEndTime} = tutoringListItem;
    const blank = '\u00A0';


    return(
        <div id="homework">
            <div className="homework-wrapper">
                <div className="content-date-container">
                    {tutoringDate}{blank}:{blank}{tutoringStartTime}{blank}~{blank}{tutoringStartTime}
                    {/*<div className="content-date">{startDate}</div>*/}
                    {/*<div className="content-date">{endDate}</div>*/}
                </div>
                <div className="homework-content">{tutoringSubject}</div>
                <div className="button-box">

                </div>
            </div>
        </div>
    )
}