import {Button, Nav, NavItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import user1 from "assets/image/users/user4.jpg";
import probg from "assets/image/bg/download.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLoginUserStore} from 'stores';
import defautltProfileImage from 'assets/image/default-profile-image.png'
import {
    BOARD_LIST,
    CHAT_LIST,
    HOMEWORK_LIST,
    LIKE_LIST,
    MATCHED_STUDENT_LIST,
    TEACHER_APPLY_LIST,
    TEACHER_LIST
} from "constant";
import React, {useState, useEffect} from "react";


const defaultNavigation = [
    {
        title: "공부인증 게시판",
        href: BOARD_LIST(),
        icon: "bi bi-speedometer2",
    },
    {
        title: "선생님 목록",
        href: TEACHER_LIST(),
        icon: "bi bi-bell",
    },
    {
        title: "신청 내역",
        href: TEACHER_APPLY_LIST(),
        icon: "bi bi-patch-check",
    },
    {
        title: "채팅",
        href: CHAT_LIST(),
        icon: "bi bi-bell",
    }

];

const Sidebar = () => {
    // state : 유저 로그인 상태
    const {loginUser, resetLoginUser} = useLoginUserStore();
    const [navigation, setNavigation] = useState(defaultNavigation);
    const [isTeacher, setIsTeacher] = useState(false);
    const showMobilemenu = () => {
        let {userId} = null;
        if (!loginUser) {
            userId = '';
        } else {
            userId = loginUser.userId;

            // if (loginUser.userType === 'TEACHER') {
            //     setIsTeacher(true);
            // }
        }

        document.getElementById("sidebarArea").classList.toggle("showSidebar");
    };

    useEffect( () => {
        if(!loginUser){
            return;
        }
        setNavigation(prevNavigation => [
            ...prevNavigation,
            {
                title: "좋아요 목록",
                href: LIKE_LIST(loginUser.userId), // 동적으로 생성된 URL 사용
                icon: "bi bi-heart",
            }
        ]);
        if (loginUser.userType === 'TEACHER') {
            setNavigation(prevNavigation => [
                ...prevNavigation,
                {
                    title: "관리중인 학생",
                    href: MATCHED_STUDENT_LIST(loginUser.userId),
                    icon: "bi bi-speedometer2",
                }
            ]);
        }else{
            setNavigation(prevNavigation => [
                ...prevNavigation,
                {
                    title: "숙제 및 과외 확인",
                    href: HOMEWORK_LIST(loginUser.userId),
                    icon: "bi bi-speedometer2",
                }
            ]);
        }

    },[loginUser])

    // useEffect(() => {
    //     if (isTeacher) {
    //
    //     } else {
    //
    //     }
    // }, [isTeacher]);
    let location = useLocation();
    return (
        <div style={{width: '250px', minHeight: '680px'}}>
            <div className="d-flex align-items-center"></div>
            <div
                className="profilebg"
                style={{background: `url(${probg}) no-repeat`}}
            >
                <div className="p-3 d-flex">

                    <img src={loginUser && loginUser.profileImage ? loginUser.profileImage : defautltProfileImage}
                         alt="user" width="50" className="rounded-circle"/>


                    <Button
                        color="white"
                        className="ms-auto text-white d-lg-none"
                        onClick={() => showMobilemenu()}
                    >
                        <i className="bi bi-x"></i>
                    </Button>
                </div>
                <div className="bg-dark text-white p-2 opacity-75" style={{textAlign: 'center'}}>
                    {loginUser ? (loginUser.userId ? loginUser.userId : "로그인") : "로그인 후 이용해주세요."}
                </div>


            </div>
            <div className="p-3 mt-2">
                <Nav vertical className="sidebarNav">
                    {navigation.map((navi, index) => (
                        <NavItem key={index} className="sidenav-bg">
                            <Link
                                to={navi.href}
                                className={
                                    location.pathname === navi.href
                                        ? "active nav-link py-3"
                                        : "nav-link text-secondary py-3"
                                }
                            >
                                <i className={navi.icon}></i>
                                <span className="ms-3 d-inline-block">{navi.title}</span>
                            </Link>
                        </NavItem>
                    ))}
                </Nav>
            </div>
        </div>
    );
};

export default Sidebar;
