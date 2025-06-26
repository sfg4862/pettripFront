import React, { useState,useRef } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./SignUpPage.style.css";
import "../../fonts/Font.style.css";
import axios from 'axios';
import host from "../../host.js";


const SignUpPage = () => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);
    const formRef = useRef(new FormData());

  // 회원가입 폼 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    phoneNumber: "",
    terms: false,
  });

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 시도:", formData);

    if(formData.password !== formData.confirmPassword){
      alert("비밀번호와 재확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      alert("전화번호는 숫자 11자리여야 합니다. (- 제외)");
      return;
    }

    for (const key in formData) {
      formRef.current.set(key, formData[key]);
    }




    // 여기에 회원가입 로직 추가
    const r = axios.post(`${host}/user`,formRef.current,{
      headers: {
      }})
      .then(r => {
        alert('회원가입이 성공적으로 완료되었습니다.');
        alert('로그인을 진행해주세요.');
        navigate('/login');
      })
      .catch(e => {
        alert('잘못된 요청입니다.');
      })
        
    
  };

  const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            formRef.current.set('media',file);
        }

  };

  // 생년월일 옵션 생성
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="back-button">
          <Link to="/login" className="back-link">
            &lt; 뒤로가기
          </Link>
        </div>

        <h1 className="signup-title">회원가입</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ alignItems: 'unset'}}>
            <label>프로필 사진 등록</label>
            <div className="profileImageContainer">
              <label htmlFor="image-upload">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="profileImage"/>
                  ) : (
                  <div className="profilePlaceholder">사진등록</div>
                  )}
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                  />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일 주소</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="예) oooo@naver.com / oooo@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-input-container">
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="비밀번호를 입력하세요."
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="password-icon">🔒</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 재확인</label>
            <div className="password-input-container">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="비밀번호를 다시 입력하세요."
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="password-icon">🔒</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">이름(닉네임)</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="예) 홍길동"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>생년월일</label>
            <div className="birth-date-container">
              <select
                name="birthYear"
                className="birth-select"
                value={formData.birthYear}
                onChange={handleChange}
                required
              >
                <option value="">년도(4자)</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                name="birthMonth"
                className="birth-select"
                value={formData.birthMonth}
                onChange={handleChange}
                required
              >
                <option value="">월</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                name="birthDay"
                className="birth-select"
                value={formData.birthDay}
                onChange={handleChange}
                required
              >
                <option value="">일</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">전화번호</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input"
              placeholder="휴대폰 번호 입력 ('-'제외 11자리 입력)"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="terms">주소</label>
            <input
              type="text"
              id="terms"
              className="form-input terms-input"
              readOnly
              value=""
            />
          </div>

          <button type="submit" className="signup-button">
            회원가입
          </button>

          <div className="login-link-container">
            <span>이미 계정이 있으신가요?</span>
            <Link to="/login" className="login-link">
              로그인 &gt;
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
