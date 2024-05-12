import React, {useState} from 'react';
import defautltProfileImage from 'assets/image/default-profile-image.png'
import './style.css'
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {TeacherListItemInterface} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import {TEACHER_APPLY} from "../../constant";



interface Props{
    teacherListItem: TeacherListItemInterface
}

const maxLength = 30;
const TeacherListItem = ({teacherListItem} : Props) => {
    const{userId, profileImage, school,korean, math, social, science, english, desc} = teacherListItem;
    const shortenedDesc = desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;

    //  function : 네비게이트 함수
    const navigator = useNavigate();
    const onClickHandler = () => {
        navigator(TEACHER_APPLY(userId));
    }
    return (
        <section id="profile-cards">
            <div className="card-item">
                <div className="description">
                    <h2> {userId} </h2>
                    <div>
                    <p className={'desc'}>{shortenedDesc}</p>
                    </div>
                    <span className="role"> {school} </span>
                    <div style={{alignItems: 'center',display:'contents', justifyContent: 'space-evenly', width: '50%'}}>
                        <FormControlLabel control={<Checkbox name={'korean'} disabled={true} checked={korean}/>}
                                          label={'국어'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px'}}/>
                        <FormControlLabel control={<Checkbox name={'math'} disabled={true} checked={math}/>}
                                          label={'수학'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px'}}/>
                        <FormControlLabel control={<Checkbox name={'social'} disabled={true} checked={social}/>}
                                          label={'사회'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px'}}/>
                        <FormControlLabel control={<Checkbox name={'science'} disabled={true} checked={science}/>}
                                          label={'과학'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px'}}/>
                        <FormControlLabel control={<Checkbox name={'english'} disabled={true} checked={english}/>}
                                          label={'영어'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px'}}/>
                    </div>
                </div>

                <div className="image">
                    {/* 이미지 경로는 프로젝트 구조에 따라 다를 수 있습니다 */}
                    <div className={'image-div'} style={{
                        backgroundImage: `url(${profileImage? profileImage : defautltProfileImage})`
                    }}></div>
                    <div style={{width: '100%', alignItems: 'center', marginLeft:'25px'}} onClick={onClickHandler}>
                        <div className={'black-button'} >신청하기</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeacherListItem;
