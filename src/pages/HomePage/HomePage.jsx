import React from "react";
import "../HomePage/HomePage.style.css";
import "../../fonts/Font.style.css";
import HomePageFeature1 from "../../images/HomepageImage/HomePageFeature1.png";
import HomePageFeature2 from "../../images/HomepageImage/HomePageFeature2.png";
import HomePageFeature3 from "../../images/HomepageImage/HomePageFeature3.png";
import AboutUsImage from "../../images/HomepageImage/AboutUsImage.png";
import HashTagImage1 from "../../images/HomepageImage/HashTagImage1.png";
import HashTagImage2 from "../../images/HomepageImage/HashTagImage2.png";

const Homepage = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Pet's Trip</h1>
            <p className="hero-subtitle">
              반려동물의 건강과 성장을
              <br />
              <span className="highlight">한눈에,</span> 쉽고
              <br />
              편리하게 관리하세요
            </p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-heading">Our Features</h2>
        <h3 className="features-title">
          성장 기록과 체중 변화{" "}
          <span className="highlight-orange">맞춤형 건강 관리</span>
        </h3>
        <div className="features">
          <div className="feature-item">
            <img
              src={HomePageFeature1}
              alt="Feature 1"
              className="feature-image"
            />
            <h4 className="feature-title">반려동물 건강</h4>
            <p className="feature-description">
              반려동물의 건강 질병을
              <br /> 관리
            </p>
          </div>
          <div className="feature-item">
            <img
              src={HomePageFeature2}
              alt="Feature 2"
              className="feature-image"
            />
            <h4 className="feature-title">돌봄,여행</h4>
            <p className="feature-description">
              반려동물을 위한 <br />
              광범위한 서비스를 제공
            </p>
          </div>
          <div className="feature-item">
            <img
              src={HomePageFeature3}
              alt="Feature 3"
              className="feature-image"
            />
            <h4 className="feature-title">반려동물 장례</h4>
            <p className="feature-description">
              반려동물의 마지막 <br />
              순간까지 동행
            </p>
          </div>
        </div>
      </section>

      <section className="about-us-section">
        <div className="about-content">
          <h2 className="about-heading">About Us</h2>
          <p className="about-description">
            인생의 동반자, 반려동물
            <br />
            처음부터 끝까지
            <br />
            함께 동행합니다.
          </p>
        </div>
        <div className="about-image-container">
          <img src={AboutUsImage} alt="About Us" className="about-image" />
        </div>
      </section>

      <section className="hashtag-section">
        <h2 className="hashtag-heading">#hash tag</h2>
        <p className="hashtag-description">
          <span className="hashtag-highlight">반려동물</span>의 성장을
          기록하세요 <br />
          <span className="hashtag-highlight">#펫트립</span>
        </p>
        <div className="gallery">
          <div className="gallery-item">
            <img src={HashTagImage1} alt="HashTag 1" />
          </div>
          <div className="gallery-item">
            <img src={HashTagImage2} alt="HashTag 2" />
          </div>
          <div className="gallery-item">
            <img src={HashTagImage1} alt="HashTag 3" />
          </div>
          <div className="gallery-item">
            <img src={HashTagImage2} alt="HashTag 4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
