import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar/Navbar.style.css";
import host from "../../host.js";
import url from "../../defImages.js";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = sessionStorage.getItem("user_id");
      if (userId) {
        setIsLoggedIn(true);
        // sessionStorage에서 사용자 데이터 가져오기
        const userInfo = {
          id: userId,
          nickname: sessionStorage.getItem("user_nickname") || "사용자",
          profileImage:
            sessionStorage.getItem("user_profile_image") ||
            "/api/placeholder/50/50",
        };
        setUserData(userInfo);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
      
    };

    checkLoginStatus();
    console.log(userData);
    
        
    
    // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 감지)
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // 로그인/회원가입 버튼 클릭 핸들러
  const handleLoginClick = () => {
    navigate("/login");
  };

  // 프로필 클릭 핸들러 (사이드바 토글)
  const handleProfileClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 사이드바 외부 클릭 시 닫기
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_nickname");
    sessionStorage.removeItem("user_profile_image");
    setIsLoggedIn(false);
    setUserData(null);
    setIsSidebarOpen(false);
    navigate("/");
  };

  // 사이드바 메뉴 클릭 핸들러
  const handleMenuClick = (path) => {
    setIsSidebarOpen(false);
    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      <div className="navbar">
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          Pet's Trip
        </Link>
        
        <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        <div className={`menu ${isMenuOpen ? "menu-open" : ""}`}>
          <Link
            to="/record_daily"
            className="menu-item"
            style={{ textDecoration: "none" }}
          >
            성장 기록
          </Link>
          
          <Link
            to="/search"
            className="menu-item"
            style={{ textDecoration: "none" }}
          >
            숙소 · 맛집
          </Link>
          <Link
            to="/petsitter"
            className="menu-item"
            style={{ textDecoration: "none" }}
          >
            펫시터 예약
          </Link>
          <Link
            to="/health-checkup"
            className="menu-item"
            style={{ textDecoration: "none" }}
          >
            AI 건강 분석
          </Link>
          <Link
            to="/community"
            className="menu-item"
            style={{ textDecoration: "none" }}
          >
            커뮤니티
          </Link>
          <Link
            to="/faq"
            className="menu-item"
            style={{ textDecoration: "none" }}
          >
            이용 안내
          </Link>
        </div>
        <div className="user-section">
          {isLoggedIn ? (
            <div className="user-info" onClick={handleProfileClick}>
              {userData?.profileImage != 'null' ? 
                (
                  <img
                src={`${host}/`+userData?.profileImage || "/api/placeholder/50/50"}
                alt="User"
                className="user-image"
              />)
              :(
              <img
                src={url.defaultProfileUrl}
                alt="User"
                className="user-image"
              />)
              }
              <span className="username">
                {userData?.nickname}님 어서오세요
              </span>
            </div>
          ) : (
            <div className="login-signup" onClick={handleLoginClick}>
              로그인/회원가입
            </div>
          )}
        </div>
      </div>

      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
      )}

      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          {userData?.profileImage != 'null' ? 
              (
                <img
                  src={`${host}/`+userData?.profileImage || "/api/placeholder/100/100"}
                  alt="Profile"
                  className="sidebar-profile-image"
                />
              ) : (
                <img
                  src={url.defaultProfileUrl}
                  alt="Profile"
                  className="sidebar-profile-image"
                />
              )
          }
          <div className="sidebar-user-info">
            <h3 className="sidebar-nickname">{userData?.nickname}</h3>
          </div>
        </div>

        <div className="sidebar-menu">
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/reservations")}
          >
            예약내역 조회
          </div>
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/profile-edit")}
          >
            회원 정보 수정
          </div>
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/favorite-posts")}
          >
            관심 피드
          </div>
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/my-posts")}
          >
            게시물 관리
          </div>
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/points")}
          >
            적립금
          </div>
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/coupons")}
          >
            쿠폰
          </div>
          <div
            className="sidebar-menu-item"
            onClick={() => handleMenuClick("/customer-service")}
          >
            고객센터
          </div>
        </div>

        <div className="sidebar-sns">
          <div className="sns-icons">
            <div className="sns-icon kakao"></div>
            <div className="sns-icon instagram"></div>
          </div>
        </div>

        <div className="sidebar-logout">
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
