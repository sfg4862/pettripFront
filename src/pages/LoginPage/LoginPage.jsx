import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.style.css";
import "../../fonts/Font.style.css";
import kakaoIcon from "../../images/LoginpageImage/KakaoLogo.png";
import naverIcon from "../../images/LoginpageImage/NaverLogo.png";
import googleIcon from "../../images/LoginpageImage/GoogleLogo.png";
import appleIcon from "../../images/LoginpageImage/AppleLogo.png";
import host from "../../host.js";
import axios from 'axios';


const LoginPage = () => {
  const navigate = useNavigate();
  // 이메일과 비밀번호 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    console.log("로그인 시도:", { email, password });
    console.log({email,password});
    // 여기에 로그인 로직 추가
    const r = axios.post(`${host}/login`,{email, password},{
      headers: {
        "Content-Type":"application/json"
      }})
      .then(r => {
        console.log(r);
        sessionStorage.setItem('user_id', r.data.data.user_id);
        sessionStorage.setItem('user_nickname', r.data.data.user_nickname);
        sessionStorage.setItem('user_profile_image', r.data.data.user_profile_image);
        navigate('/');
      })
      .catch(e => {
        alert('계정 이름 또는 비밀번호가 잘못되었습니니다.');
      })
        

  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = (provider) => {
    console.log(`${provider}로 로그인 시도`);
    // 소셜 로그인 로직 추가
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="container-header">
          <div className="back-button">
            <Link to="/" className="back-link">
              &lt; 뒤로가기
            </Link>
          </div>
        </div>

        <div className="logo-container">
          <h1 className="logo-text">
            <span className="logo-pet">Pet's</span>
            <span className="logo-trip"> Trip</span>
          </h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="signup-link-small">
            <Link to="/signup">회원가입</Link>
          </div>
        </form>

        <button className="login-button" onClick={handleSubmit}>
          로그인
        </button>

        <div className="social-login-container">
          <button
            className="social-login-button kakao"
            onClick={() => handleSocialLogin("카카오")}
          >
            <img src={kakaoIcon} alt="Kakao Icon" className="social-icon" />
            카카오로 시작하기
          </button>

          <button
            className="social-login-button naver"
            onClick={() => handleSocialLogin("네이버")}
          >
            <img src={naverIcon} alt="Naver Icon" className="social-icon" />
            네이버로 시작하기
          </button>

          <button
            className="social-login-button google"
            onClick={() => handleSocialLogin("Google")}
          >
            <img src={googleIcon} alt="Google Icon" className="social-icon" />
            Google로 시작하기
          </button>

          <button
            className="social-login-button apple"
            onClick={() => handleSocialLogin("Apple")}
          >
            <img src={appleIcon} alt="Apple Icon" className="social-icon" />
            Apple로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
