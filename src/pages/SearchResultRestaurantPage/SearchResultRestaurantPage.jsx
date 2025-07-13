import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./SearchResultRestaurantPage.style.css";
import bannerImage from "../../images/SearchImage/SearchBackground.png";
import host from "../../host.js";
import axios from 'axios';

function SearchResultRestaurantPage() {
  const { sido, sigungu } = useParams();
  const location = `${sido} ${sigungu}`;
  const area = decodeURIComponent(location || "");
  const area_type = "맛집";

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const [filters, setFilters] = useState({
    petExclusive: false,
    foodType: [],
  });

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
          setRestaurants(r.data.items);
          setTotalPages(r.data.totalPages);
          setLoading(false);
        })
        .catch(e => {
          alert('잘못된 요청입니다.');
          setLoading(false);
        });
  }, [currentPage, itemsPerPage, area_type, sido, sigungu]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRestaurants = restaurants.filter((item) => {
    if (filters.petExclusive && item.petFriendly) return false;
    if (filters.foodType.length > 0 && !filters.foodType.some(type => item.foodType.includes(type))) return false;
    return true;
  });

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (category === "petExclusive") {
        updatedFilters.petExclusive = !prev.petExclusive;
      } else {
        if (updatedFilters[category].includes(value)) {
          updatedFilters[category] = updatedFilters[category].filter(
              (item) => item !== value
          );
        } else {
          updatedFilters[category] = [...updatedFilters[category], value];
        }
      }
      return updatedFilters;
    });
    setCurrentPage(1);
  };

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
              <h1 className="searchresult-banner-title">{area}</h1>
              <p className="searchresult-banner-subtitle">에서 가장 인기있는 맛집만 모아봤어요.</p>
            </div>
          </div>
        </div>

        <div className="searchresult-container">
          <div className="searchresult-header">
            <h2 className="searchresult-title">
              <span className="searchresult-highlight">'{area}'</span> 검색 결과 {filteredRestaurants.length}개
            </h2>
          </div>

          <div className="searchresult-content">
            <div className="searchresult-sidebar">
              <div className="searchresult-filter">
                <h3 className="searchresult-filter-title">필터</h3>
                {["한식", "중식", "일식", "양식", "카페", "오마카세"].map((type) => (
                    <label key={type} className="searchresult-filter-label">
                      <input
                          type="checkbox"
                          checked={filters.foodType.includes(type)}
                          onChange={() => handleFilterChange("foodType", type)}
                      />
                      {type}
                    </label>
                ))}
                <button className="searchresult-filter-button" onClick={() => setCurrentPage(1)}>필터 적용</button>
              </div>
            </div>

            <div className="searchresult-list">
              {isLoading ? (
                  <div className="searchresult-no-items"><p>검색중 입니다..</p></div>
              ) : filteredRestaurants.length > 0 ? (
                  <>
                    {filteredRestaurants.map((restaurant) => (
                        <div key={restaurant.id} className="searchresult-item">
                          <div className="searchresult-item-image">
                            {restaurant.images ? (
                                <img src={restaurant.images} alt={restaurant.name} className="searchresult-item-img"/>
                            ) : (
                                <div className="searchresult-placeholder-image"><span>이미지 준비중</span></div>
                            )}
                          </div>
                          <div className="searchresult-item-info">
                            <h3 className="searchresult-item-name">{restaurant.name}</h3>
                            <div className="searchresult-item-rating">
                              <span className="searchresult-item-stars">⭐</span>
                              <span className="searchresult-item-rating-score">{restaurant.rating}</span>
                              <span className="searchresult-item-review-count">({restaurant.reviewCount})</span>
                              <span className="searchresult-item-location"> · {restaurant.location}</span>
                            </div>
                            <p className="searchresult-item-address">{restaurant.address}</p>
                            <p className="searchresult-item-type">{restaurant.type}</p>
                            <p className="searchresult-item-main-menu">{restaurant.mainMenu}</p>
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

export default SearchResultRestaurantPage;
