import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./SearchPage.style.css";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "accommodation";
  const [searchType, setSearchType] = useState(initialType);
  const [location, setLocation] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((term) => term !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    saveSearch(location);

    if (searchType === "accommodation") {
      navigate(`/search/accommodation/${encodeURIComponent(location)}`);
    } else {
      navigate(`/search/restaurant/${encodeURIComponent(location)}`);
    }
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
  };

  const handleRecentSearchClick = (term) => {
    setLocation(term);
    setShowRecentSearches(false);
    setTimeout(() => {
      if (searchType === "accommodation") {
        navigate(`/search/accommodation/${encodeURIComponent(term)}`);
      } else {
        navigate(`/search/restaurant/${encodeURIComponent(term)}`);
      }
    }, 100);
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
            </div>
          </div>

          {showRecentSearches && recentSearches.length > 0 && (
            <div className="searchpage-recent-container">
              <h3 className="searchpage-recent-title">최근 검색어</h3>
              <ul className="searchpage-recent-list">
                {recentSearches.map((term, index) => (
                  <li
                    key={index}
                    className="searchpage-recent-item"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <span className="searchpage-clock-icon">⌚</span> {term}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="searchpage-type-container">
            <div className="searchpage-type-selector">
              <button
                className={`searchpage-type-button ${
                  searchType === "accommodation" ? "active" : ""
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
                className={`searchpage-type-button ${
                  searchType === "restaurant" ? "active" : ""
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
