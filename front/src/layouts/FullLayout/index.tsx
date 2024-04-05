import { AUTH_PATH } from 'constant';
import Footer from 'layouts/Footer'
import Header from 'layouts/Header'
import Sidebar from 'layouts/Sidebar/Sidebar'
import React from 'react'
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "reactstrap";


export default function FullLayOout() {
  const {pathname} = useLocation();

  return (
    <main>
      {/********header**********/}
      <Header />
      <div className="pageWrapper d-lg-flex" >
     
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        <Outlet />
  
        {/********Content Area**********/}
        <div className="contentArea">
          
        
          {/********Middle Content**********/}
          <Container className="p-4" fluid>
          
          </Container>
          
        </div>
        
      </div>
      {pathname !== AUTH_PATH() && <Footer/>}
     
    </main>
  )
}
