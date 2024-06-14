import React, { useEffect, useState } from "react";
import {
    DateCalendar,
    LocalizationProvider,
    PickersDay,
    PickersDayProps,
} from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import Modal from "react-modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useNavigate } from "react-router-dom";
import {
    getHomeworkListStudentRequest,
    getTutoringListFromStudentRequest,
} from "../../apis";
import {
    GetHomeworkListResponseDto,
} from "../../apis/response/homework";
import { GetTutoringListResponseDTO } from "../../apis/response/tutoring";
import loginUserStore from "../../stores/login-user.store";
import { AUTH_PATH } from "../../constant";
import "./style.css";
import HomeworkListItemInterface from "../../types/interface/homework-list-item.interface";
import TutoringListItemInterface from "../../types/interface/tutoring-list-item.interface";
import {usePagination} from "../../hooks";
import {ResponseDto} from "../../apis/response";
import DateInfo from "./date-info";
import HomeworkList from "../Homework";
import './../Homework/style.css'
import TutoringList from "../Tutoring";

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
    ".MuiDateCalendar-root": {
        height: "30vh", // 높이를 부모 컨테이너에 맞춤
        maxHeight: "650px",
    },
    ".MuiDayCalendar-header > span": {
        flex: 1,
        textAlign: "center",
        fontSize: "1rem",
    },
    ".MuiPickersCalendarHeader-root": {
        height: "70px",
        maxHeight: "70px",
    },
    ".MuiPickersCalendarHeader-label": {
        maxHeight: "30px",
    },
    ".MuiDateCalendar-viewTransitionContainer": {
        maxHeight: "600px",
        height: "600px",
    },
    ".MuiDateCalendar-viewTransitionContainer > div": {
        maxHeight: "600px",
        height: "600px",
    },
    ".MuiDayCalendar-header > span:first-of-type": {
        color: "red",
    },
    ".MuiDayCalendar-header > span:nth-of-type(7)": {
        color: "blue",
    },
    ".MuiPickersDay-root": {
        width: "calc(100% / 7)", // 셀의 너비를 7열에 맞춤
        height: "auto",
        fontSize: "1rem",
    },
    ".MuiButtonBase-root": {
        width: "calc(100% / 7)", // 버튼 셀의 너비를 7열에 맞춤
        height: "10vh",
        borderRadius: "0%",
        fontSize: "1rem",
    },
    ".MuiTypography-root": {
        fontSize: "1rem",
    },
}));

Modal.setAppElement("#root"); // 모달 사용 시 접근성을 위한 설정

