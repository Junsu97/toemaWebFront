import { AUTH_PATH, NOT_FOUND_PATH } from 'constant';
import Footer from 'layouts/Footer'
import Header from 'layouts/Header'
import Sidebar from 'layouts/Sidebar/Sidebar'
import React from 'react'
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "reactstrap";



export default function FullLayOout() {
  const { pathname } = useLocation();

  return (
    <>
      {/********header**********/}
      <Header />
      <div className="pageWrapper d-lg-flex" style={{ width: '100%' }} >

        {/********Sidebar**********/}
        {pathname !== AUTH_PATH() && pathname !== NOT_FOUND_PATH() &&
          <aside className="sidebarArea shadow" id="sidebarArea">
            <Sidebar />

          </aside>
        }
        <Outlet />

        {/* *******Content Area********* */}
        {pathname !== AUTH_PATH() && pathname !== NOT_FOUND_PATH() &&(
          <div className="contentArea">
            {/********Middle Content**********/}
            <Container className="p-4" fluid>
              {/* 내용을 추가하세요 */}
            </Container>
          </div>
        )}

       {/*<div className="contentArea">*/}


          {/********Middle Content**********/}
         {/*<Container className="p-4" fluid>*/ } 

          {/*</Container>*/ }

        {/*</div>*/}

      </div>
      {pathname !== AUTH_PATH() && <Footer />}

    </>
  )
}
