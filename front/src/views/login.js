import React from "react";
import LoginForm from "./ui/LoginForm";

const About = () => {
    return (
      <div>
        <h2>로그인 창임</h2>
        {/* Other content */}
        <LoginForm
          setCurrentPageTitle={() => {}}
          setSaveIDFlag={() => {}}
          saveIDFlag={false}
          setPasswordOption={() => {}}
          passwordOption={false}
        />
      </div>
    );
  };
  
  export default About;