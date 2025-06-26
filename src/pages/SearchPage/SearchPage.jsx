import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./SearchPage.style.css";
import regionData from "../../korea_region/reference_json.json";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "accommodation";
  const [searchType, setSearchType] = useState(initialType);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
  }, []);



  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedSido.trim() || !selectedSido.trim()) return;

    if (searchType === "accommodation") {
      navigate(`/search/accommodation/${encodeURIComponent(selectedSido)}/${encodeURIComponent(selectedSigungu)}`);
    } else {
      navigate(`/search/restaurant/${encodeURIComponent(selectedSido)}/${encodeURIComponent(selectedSigungu)}`);
    }
  };

  const handleSidoChange = (e) => {
    const sido = e.target.value;
    setSelectedSido(sido);
    setSelectedSigungu("전체");
  };

  const handleSigunguChange = (e) => {
    const sigungu = e.target.value;
    setSelectedSigungu(sigungu);
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
  };

  const handleInputFocus = () => {
    if (recentSearches.length > 0) {
      setShowRecentSearches(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowRecentSearches(false), 200);
  };

  return (
    <div className="searchpage">
      <div className="searchpage-content">
        <div className="searchpage-title-container">
          <h1 className="searchpage-title">
            AI가 해당 지역의
            <br />
            맞춤 숙소와 맛집을
            <br />
            찾아드립니다!
          </h1>
        </div>

        <div className="searchpage-search-container">
          <div className="searchpage-search-box">
            <div className="searchpage-search-input">
              {/*
              <span className="searchpage-search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#777"
                    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.5 6.5 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="가고싶은 여행지를 검색해 보세요."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <button
                className="searchpage-search-button"
                onClick={handleSearch}
              >
                검색
              </button>
              */}

              <div className="province-city-dropdown">
                <select value={selectedSido} onChange={handleSidoChange}>
                  <option value="">시/도 선택</option>
                  {Object.keys(regionData).map((sido) => (
                    <option key={sido} value={sido}>{sido}</option>
                  ))}
                </select>

                <select value={selectedSigungu} onChange={handleSigunguChange} disabled={!selectedSido}>
                  <option value="">시/군/구 선택</option>
                   <option key='all' value='전체'>전체</option>
                  {selectedSido &&
                    Object.keys(regionData[selectedSido]).map((sigungu) => (
                      <option key={sigungu} value={sigungu}>{sigungu}</option>
                    ))}
                </select>
              </div>
              <button onClick={handleSearch}>제출</button>
            </div>
          </div>

          <div className="searchpage-type-container">
            <div className="searchpage-type-selector">
              <button
                className={`searchpage-type-button ${searchType === "accommodation" ? "active" : ""
                  }`}
                onClick={() => handleTypeChange("accommodation")}
              >
                <div className="searchpage-type-icon">🏠</div>
                <span className="searchpage-type-text">숙소</span>
                {searchType === "accommodation" && (
                  <div className="searchpage-type-underline"></div>
                )}
              </button>
              <button
                className={`searchpage-type-button ${searchType === "restaurant" ? "active" : ""
                  }`}
                onClick={() => handleTypeChange("restaurant")}
              >
                <div className="searchpage-type-icon">🍽️</div>
                <span className="searchpage-type-text">맛집</span>
                {searchType === "restaurant" && (
                  <div className="searchpage-type-underline"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
