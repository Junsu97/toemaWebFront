import BoardListItem from "../../../components/BoarListItem";
import Pagenation from "../../../components/Pagination";
import React from "react";
import {usePagination} from "../../../hooks";
import {BoardListDTO} from "../../../types/interface";

export default function ApplyList(){

    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<BoardListDTO>(10);
    return(
        <div id='list-bottom-wrapper'>
            <div className='list-bottom-container'>
                <div className='list-bottom-title'>{'최신 게시물'}</div>
                <div className='list-bottom-contents-box'>
                    <div className='list-bottom-current-contents'>
                        {viewList.map(boardListItem => <BoardListItem boardListItem={boardListItem} />)}
                    </div>
                    <div>
                    </div>

                    <div className='list-bottom-pagination-box'>
                        <Pagenation
                            currentPage={currentPage}
                            currentSection={currentSection}
                            setCurrentPage={setCurrentPage}
                            setCurrentSection={setCurrentSection}
                            viewPageList={viewPageList}
                            totalSection={totalSection} />
                    </div>
                </div>
            </div>
        </div>
    )
}
