import React, {useState} from 'react';
import defautltProfileImage from 'assets/image/default-profile-image.png'
import './style.css'
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {TeacherListItemInterface} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import { TEACHER_INFO} from "../../constant";


interface Props {
    teacherListItem: TeacherListItemInterface
}

const maxLength = 30;
const TeacherListItem = ({teacherListItem}: Props) => {
    const {userId, profileImage, school, korean, math, social, science, english, desc} = teacherListItem;
    const shortenedDesc = desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;

    //  function : 네비게이트 함수
    const navigator = useNavigate();
    const onClickHandler = () => {
        navigator(TEACHER_INFO(userId));
    }

    return (
        <>
            <div className="content">
                <div className="card">
                    <div className="firstinfo">
                        <img src={profileImage ? profileImage : defautltProfileImage} alt="Profile Image"  />
                        <div className="profileinfo">
                            <h1 className="userId" onClick={onClickHandler}>{userId}</h1>
                            <h3>{school}</h3>
                            <p className="bio">{shortenedDesc}</p>
                        </div>
                    </div>
                </div>
                <div className="badgescard">
                    <div style={{
                        marginLeft: '50%',
                        alignItems: 'center',
                        display: 'contents',
                        justifyContent: 'space-evenly',
                        width: '550px',
                        height:'150px',
                    }}>
                        <FormControlLabel control={<Checkbox name={'korean'} disabled={true} checked={korean}/>}
                                          label={'국어'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px', marginRight:'0px'}}/>
                        <FormControlLabel control={<Checkbox name={'math'} disabled={true} checked={math}/>}
                                          label={'수학'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px', marginRight:'0px'}}/>
                        <FormControlLabel control={<Checkbox name={'social'} disabled={true} checked={social}/>}
                                          label={'사회'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px', marginRight:'0px'}}/>
                        <FormControlLabel control={<Checkbox name={'science'} disabled={true} checked={science}/>}
                                          label={'과학'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px', marginRight:'0px'}}/>
                        <FormControlLabel control={<Checkbox name={'english'} disabled={true} checked={english}/>}
                                          label={'영어'}
                                          sx={{width: '100px', minWidth: '100px', maxWidth: '100px', marginRight:'0px'}}/>
                    </div>
                    {/*</span>*/}
                </div>
            </div>

        </>
    );
};

export default TeacherListItem;
