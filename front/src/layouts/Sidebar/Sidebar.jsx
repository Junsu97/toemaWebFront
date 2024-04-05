import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user1 from "assets/image/users/user4.jpg";
import probg from "assets/image/bg/download.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLoginUserStore } from 'stores';
import defautltProfileImage from 'assets/image/default-profile-image.png'


const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Alert",
    href: "/alerts",
    icon: "bi bi-bell",
  },
  {
    title: "Badges",
    href: "/badges",
    icon: "bi bi-patch-check",
  },
  {
    title: "Buttons",
    href: "/buttons",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Cards",
    href: "/cards",
    icon: "bi bi-card-text",
  },
  {
    title: "Grid",
    href: "/grid",
    icon: "bi bi-columns",
  },
  {
    title: "Table",
    href: "/table",
    icon: "bi bi-layout-split",
  },
  {
    title: "Forms",
    href: "/forms",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Breadcrumbs",
    href: "/breadcrumbs",
    icon: "bi bi-link",
  },
];

const Sidebar = () => {
  // state : 유저 로그인 상태
  const { loginUser,resetLoginUser } = useLoginUserStore();
  const showMobilemenu = () => {
    let { userId } = null;
    if (!loginUser) { userId = ''; }
    else {
      userId = loginUser.userId;
    }

    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();
  return (
    <div style={{ width: '250px' }}>
      <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat` }}
      >
        <div className="p-3 d-flex">

          <img src={loginUser && loginUser.profileImage ? loginUser.profileImage : defautltProfileImage} alt="user" width="50" className="rounded-circle" />


          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        <div className="bg-dark text-white p-2 opacity-75" style={{ textAlign: 'center' }}>
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
