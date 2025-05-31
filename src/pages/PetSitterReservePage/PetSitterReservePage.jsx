import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PetSitterReservePage.style.css";

const PetSitterReservePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("없음");

  const petSitters = [
    {
      id: 1,
      location: "전북 익산시",
      title: "이름",
      description: "#이용가능한 #역세권 #여행중",
      image:
        "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1674&auto=format&fit=crop",
      rating: 5,
      reviewCount: 24,
      price: 60000,
    },
    {
      id: 2,
      location: "전북 익산시",
      title: "이름",
      description: "#이용가능한 #역세권 #여행중",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1374&auto=format&fit=crop",
      rating: 4.5,
      reviewCount: 18,
      price: 60000,
    },
    {
      id: 3,
      location: "전북 익산시",
      title: "이름",
      description: "#이용가능한 #역세권 #여행중",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1376&auto=format&fit=crop",
      rating: 4.8,
      reviewCount: 32,
      price: 60000,
    },
  ];

  const locations = ["없음", "픽업", "대형견", "노견", "산책"];

  const handleSitterClick = (sitterId) => {
    navigate(`/petsitter/${sitterId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const filteredSitters = petSitters.filter((sitter) => {
    return (
      (selectedLocation === "없음" ||
        sitter.description.includes(selectedLocation)) &&
      (searchTerm === "" ||
        sitter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sitter.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="petsitter-star-filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="petsitter-star-half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="petsitter-star-empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="pesitter-reserve-page">
      <div className="petsitter-hero-wrapper">
        <div className="petsitter-hero">
          <div className="petsitter-hero-content">
            <div className="petsitter-hero-title-container">
              <h1 className="petsitter-hero-title">
                <span className="petsitter-white-text">펫시터</span>를 찾아주는
                <br />
                친절한 예약
              </h1>
              <hr className="petsitter-hero-divider" />
            </div>
            <div className="petsitter-hero-subtitle-wrapper">
              <h2 className="petsitter-hero-subtitle-main">
                <span className="petsitter-white-text">안심 펫시터</span>
              </h2>
              <p className="petsitter-hero-subtitle">
                여행, 출장, 야근 시, 사랑하는 반려견을
                <br />
                주변 안심펫시터에게 맡기세요!
              </p>
            </div>
          </div>
          <div className="petsitter-hero-image"></div>
        </div>
      </div>

      <div className="petsitter-content-container">
        <div className="petsitter-search-section">
          <h3 className="petsitter-search-title">어디에 거주하시나요?</h3>
          <form className="petsitter-search-form" onSubmit={handleSearch}>
            <div className="petsitter-search-input-container">
              <span className="petsitter-search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="#999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="지역을 입력해주세요. (예. 모란동)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="petsitter-search-input"
              />
            </div>
          </form>
        </div>

        <div className="petsitter-location-filter-section">
          <h3 className="petsitter-filter-title">원하는 조건을 선택하세요.</h3>
          <div className="petsitter-location-buttons">
            {locations.map((location) => (
              <button
                key={location}
                className={`petsitter-location-button ${
                  selectedLocation === location ? "active" : ""
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        <div className="petsitter-separator"></div>

        <div className="petsitter-list-section">
          <div className="petsitter-list-header">
            <h3 className="petsitter-favorite-title">추천</h3>
          </div>

          <div className="petsitter-grid">
            {filteredSitters.map((sitter) => (
              <div
                key={sitter.id}
                className="petsitter-card"
                onClick={() => handleSitterClick(sitter.id)}
              >
                <div className="petsitter-image-container">
                  <img
                    src={sitter.image}
                    alt={sitter.title}
                    className="petsitter-image"
                  />
                </div>
                <div className="petsitter-card-content">
                  <div className="petsitter-info">
                    <div className="petsitter-location">{sitter.location}</div>
                    <div className="petsitter-title">{sitter.title}</div>
                    <div className="petsitter-description">
                      {sitter.description}
                    </div>
                    <div className="petsitter-rating">
                      <div className="petsitter-stars">
                        {renderStars(sitter.rating)}
                      </div>
                      <div className="petsitter-review-count">
                        평점 {sitter.reviewCount}개
                      </div>
                    </div>
                  </div>
                  <div className="petsitter-price-row">
                    <div className="petsitter-price-item">
                      <div className="petsitter-price-label">1일당</div>
                      <div className="petsitter-price">
                        $ {sitter.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="petsitter-price-item">
                      <div className="petsitter-price-label">2시간</div>
                      <div className="petsitter-price">
                        $ {sitter.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSitterReservePage;
