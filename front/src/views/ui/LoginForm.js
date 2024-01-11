import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // 실제로는 서버로 요청을 보내서 로그인 처리를 해야합니다.
    // 여기에서는 간단히 사용자명이 "user"이고 비밀번호가 "password"인 경우에만 로그인 성공으로 간주합니다.
    if (username === "user" && password === "password") {
      setLoggedIn(true);
      alert("로그인 성공!");
    } else {
      alert("로그인 실패. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <p>안녕하세요, {username}님!</p>
          <button onClick={() => setLoggedIn(false)}>로그아웃</button>
        </div>
      ) : (
        <div>
          <label>
            아이디:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
