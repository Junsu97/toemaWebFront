import '../Board/List/style.css';
import BoardListItem from "../../components/BoarListItem";
import Pagenation from "../../components/Pagination";
import React, {useEffect} from "react";
import {usePagination} from "../../hooks";
import {BoardListDTO} from "../../types/interface";
import NewsListDTO from "../../types/interface/news-list-item.interface";
import NewsListItem from "../../components/NewsListItem";
import GetNewsListResponseDTO from "../../apis/response/news/get-news-list.response.dto";
import {ResponseDto} from "../../apis/response";
import {getNewsListRequest} from "../../apis";
export default function NewsList(){
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection,
        setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<NewsListDTO>(8);

    const getNewsListResponse = (responseBody: GetNewsListResponseDTO | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;

        const {crawlingList} = responseBody as GetNewsListResponseDTO;
        setTotalList(crawlingList);
    }

    useEffect(() => {
        getNewsListRequest().then(getNewsListResponse);
    }, []);

    return (
        <div id='list-bottom-wrapper' style={{height:'2000px'}}>
            <div className='list-bottom-container' style={{height:'1800px', gap:'0%'}}>
                <div className='list-bottom-title'>{'학생 신문'}</div>
                <div className='list-bottom-contents-box'>
                    <div className='list-bottom-current-contents'>
                        {viewList.map(newsListItem => <NewsListItem newsListItem={newsListItem} />)}
                    </div>
                </div>
                <div>
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