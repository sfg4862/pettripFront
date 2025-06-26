import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./SearchResultAccommodationPage.style.css";
import bannerImage from "../../images/SearchImage/SearchBackground.png";
import host from '../../host.js';
import axios from 'axios';

const ACCOMMODATION_DATA = [
  {
    id: 1,
    name: "더 베스트 애견 펜션",
    rating: 4.8,
    reviewCount: 142,
    location: "서울 서초구",
    address: "서울 서초구 방배동",
    images:
      "https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=600&auto=format&fit=crop",
    petFriendly: true,
    type: "펜션",
    petType: ["소형견", "중형견"],
    price: 150000,
  },
];

function SearchResultAccommodationPage() {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const { sido, sigungu } = useParams();
  const location = `${sido} ${sigungu}`;
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [isLoading,setLoading] = useState(1);
  const [filters, setFilters] = useState({
    petExclusive: false,
    accommodationType: [],
    petType: [],
  });
  const area = decodeURIComponent(location || "");
  const area_type = "숙소";
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
        sido: sido,
        sigungu: sigungu
      }
    })
        .then(r => {
          setFilteredAccommodations(r.data);
          setAllRestaurants(r.data);
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

    if (filters.accommodationType.length > 0) {
      filtered = filtered.filter((item) =>
        filters.accommodationType.includes(item.type)
      );
    }

    if (filters.petType.length > 0) {
      filtered = filtered.filter((item) =>
        filters.petType.some((petType) => item.petType.includes(petType))
      );
    }

    setFilteredAccommodations(filtered);
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
  const currentItems = filteredAccommodations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAccommodations.length / itemsPerPage);

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
              에서 가장 인기 있는 숙소만 모아봤어요.
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
            검색 결과 {filteredAccommodations.length}개
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
                    checked={filters.petExclusive}
                    onChange={() => handleFilterChange("petExclusive")}
                  />
                  애견 숙소 제외
                </label>
              </div>

              <h3 className="searchresult-filter-title">숙소 유형</h3>
              <div className="searchresult-filter-group">
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.accommodationType.includes("모텔")}
                    onChange={() =>
                      handleFilterChange("accommodationType", "모텔")
                    }
                  />
                  모텔
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.accommodationType.includes("호텔리조트")}
                    onChange={() =>
                      handleFilterChange("accommodationType", "호텔리조트")
                    }
                  />
                  호텔리조트
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.accommodationType.includes("펜션")}
                    onChange={() =>
                      handleFilterChange("accommodationType", "펜션")
                    }
                  />
                  펜션
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.accommodationType.includes("캠핑")}
                    onChange={() =>
                      handleFilterChange("accommodationType", "캠핑")
                    }
                  />
                  캠핑
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.accommodationType.includes("게하·한옥")}
                    onChange={() =>
                      handleFilterChange("accommodationType", "게하·한옥")
                    }
                  />
                  게하·한옥
                </label>
              </div>

              <h3 className="searchresult-filter-title">건중 유형</h3>
              <div className="searchresult-filter-group">
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.petType.includes("대형견")}
                    onChange={() => handleFilterChange("petType", "대형견")}
                  />
                  대형견
                </label>
                <label className="searchresult-filter-label">
                  <input
                    type="checkbox"
                    checked={filters.petType.includes("노견")}
                    onChange={() => handleFilterChange("petType", "노견")}
                  />
                  노견
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
                {currentItems.map((accommodation) => (
                  <div key={accommodation.id} className="searchresult-item">
                    <div className="searchresult-item-image">
                      {accommodation.images ? (
                        <img
                          src={accommodation.images}
                          alt={accommodation.name}
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
                          {accommodation.name}
                        </h3>
                        <div className="searchresult-item-rating">
                          <span className="searchresult-item-stars">⭐</span>
                          <span className="searchresult-item-rating-score">
                            {accommodation.rating}
                          </span>
                          <span className="searchresult-item-review-count">
                            ({accommodation.reviewCount})
                          </span>
                          <span className="searchresult-item-location">
                            {" "}
                            · {accommodation.location}
                          </span>
                        </div>
                        <p className="searchresult-item-address">
                          {accommodation.address}
                        </p>
                        <p className="searchresult-item-type">
                          {accommodation.type} ·
                          {accommodation.petType.map((type, idx) => (
                            <span
                              key={idx}
                              className="searchresult-item-pet-type"
                            >
                              {idx > 0 ? ", " : " "}
                              {type}
                            </span>
                          ))}
                        </p>
                        <p className="searchresult-item-price">
                          ₩{accommodation.price.toLocaleString()}원 / 1박
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

export default SearchResultAccommodationPage;
