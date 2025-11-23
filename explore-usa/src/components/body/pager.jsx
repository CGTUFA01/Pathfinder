import React from 'react'
import {Pagination} from 'flowbite-react';
export default function Pager({currentPage, setCurrentPage,length}) {

    function handlePageChange(page) {
        setCurrentPage(page);
      }

    return (
        <div className="pagination-wrapper">
        <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={length} showIcons lightmode/>
        </div>
    )
}