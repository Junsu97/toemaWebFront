import TeacherListItem from "../../../components/TeacherItem";
import {useNavigate} from "react-router-dom";
import {usePagination} from "../../../hooks";
import {TeacherListItemInterface} from "../../../types/interface";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import * as React from "react";
import {useEffect, useState} from "react";
import GetTeacherListResponseDTO from "../../../apis/response/teacher/get-teacher-list-response.dto";
import {ResponseDto} from "../../../apis/response";
import Pagenation from "../../../components/Pagination";
import './style.css';
import {getApplyBeforeRequest, getTeacherListRequest} from "../../../apis";
import loginUserStore from "../../../stores/login-user.store";
import {useCookies} from "react-cookie";
import {GetApplyBeforeResponseDTO} from "../../../apis/response/teacher";
import {createTheme} from "@mui/material/styles";

interface CheckedSubjects {
    korean: boolean;
    math: boolean;
    social: boolean;
    science: boolean;
    english: boolean;
}

interface SelectedSubjects {
    sub1: string | null;
    sub2: string | null;
    sub3: string | null;
    sub4: string | null;
    sub5: string | null;
}

const theme = createTheme({
    components: {
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    marginRight: ''
                },
            },
        },
    },
});
export default function TeacherList() {
    const {loginUser} = loginUserStore();
    const [cookies] = useCookies();
    const [checkedSubjects, setCheckedSubjects] = useState<CheckedSubjects>({
        korean: false,
        math: false,
        social: false,
        science: false,
        english: false
    });

    const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>({
        sub1: null,
        sub2: null,
        sub3: null,
        sub4: null,
        sub5: null,
    });
    const onSubjectCheckBoxChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;

        // 체크박스 상태 업데이트
        setCheckedSubjects(prev => ({
            ...prev,
            [name]: checked
        }));

        // 선택된 과목 업데이트
        updateSelectedSubjects(name, checked);
    };

    const updateSelectedSubjects = (subjectName: string, isChecked: boolean) => {
        // 선택된 과목 배열 생성
        const updatedSelectedSubjects = Object.entries(checkedSubjects)
            .filter(([key, value]) => key === subjectName ? isChecked : value)
            .map(([key]) => key);

        // 새로운 선택된 과목 객체 초기화
        const newSelectedSubjects: SelectedSubjects = {sub1: null, sub2: null, sub3: null, sub4: null, sub5: null};

        updatedSelectedSubjects.slice(0, 5).forEach((subject, index) => {
            // 타입 단언을 사용하여 TypeScript에게 속성 이름이 SelectedSubjects 타입의 키 중 하나임을 알림
            const key = `sub${index + 1}` as keyof SelectedSubjects;
            newSelectedSubjects[key] = subject;
        });

        setSelectedSubjects(newSelectedSubjects);
    };


    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<TeacherListItemInterface>(12);

    // function : navigate 함수
    const navigate = useNavigate();
    const getTeacherListResponse = (responseBody: GetTeacherListResponseDTO | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        const {teacherList} = responseBody as GetTeacherListResponseDTO;
        setTotalList(teacherList);
    }

    // const getApplyBeforeResponse = (responseBody: GetApplyBeforeResponseDto | ResponseDto | null) => {
    //     if(!responseBody) return;
    //     const {code} = responseBody;
    //     if(code === 'DBE') alert('데이터베이스 오류입니다.');
    //     if(code === 'DA') {
    //         alert('선생님 신청은 한 ')
    //     }
    // }
    useEffect(() => {
        getTeacherListRequest(selectedSubjects.sub1, selectedSubjects.sub2, selectedSubjects.sub3, selectedSubjects.sub4, selectedSubjects.sub5).then(getTeacherListResponse);
    }, [selectedSubjects]);
    useEffect(() => {
        getTeacherListRequest(selectedSubjects.sub1, selectedSubjects.sub2, selectedSubjects.sub3, selectedSubjects.sub4, selectedSubjects.sub5).then(getTeacherListResponse);
        // if(loginUser){
        //     if(loginUser.userType === 'STUDENT'){
        //         const accessToken = cookies.accessToken;
        //         if(!accessToken) return;
        //         getApplyBeforeRequest(accessToken).then(getApplyBeforeResponse);
        //     }
        // }

    }, []);

    return (
        <div className='wrapper'>
            <div style={{width: '100%'}}>
                <div className='title'>{'신청 가능한 선생님 목록'}</div>
                <div className='contentBox'>
                    <div className='formLabelBox' >

                        <FormControlLabel control={<Checkbox name={'korean'}
                                                             onChange={onSubjectCheckBoxChangeHandler}/>}
                                          label={'국어'}
                                          sx={{
                                              width: '130px',
                                              minWidth: '130px',
                                              maxWidth: '130px',
                                              marginRight: '0px'
                                          }}
                                          style={{marginRight: '0px'}}/>
                        <FormControlLabel control={<Checkbox name={'math'}
                                                             onChange={onSubjectCheckBoxChangeHandler}/>}
                                          label={'수학'}
                                          sx={{width: '130px', minWidth: '130px', maxWidth: '130px'}}
                                          style={{marginRight: '0px'}}/>
                        <FormControlLabel control={<Checkbox name={'social'}
                                                             onChange={onSubjectCheckBoxChangeHandler}/>}
                                          label={'사회'}
                                          sx={{
                                              width: '130px',
                                              minWidth: '130px',
                                              maxWidth: '130px',
                                              marginRight: '0px'
                                          }}
                                          style={{marginRight: '0px'}}/>
                        <FormControlLabel control={<Checkbox name={'science'}
                                                             onChange={onSubjectCheckBoxChangeHandler}/>}
                                          label={'과학'}
                                          sx={{
                                              width: '130px',
                                              minWidth: '130px',
                                              maxWidth: '130px',
                                              marginRight: '0px'
                                          }}
                                          style={{marginRight: '0px'}}/>
                        <FormControlLabel control={<Checkbox name={'english'}
                                                             onChange={onSubjectCheckBoxChangeHandler}/>}
                                          label={'영어'}
                                          sx={{
                                              width: '130px',
                                              minWidth: '130px',
                                              maxWidth: '130px',
                                              marginRight: '0px'
                                          }}
                                          style={{marginRight: '0px'}}/>
                    </div>
                    <div className='container'>
                        {viewList.map(teacherListItem => <TeacherListItem
                            teacherListItem={teacherListItem}></TeacherListItem>)}
                    </div>
                    <div><div className='list-bottom-pagination-box'>
                        <Pagenation
                            currentPage={currentPage}
                            currentSection={currentSection}
                            setCurrentPage={setCurrentPage}
                            setCurrentSection={setCurrentSection}
                            viewPageList={viewPageList}
                            totalSection={totalSection}/>
                    </div></div>
                </div>
            </div>
        </div>
    )
}