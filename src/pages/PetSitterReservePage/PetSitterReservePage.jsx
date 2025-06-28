import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import regionData from "../../korea_region/reference_json.json";
import reverseRegionData from "../../korea_region/reverse_json.json"
import "./PetSitterReservePage.style.css";
import axios from 'axios';
import url from '../../defImages'
import host from '../../host';


const PetSitterReservePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const [sigunguCode, setSigunguCode] = useState("");
  const [petSitters, setPetSitters] = useState([]);
  const [isSearched,setIsSearched] = useState(0);

  useEffect(() => {
  axios.get(`${host}/ps`)
    .then((r) => {
      const shuffled = r.data.sort(() => 0.5 - Math.random()); 
      const selected = shuffled.slice(0, 3);
      setPetSitters(selected);
    })
    .catch((e) => {
      console.log("내부 서버에서 오류 발생");
    });
}, []);


  const locations = ["없음", "픽업", "대형견", "노견", "산책"];

  function getRegionName(code) {
    const region = reverseRegionData[code];
    if (region) {
      return `${region.sido} ${region.sigungu}`;
    } else {
      return "알수없음";
    }
  }

  const handleSidoChange = (e) => {
    const sido = e.target.value;
    setSelectedSido(sido);
    setSelectedSigungu("");
    setSigunguCode("");
  };

  const handleSigunguChange = (e) => {
    const sigungu = e.target.value;
    setSelectedSigungu(sigungu);

    // 시군구에 포함된 읍면동 중 첫 번째 항목의 코드 기준으로 시군구 코드 추출
    const firstDong = regionData[selectedSido][sigungu][0];
    const code = firstDong.code.slice(0, 5); // 앞 5자리 = 시군구 코드
    setSigunguCode(code);
  };

  const handleSitterClick = (sitterId) => {
    navigate(`/petsitter/${sitterId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const handleSubmit = () => {
    axios.get(`${host}/ps/rg/${sigunguCode}`)
      .then((r) => {
        console.log(r);
        setPetSitters(r.data);
        setIsSearched(1);
      })
      .catch((e) => {
        console.log("내부 서버에서 오류 발생")
      });
  }

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
        <div className="province-city-container">
          <div className="province-city-dropdown">
            <select value={selectedSido} onChange={handleSidoChange}>
              <option value="">시/도 선택</option>
              {Object.keys(regionData).map((sido) => (
                <option key={sido} value={sido}>{sido}</option>
              ))}
            </select>

            <select value={selectedSigungu} onChange={handleSigunguChange} disabled={!selectedSido}>
              <option value="">시/군/구 선택</option>
              {selectedSido &&
                Object.keys(regionData[selectedSido]).map((sigungu) => (
                  <option key={sigungu} value={sigungu}>{sigungu}</option>
                ))}
            </select>
          </div>
          <div className="province-city-sumbit">
            <button className="province-city-sumbit-button"
              onClick={handleSubmit}>펫시터 검색</button>
          </div>
        </div>

        

        <div className="petsitter-separator"></div>

        <div className="petsitter-list-section">
          <div className="petsitter-list-header">
            <h3 className="petsitter-favorite-title">{isSearched ? "검색결과" : "추천"}</h3>
          </div>

          <div className="petsitter-grid">
            {petSitters.map((sitter) => (
              <div
                key={sitter.id}
                className="petsitter-card"
                onClick={() => handleSitterClick(sitter.id)}
              >
                <div className="petsitter-image-container">
                  <img
                    src={ sitter.img ? `${host}/${sitter.img}` : url.defaultPostUrl}
                    alt={sitter.title}
                    className="petsitter-image"
                  />
                </div>
                <div className="petsitter-card-content">
                  <div className="petsitter-info">
                    <div className="petsitter-location">{getRegionName(sitter.location)}</div>
                    <div className="petsitter-title">{sitter.user_name}</div>
                    <div className="petsitter-description">
                      {sitter.intro}
                    </div>
                  </div>
                  <div className="petsitter-price-row">
                    <div className="petsitter-price-item">
                      <div className="petsitter-price-label">1일</div>
                      <div className="petsitter-price">{
                        sitter.dayCost ? (
                          `${sitter.dayCost}원`
                        ) : (
                          "불가"
                        )
                      }
                      </div>
                    </div>
                    <div className="petsitter-price-item">
                      <div className="petsitter-price-label">1시간(소형)</div>
                      <div className="petsitter-price">
                        $ {sitter.smallCost}원
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
