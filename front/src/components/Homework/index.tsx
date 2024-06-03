import React from "react";
import './style.css';

export default function HomeworkList() {
    return (
        <div id={'homework'}>
            <div className={'homework-wrapper'}>
                <div className={'content-date-container'}>
                    <div className={'content-date'}>2024-06-03</div>
                    <div className={'content-date'}>2024-06-05</div>
                </div>
                <div className={'homework-content'}>dddd</div>
                <div className={'button-box'}>
                    <div className={'black-button'}>{'삭제하기'}</div>
                </div>
            </div>
        </div>
    )
}