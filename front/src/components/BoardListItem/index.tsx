import React from 'react'
import './style.css';
//  Component: Board List Item 컴포넌트     //
export default function BoardListItem() {


//  render: Board List Item 컴포넌트 렌더링
  return (
    <div className='board-list-name'>
        <div className='board-list-item-main-box'>
            <div className='board-list-item-top'>
                <div className='board-list-item-profile-box'>
                    <div className='board-list-item-profile-image' style={{backgroundImage: 'url(https://img.khan.co.kr/news/2023/03/16/khan_ZTBGzy.webp)'}}></div>
                </div>
                <div className='boadr-list-item-writer-box'>
                    <div className='board-list-nickname'>{'안녕하세요나는주코야끼'}</div>
                    <div className='board-list-item-write-datetime'>{'2024-03-01'}</div>
                </div>
            </div>
            <div className='board-list-item-middle'>
                <div className='board-list-item-title'>{'출근하기 싫다 알바가기 싫다'}</div>
                <div className='board-list-item-content'>{'알바가기 싫다. 쉬고싶다알바가기 싫다. 쉬고싶다알바가기 싫다. 쉬고싶다알바가기 싫다. 쉬고싶다알바가기 싫다. 쉬고싶다알바가기 싫다. 쉬고싶다알바가기 싫다. 쉬고싶다'}</div>

            </div>
            <div className='board-list-item-bottom'>
                <div className='board-list-item-counts'>{'댓글 0 / 좋아요 0 / 조회수 0'}</div>
            </div>
        </div>
        <div className='board-list-item-image-box'>
            <div className='board-list-item-image' style={{backgroundImage:'url(https://img.hankyung.com/photo/202101/PRU20210127108501055_P4.jpg)'}}></div>
        </div>
    </div>
  )
}