export default function HomeworkTutoring() {
    const today = dayjs(); // 오늘의 날짜 가져오기
    const [homeworkList, setHomeworkList] = useState<HomeworkListItemInterface[]>([]);
    const [tutoringList, setTutoringList] = useState<TutoringListItemInterface[]>([]);
    const { studentUserId } = useParams();
    const { loginUser } = loginUserStore();
    const navigate = useNavigate();
    const [selectedDateInfo, setSelectedDateInfo] = useState<DateInfo | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const {
        currentPage,
        currentSection,
        viewList,
        viewPageList,
        totalSection,
        setCurrentPage,
        setCurrentSection,
        setTotalList,
    } = usePagination<HomeworkListItemInterface>(3);

    const getHomeworkListStudentResponse = (
        responseBody: GetHomeworkListResponseDto | ResponseDto | null
    ) => {
        if (!responseBody) {
            alert("서버로부터 데이터를 불러올 수 없습니다.");
            return;
        }
        const { code } = responseBody;
        if (code === "NU" || code === "NM") {
            alert("잘못된 요청입니다.");
            return;
        }
        if (code === "NH") {
            return;
        }
        if (code === "DBE") {
            alert("데이터베이스 에러입니다.");
            return;
        }
        if (code !== "SU") {
            alert("숙제 정보를 불러오는 중 알 수 없는 에러가 발생했습니다.");
            return;
        }

        const { homeworkList } = responseBody as GetHomeworkListResponseDto;
        setHomeworkList(homeworkList);
    };

    const getTutoringListFromStudentResponse = (
        responseBody: GetTutoringListResponseDTO | ResponseDto | null
    ) => {
        if (!responseBody) {
            alert("서버로부터 데이터를 불러올 수 없습니다.");
            return;
        }
        const { code } = responseBody;
        if (code === "NU" || code === "NM") {
            alert("잘못된 요청입니다.");
            return;
        }
        if (code === "NT") {
            return;
        }
        if (code === "DBE") {
            alert("데이터베이스 에러입니다.");
            return;
        }
        if (code !== "SU") {
            alert("과외 일정을 불러오는 중 알 수 없는 에러가 발생했습니다.");
            return;
        }

        const { tutoringList } = responseBody as GetTutoringListResponseDTO;
        setTutoringList(tutoringList);
    };

    useEffect(() => {
        if (!loginUser || loginUser.userId !== (studentUserId as string)) {
            alert("비정상적인 접근입니다.");
            navigate(AUTH_PATH());
            return;
        }
        getHomeworkListStudentRequest(studentUserId as string).then(
            getHomeworkListStudentResponse
        );
        getTutoringListFromStudentRequest(studentUserId as string).then(
            getTutoringListFromStudentResponse
        );
    }, []);

    const openModal = (dateInfo: DateInfo) => {
        setSelectedDateInfo(dateInfo);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedDateInfo(null);
    };

    const renderDay = (props: PickersDayProps<Dayjs>) => {
        const { day, ...DayComponentProps } = props;
        const formattedDay = day.format("YYYY-MM-DD");

        // Find all homeworks for the day
        const homeworksForDay = homeworkList.filter((hw) =>
            day.isSame(hw.endDate, "day")
        );

        // Find tutorings for the day
        const tutoringsForDay = tutoringList.filter((tw) =>
            day.isSame(tw.tutoringDate, "day")
        );

        // Determine background color based on the presence of homeworks and tutorings
        let backgroundColor;
        //
        if (homeworksForDay.length > 0 && tutoringsForDay.length > 0) {
            backgroundColor = "#D4ADFC"; // 보라색 for both
        } else if (homeworksForDay.length > 0) {
            backgroundColor = "#61A4BC"; // 파란색 for homework only
        } else if (tutoringsForDay.length > 0) {
            backgroundColor = "#8294C4"; // 빨간색 for tutoring only
        }

        return (
            <PickersDay
                {...DayComponentProps}
                day={day}
                onClick={() =>
                    openModal({ date: day, homeworks: homeworksForDay, tutorings: tutoringsForDay })
                }
                style={{
                    backgroundColor:
                        backgroundColor ||
                        (homeworksForDay.length === 1
                            ? "#adc8e6" // First color for single homework
                            : homeworksForDay.length > 1
                                ? "#5b627d" // Second color for overlapping homeworks
                                : undefined),
                }}
            />
        );
    };

    return (
        <div className="student-calendar-container">
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                dateFormats={{ monthShort: "M" }}
            >
                <StyledDateCalendar
                    defaultValue={today}
                    sx={{ width: "90%", height: "100vh" }}
                    slots={{ day: renderDay }}
                />
            </LocalizationProvider>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Date Info"
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        maxHeight: "60vh",
                        overflow: "auto"
                    },
                }}
            >
                {selectedDateInfo && (
                    <div>
                        <h2 className={'modal-in-date'}>{selectedDateInfo.date.format("YYYY-MM-DD")}</h2>
                        <h3 className={'modal-in-title'}>Homework</h3>
                        {selectedDateInfo.homeworks.length > 0 ? (
                            <>
                                {selectedDateInfo.homeworks.map((hw, index) => (
                                    <HomeworkList key={index} homeworkListItem={hw}/>
                                ))}
                            </>
                        ) : (
                            <p>No homework</p>
                        )}
                        <h3 className={'modal-in-title'}>Tutoring</h3>
                        {selectedDateInfo.tutorings.length > 0 ? (
                            <>
                                {selectedDateInfo.tutorings.map((tw, index) => (
                                   <TutoringList key={index} tutoringListItem={tw}></TutoringList>
                                ))}
                            </>
                        ) : (
                            <p>No tutoring</p>
                        )}
                        <button className={'black-button'} onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
