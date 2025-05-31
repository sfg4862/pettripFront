import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./SearchResultRestaurantPage.style.css";
import bannerImage from "../../images/SearchImage/SearchBackground.png";
import host from "../../host.js";
import axios from 'axios';



const RESTAURANT_DATA = [
  {
    id: 1,
    name: "배고파",
    rating: 4.5,
    reviewCount: 310,
    location: "서울 서초구",
    address: "프라임관에서 도보 3분컷",
    images:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
    petFriendly: true,
    type: "양식",
    foodType: ["양식"],
    mainMenu: "치킨 · 피자",
  },
];

function SearchResultRestaurantPage() {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const { location } = useParams();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading,setLoading] = useState(1);
  const [filters, setFilters] = useState({
    petExclusive: false,
    foodType: [],
  });

  const area = decodeURIComponent(location || "");
  const area_type = "맛집";
  const page = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios.get(`${host}/public`, {
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        page,
        type: area_type,
        area
      }
    })
        .then(r => {
          setAllRestaurants(r.data);  
          setFilteredRestaurants(r.data);
          setLoading(0);
        })
        .catch(e => {
          alert('잘못된 요청입니다.');
        });
  }, []);

    
  const applyFilters = useCallback(() => {
    let filtered = [...allRestaurants];

    if (filters.petExclusive) {
      filtered = filtered.filter((item) => !item.petFriendly);
    }

    if (filters.foodType.length > 0) {
      filtered = filtered.filter((item) =>
        filters.foodType.some((type) => item.foodType.includes(type))
      );
    }

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [filters,allRestaurants]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="searchresult-page">
      <div className="searchresult-banner">
        <img
          src={bannerImage}
          alt="지역 배너"
          className="searchresult-banner-image"
        />
        <div className="searchresult-banner-overlay">
          <div className="searchresult-banner-content">
            <h1 className="searchresult-banner-title">
              {decodeURIComponent(location || "")}
            </h1>
            <p className="searchresult-banner-subtitle">
              에서 가장 인기있는 맛집만 모아봤어요.
            </p>
          </div>
        </div>
      </div>

      <div className="searchresult-container">
        <div className="searchresult-header">
          <h2 className="searchresult-title">
            <span className="searchresult-highlight">
              '{decodeURIComponent(location || "")}'
            </span>{" "}
            검색 결과 {filteredRestaurants.length}개
          </h2>
        </div>

        <div className="searchresult-content">
          <div className="searchresult-sidebar">
            <div className="searchresult-filter">
              <h3 className="searchresult-filter-title">필터</h3>
              <div className="searchresult-filter-group">
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.foodType.includes("한식")}
                    onChange={() => handleFilterChange("foodType", "한식")}
                  />
                  한식
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.foodType.includes("중식")}
                    onChange={() => handleFilterChange("foodType", "중식")}
                  />
                  중식
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.foodType.includes("일식")}
                    onChange={() => handleFilterChange("foodType", "일식")}
                  />
                  일식
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.foodType.includes("양식")}
                    onChange={() => handleFilterChange("foodType", "양식")}
                  />
                  양식
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.foodType.includes("카페")}
                    onChange={() => handleFilterChange("foodType", "카페")}
                  />
                  카페/디저트
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.foodType.includes("오마카세")}
                    onChange={() => handleFilterChange("foodType", "오마카세")}
                  />
                  오마카세
                </label>
              </div>

              <button
                className="searchresult-filter-button"
                onClick={applyFilters}
              >
                필터 적용
              </button>
            </div>
          </div>

          <div className="searchresult-list">
            {currentItems.length > 0 ? (
              <>
                {currentItems.map((restaurant) => (
                  <div key={restaurant.id} className="searchresult-item">
                    <div className="searchresult-item-image">
                      {restaurant.images ? (
                        <img
                          src={restaurant.images}
                          alt={restaurant.name}
                          className="searchresult-item-img"
                        />
                      ) : (
                        <div className="searchresult-placeholder-image">
                          <span>이미지 준비중</span>
                        </div>
                      )}
                    </div>
                    <div className="searchresult-item-info">
                      <div className="searchresult-item-header">
                        <h3 className="searchresult-item-name">
                          {restaurant.name}
                        </h3>
                        <div className="searchresult-item-rating">
                          <span className="searchresult-item-stars">⭐</span>
                          <span className="searchresult-item-rating-score">
                            {restaurant.rating}
                          </span>
                          <span className="searchresult-item-review-count">
                            ({restaurant.reviewCount})
                          </span>
                          <span className="searchresult-item-location">
                            {" "}
                            · {restaurant.location}
                          </span>
                        </div>
                        <p className="searchresult-item-address">
                          {restaurant.address}
                        </p>
                        <p className="searchresult-item-type">
                          {restaurant.type} 
                          {restaurant.foodType ? (restaurant.foodType.map((type, idx) => (
                            <span
                              key={idx}
                              className="searchresult-item-food-type"
                            >
                              {idx > 0 ? ", " : " "}
                              {type}
                            </span>
                          ))): ''}
                        </p>
                        <p className="searchresult-item-main-menu">
                          {restaurant.mainMenu}
                        </p>
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

                  <span className="searchresult-pagination-current">
                    {currentPage}
                  </span>

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
            ) : (isLoading ? (
              <div className="searchresult-no-items">
                <p>검색중 입니다..</p>
              </div>
            ) : (
              <div className="searchresult-no-items">
                <p>검색 결과가 없습니다. 다른 필터 조건을 선택해보세요.</p>
              </div>
            )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultRestaurantPage;
