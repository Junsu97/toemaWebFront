import TeacherListItem from "../../../components/TeacherItem";
import {useNavigate} from "react-router-dom";
import {usePagination} from "../../../hooks";
import {TeacherListItemInterface} from "../../../types/interface";

export default function TeacherList(){

    // function : navigate 함수
    const navigate = useNavigate();
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<TeacherListItemInterface>(12);

    const getTeacherListResponse = ()
    return(
        <>
            <TeacherListItem teacherListItem={}></TeacherListItem>
        </>
    )
}