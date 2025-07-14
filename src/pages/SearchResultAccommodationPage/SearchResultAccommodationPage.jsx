import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./SearchResultAccommodationPage.style.css";
import bannerImage from "../../images/SearchImage/SearchBackground.png";
import host from '../../host.js';
import axios from 'axios';

function SearchResultAccommodationPage() {
  //const [allRestaurants, setAllRestaurants] = useState([]);
  const { sido, sigungu } = useParams();
  const location = `${sido} ${sigungu}`;
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //페이지네이션 수정
  const [totalCount,setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const area = decodeURIComponent(location || "");
  const area_type = "숙소";

  const fetchData = useCallback(() => {
    setLoading(true);
    axios.get(`${host}/public`, {
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        page: currentPage,
        pageSize: itemsPerPage,
        type: area_type,
        sido,
        sigungu
      }
    })
        .then(r => {
          setFilteredAccommodations(r.data.items);
          setTotalPages(r.data.totalPages);
          setLoading(false);
          setTotalCount(r.data.totalCount);
        })
        .catch(e => {
          alert('잘못된 요청입니다.');
          setLoading(false);
        });
  }, [currentPage, itemsPerPage, area_type, sido, sigungu]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
      <div className="searchresult-page">
        <div className="searchresult-banner">
          <img src={bannerImage} alt="지역 배너" className="searchresult-banner-image" />
          <div className="searchresult-banner-overlay">
            <div className="searchresult-banner-content">
              <h1 className="searchresult-banner-title">{decodeURIComponent(location || "")}</h1>
              <p className="searchresult-banner-subtitle">에서 가장 인기 있는 숙소만 모아봤어요.</p>
            </div>
          </div>
        </div>

        <div className="searchresult-container">
          <div className="searchresult-header">
            <h2 className="searchresult-title">
              <span className="searchresult-highlight">'{decodeURIComponent(location || "")}'</span>{" "}
              검색 결과 {totalCount}개
            </h2>
          </div>

          <div className="searchresult-content">
            <div className="searchresult-list">
              {isLoading ? (
                  <div className="searchresult-no-items"><p>검색중 입니다..</p></div>
              ) : filteredAccommodations.length > 0 ? (
                  <>
                    {filteredAccommodations.map((accommodation) => (
                        <div key={accommodation.id} className="searchresult-item">
                          <div className="searchresult-item-image">
                            {accommodation.images ? (
                                <img src={accommodation.images} alt={accommodation.name}
                                     className="searchresult-item-img"/>
                            ) : (
                                <div className="searchresult-placeholder-image">
                                  <span>이미지 준비중</span>
                                </div>
                            )}
                          </div>
                          <div className="searchresult-item-info">
                            <div className="searchresult-item-header">
                              <h3 className="searchresult-item-name">{accommodation.name}</h3>
                              <div className="searchresult-item-rating">
                                <span className="searchresult-item-location">{accommodation.location}</span>
                              </div>
                              <p className="searchresult-item-address">{accommodation.address}</p>
                              <p className="searchresult-item-type">{accommodation.type}</p>
                            </div>
                          </div>
                        </div>
                    ))}

                    <div className="searchresult-pagination">
                      <button
                          className="searchresult-pagination-button"
                          onClick={goToFirstPage}
                          disabled={currentPage === 1}
                      >
                        &lt;&lt;
                      </button>
                      <button
                          className="searchresult-pagination-button"
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                      >
                        &lt;
                      </button>

                      {Array.from({length: 5}, (_, i) => {
                        const start = Math.max(1, currentPage - 2);
                        const end = Math.min(totalPages, start + 4);
                        const pageNum = start + i;

                        return pageNum <= end ? (
                            <button
                                key={pageNum}
                                className={`searchresult-pagination-button ${
                                    pageNum === currentPage ? "active" : ""
                                }`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                        ) : null;
                      })}

                      <button
                          className="searchresult-pagination-button"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                      >
                        &gt;
                      </button>
                      <button
                          className="searchresult-pagination-button"
                          onClick={goToLastPage}
                          disabled={currentPage === totalPages}
                      >
                        &gt;&gt;
                      </button>
                    </div>


                  </>
              ) : (
                  <div className="searchresult-no-items">
                    <p>검색 결과가 없습니다. 다른 필터 조건을 선택해보세요.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default SearchResultAccommodationPage;
