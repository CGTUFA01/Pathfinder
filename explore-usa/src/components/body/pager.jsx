import React from 'react'
import {Pagination} from 'flowbite-react';
export default function Pager({currentPage, setCurrentPage,length}) {

    function handlePageChange(page) {
        setCurrentPage(page);
      }

    return (
        <div className=" flex overflow-x-auto sm:justify-center">
        <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={length} showIcons lightmode/>
        </div>
    )
}