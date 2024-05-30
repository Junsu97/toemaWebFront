import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage: number) => {
    const [totalList, setTotalList] = useState<T[]>([]);
    const [viewList, setViewList] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [totalSection, setTotalSection] = useState<number>(1);

    const setView = () => {
        const FIRST_INDEX = countPerPage * (currentPage - 1);
        const LAST_INDEX = Math.min(totalList.length, countPerPage * currentPage);
        const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);
        setViewList(viewList);
    };

    const setViewPage = () => {
        const FIRST_INDEX = 10 * (currentSection - 1);
        const LAST_INDEX = Math.min(totalPageList.length, 10 * currentSection);
        const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
        setViewPageList(viewPageList);
    };

    useEffect(() => {
        const totalPage = Math.ceil(totalList.length / countPerPage);
        const totalPageList = Array.from({ length: totalPage }, (_, i) => i + 1);
        setTotalPageList(totalPageList);

        const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
        setTotalSection(totalSection);
        setCurrentPage(1);
        setCurrentSection(1);
    }, [totalList]);

    useEffect(setView, [currentPage, totalList]);
    useEffect(setViewPage, [currentSection, totalPageList]);

    return {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    };
};

export default usePagination;
