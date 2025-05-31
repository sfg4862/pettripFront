import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./PetSitterDetail.style.css";

const PetSitterDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("시간별");
  const [expanded, setExpanded] = useState(false);

  const petSitter = {
    id: id,
    name: "김또밍 펫시터님",
    location: "전북 익산시",
    description: "반려동물과 함께하는 행복한 시간을 만들어 드립니다",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1470&auto=format&fit=crop",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.5,
    reviewCount: 24,
    keywords: ["언제나", "편리하게", "케어해요", "효자동"],
    introduction:
      "안녕하세요. 김또밍 펫시터입니다. 저는 5년째 반려견과 함께 생활하고 있으며, 반려동물 관련 자격증을 보유하고 있습니다. 모든 케어는 반려동물의 안전과 행복을 최우선으로 생각하며 진행됩니다. 저와 함께라면 반려동물들이 즐겁고 편안한 시간을 보낼 수 있습니다. 맡겨주시는 아이들의 성격과 습관을 존중하며 케어해 드립니다. 간식 및 음식 알러지 여부, 특별한 케어가 필요한 부분은 미리 알려주시면 최대한 배려하겠습니다. 아이들의 안전을 위해 실내에서는 미끄럼 방지 매트를 깔아두었으며, 위험한 물건들은 모두 제거했습니다. 펫시터 경력 3년 이상으로 다양한 반려동물들을 케어해 왔습니다.",
    petImages: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1743&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1915&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1374&auto=format&fit=crop",
    ],
    pets: [
      {
        name: "김아리",
        age: "2세",
        image:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1743&auto=format&fit=crop",
        info: ["고양이", "CAT"],
        description:
          "늘 사랑스럽고 활발한 성격의 고양이입니다. 장난감 놀이를 좋아하며 특히 깃털 장난감에 푹 빠져있어요. 다른 고양이들과도 잘 어울리고 사람들에게도 친근하게 다가갑니다.",
      },
    ],
    prices: {
      small: { hour: 60000, day: 70000 },
      medium: { hour: 60000, day: 70000 },
      large: { hour: 60000, day: 70000 },
    },
    additionalServices: [
      { name: "반려동물 추가", price: 60000 },
      { name: "공원놀이/산책", price: 60000 },
      { name: "노견/노묘", price: 60000 },
    ],
    availability: {
      "2025-01": {
        available: [4, 5, 6, 7, 14, 15, 16, 17],
        partially: [18, 19],
      },
    },
    comments: [
      "안전하고 편안한 환경에서 케어해 드립니다.",
      "반려동물의 특성과 성격에 맞춰 맞춤형 케어를 제공합니다.",
      "정기적인 실시간 사진과 동영상으로 상황을 공유해 드립니다.",
      "급한 용무가 있으실 경우 유연하게 대응 가능합니다.",
      "반려동물의 건강 상태를 항상 체크하고 있습니다.",
      "깨끗하고 위생적인 환경을 유지하고 있습니다.",
    ],
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="petsitter-detail-star-filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="petsitter-detail-star-half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="petsitter-detail-star-empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  const generateCalendarGrid = () => {
    const daysInMonth = 31;
    const firstDayOfMonth = 3;

    const days = [];
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    weekdays.forEach((day) => {
      days.push(
        <div
          key={`weekday-${day}`}
          className="petsitter-detail-calendar-weekday"
        >
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="petsitter-detail-calendar-day empty"
        ></div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      let dayClass = "petsitter-detail-calendar-day";

      if (petSitter.availability["2025-01"].available.includes(i)) {
        dayClass += " available";
      } else if (petSitter.availability["2025-01"].partially.includes(i)) {
        dayClass += " partially";
      }

      days.push(
        <div key={`day-${i}`} className={dayClass}>
          {i}
        </div>
      );
    }

    return days;
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="petsitter-detail-container">
      <div className="petsitter-detail-content">
        <div className="petsitter-detail-gallery">
          <div className="petsitter-detail-gallery-full">
            <img src={petSitter.image} alt="Pet sitter's home" />
          </div>
          <button className="petsitter-detail-gallery-more">
            더보기 사진 보기
          </button>
        </div>

        <div className="petsitter-detail-main">
          <div className="petsitter-detail-left-column">
            <section className="petsitter-detail-profile">
              <div className="petsitter-detail-profile-image">
                <img src={petSitter.profileImage} alt={petSitter.name} />
              </div>
              <div className="petsitter-detail-profile-info">
                <h2 className="petsitter-detail-profile-title">
                  {petSitter.location}: {petSitter.name}
                </h2>
                <p className="petsitter-detail-profile-description">
                  {petSitter.description}
                </p>
                <p className="petsitter-detail-profile-disclaimer">
                  {petSitter.keywords.map((keyword, index) => (
                    <span key={index}>#{keyword} </span>
                  ))}
                </p>
              </div>
            </section>

            <section className="petsitter-detail-intro">
              <h3 className="petsitter-detail-section-title">소개합니다</h3>
              <p
                className={`petsitter-detail-intro-text ${
                  expanded ? "expanded" : ""
                }`}
              >
                {petSitter.introduction}
              </p>
              {petSitter.introduction.length > 150 && (
                <button
                  className="petsitter-detail-intro-toggle"
                  onClick={toggleExpand}
                >
                  {expanded ? "접기" : "더보기"}
                </button>
              )}
            </section>

            <section className="petsitter-detail-pets">
              {petSitter.pets.map((pet, index) => (
                <div key={index} className="petsitter-detail-pet">
                  <div className="petsitter-detail-pet-header">
                    <h3 className="petsitter-detail-pet-name">
                      {pet.name} · {pet.age}
                    </h3>
                    {pet.info.map((info, idx) => (
                      <p key={idx} className="petsitter-detail-pet-meta">
                        {info}
                      </p>
                    ))}
                  </div>
                  <div className="petsitter-detail-pet-images">
                    <img src={pet.image} alt={pet.name} />
                    <img src={pet.image} alt={pet.name} />
                    <img src={pet.image} alt={pet.name} />
                  </div>
                </div>
              ))}
            </section>

            <section className="petsitter-detail-reviews">
              <h3 className="petsitter-detail-section-title">
                고객 후기 {renderStars(petSitter.rating)} (
                {petSitter.reviewCount})
              </h3>
              <div className="petsitter-detail-review-images">
                {petSitter.petImages.map((image, index) => (
                  <div key={index} className="petsitter-detail-review-image">
                    <img src={image} alt={`Pet review ${index + 1}`} />
                    {index === petSitter.petImages.length - 1 && (
                      <div className="petsitter-detail-review-image-overlay">
                        <span>+15</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="petsitter-detail-comments">
              <div className="petsitter-detail-comment-profile">
                <img src={petSitter.profileImage} alt={petSitter.name} />
              </div>
              <div className="petsitter-detail-comment-content">
                <h3 className="petsitter-detail-comment-title">
                  펫시터님의 댓글
                </h3>
                {petSitter.comments.map((comment, index) => (
                  <p key={index} className="petsitter-detail-comment-text">
                    {comment}
                  </p>
                ))}
              </div>
            </section>

            <div className="petsitter-detail-more-button">
              <button>페이지 좀더 보기 ↓</button>
            </div>
          </div>

          <div className="petsitter-detail-right-column">
            <div className="petsitter-detail-reservation">
              <div className="petsitter-detail-reservation-header">
                <h3 className="petsitter-detail-reservation-title">
                  언제 펫시터가 필요하시나요?
                </h3>

                <div className="petsitter-detail-time-tabs">
                  <button
                    className={`petsitter-detail-tab ${
                      activeTab === "시간별" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("시간별")}
                  >
                    시간별
                  </button>
                  <button
                    className={`petsitter-detail-tab ${
                      activeTab === "종일권" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("종일권")}
                  >
                    종일권
                  </button>
                </div>

                <div className="petsitter-detail-time-container">
                  <div className="petsitter-detail-time-column">
                    <div className="petsitter-detail-time-label">시작 시간</div>
                    <div className="petsitter-detail-time-select">
                      <select>
                        <option value="">시간 선택</option>
                        <option value="08:00">오전 8시</option>
                        <option value="09:00">오전 9시</option>
                        <option value="10:00">오전 10시</option>
                        <option value="11:00">오전 11시</option>
                        <option value="12:00">오후 12시</option>
                        <option value="13:00">오후 1시</option>
                        <option value="14:00">오후 2시</option>
                        <option value="15:00">오후 3시</option>
                        <option value="16:00">오후 4시</option>
                        <option value="17:00">오후 5시</option>
                        <option value="18:00">오후 6시</option>
                        <option value="19:00">오후 7시</option>
                        <option value="20:00">오후 8시</option>
                      </select>
                    </div>
                  </div>

                  <div className="petsitter-detail-time-column">
                    <div className="petsitter-detail-time-label">종료 시간</div>
                    <div className="petsitter-detail-time-select">
                      <select>
                        <option value="">시간 선택</option>
                        <option value="10:00">오전 10시</option>
                        <option value="11:00">오전 11시</option>
                        <option value="12:00">오후 12시</option>
                        <option value="13:00">오후 1시</option>
                        <option value="14:00">오후 2시</option>
                        <option value="15:00">오후 3시</option>
                        <option value="16:00">오후 4시</option>
                        <option value="17:00">오후 5시</option>
                        <option value="18:00">오후 6시</option>
                        <option value="19:00">오후 7시</option>
                        <option value="20:00">오후 8시</option>
                        <option value="21:00">오후 9시</option>
                        <option value="22:00">오후 10시</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="petsitter-detail-pet-select">
                  <select>
                    <option>반려동물 선택</option>
                    <option>소형견</option>
                    <option>중형견</option>
                    <option>대형견</option>
                    <option>고양이</option>
                  </select>
                </div>

                <div className="petsitter-detail-price-section">
                  <h3 className="petsitter-detail-section-title">이용 금액</h3>
                  <div className="petsitter-detail-price-list">
                    <div className="petsitter-detail-price-item">
                      <div className="petsitter-detail-price-pet">
                        <span className="petsitter-detail-price-icon">🐕</span>
                        소형견
                      </div>
                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.prices.small.hour.toLocaleString()}
                      </div>
                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.prices.small.day.toLocaleString()}
                      </div>
                    </div>
                    <div className="petsitter-detail-price-item">
                      <div className="petsitter-detail-price-pet">
                        <span className="petsitter-detail-price-icon">🐕</span>
                        중형견
                      </div>
                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.prices.medium.hour.toLocaleString()}
                      </div>
                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.prices.medium.day.toLocaleString()}
                      </div>
                    </div>
                    <div className="petsitter-detail-price-item">
                      <div className="petsitter-detail-price-pet">
                        <span className="petsitter-detail-price-icon">🐕</span>
                        대형견
                      </div>
                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.prices.large.hour.toLocaleString()}
                      </div>
                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.prices.large.day.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="petsitter-detail-services-section">
                  <h3 className="petsitter-detail-section-title">추가 금액</h3>
                  <div className="petsitter-detail-services-list">
                    {petSitter.additionalServices.map((service, index) => (
                      <div
                        key={index}
                        className="petsitter-detail-service-item"
                      >
                        <div className="petsitter-detail-service-name">
                          {service.name}
                        </div>
                        <div className="petsitter-detail-service-price">
                          $ {service.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="petsitter-detail-calendar-section">
                  <h3 className="petsitter-detail-section-title">
                    예약 가능 날짜
                  </h3>
                  <div className="petsitter-detail-calendar-nav">
                    <button className="petsitter-detail-calendar-nav-btn">
                      &lt;
                    </button>
                    <div className="petsitter-detail-calendar-month">
                      2025 01월
                    </div>
                    <button className="petsitter-detail-calendar-nav-btn">
                      &gt;
                    </button>
                  </div>

                  <div className="petsitter-detail-calendar-grid">
                    {generateCalendarGrid()}
                  </div>

                  <div className="petsitter-detail-calendar-legend">
                    <div className="petsitter-detail-legend-item">
                      <div className="petsitter-detail-legend-color available"></div>
                      <div className="petsitter-detail-legend-text">
                        예약가능
                      </div>
                    </div>
                    <div className="petsitter-detail-legend-item">
                      <div className="petsitter-detail-legend-color partially"></div>
                      <div className="petsitter-detail-legend-text">
                        예약불가
                      </div>
                    </div>
                  </div>
                </div>

                <button className="petsitter-detail-reserve-button">
                  예약 하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSitterDetail;
