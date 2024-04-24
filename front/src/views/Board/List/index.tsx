import React, { useEffect } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';

export default function BoardList() {
  const [cookies, setCookie] = useCookies();

  const accessToken = cookies.accessToken;
  return (

    <div>
      게시글 리스트
    </div>
  )
}
