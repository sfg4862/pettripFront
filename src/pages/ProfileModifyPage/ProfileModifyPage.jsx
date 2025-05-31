import React, { useState, useEffect } from "react";
import "./ProfileModifyPage.style.css";

function ProfileModifyPage() {
  const [profileData, setProfileData] = useState({
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    password: "",
    confirmPassword: "",
    email: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    emergencyContact: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error

  // 컴포넌트 마운트 시 기존 정보 로드
  useEffect(() => {
    const loadUserData = () => {
      const nickname =
        sessionStorage.getItem("user_nickname") || "테스트사용자";

      setProfileData((prev) => ({
        ...prev,
        nickname: nickname,
        email: "test123@gmail.com", // 임시 데이터
        phonePrefix: "010",
        phoneMiddle: "1234",
        phoneLast: "5678",
        birthYear: "1990",
        birthMonth: "05",
        birthDay: "15",
        zipCode: "12345",
        address: "서울시 강남구 테헤란로",
        detailAddress: "123번길 45",
      }));
    };

    loadUserData();
  }, []);

  //   useEffect(() => {
  //     const loadUserData = async () => {
  //       try {
  //         const userId = sessionStorage.getItem("user_id");
  //         // 실제로는 API 호출로 사용자 정보를 가져옴
  //         const response = await fetch(`/api/users/${userId}`);
  //         const userData = await response.json();

  //         setProfileData(userData);
  //       } catch (error) {
  //         console.error("사용자 정보 로드 실패:", error);
  //       }
  //     };

  //     loadUserData();
  //   }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 메시지 제거
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleZipCodeSearch = () => {
    alert("우편번호 검색 기능 - 개발 예정");
  };

  const handlePasswordChangeRequest = () => {
    if (!profileData.currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    alert("비밀번호 변경 요청 - 개발 예정");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 필수 필드 검증
      if (!profileData.nickname || !profileData.email) {
        setMessage("필수 항목을 모두 입력해주세요.");
        setMessageType("error");
        return;
      }

      // 비밀번호 확인
      if (profileData.password !== profileData.confirmPassword) {
        setMessage("비밀번호가 일치하지 않습니다.");
        setMessageType("error");
        return;
      }

      // 여기서 실제 API 호출을 할 것임 (현재는 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // sessionStorage 업데이트
      sessionStorage.setItem("user_nickname", profileData.nickname);

      setMessage("회원 정보가 성공적으로 업데이트되었습니다.");
      setMessageType("success");

      // 페이지 새로고침으로 변경사항 반영
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage("회원 정보 업데이트 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-modify-page">
      <div className="profile-modify-container">
        <h1 className="page-title">회원 정보 수정</h1>

        <form className="profile-modify-form" onSubmit={handleSubmit}>
          {/* 기본 정보 테이블 */}
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label-cell">
                  <label>이름명*</label>
                </td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="nickname"
                    value={profileData.nickname}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                    required
                    disabled={isLoading}
                  />
                </td>
                <td className="label-cell">
                  <label>생년월일*</label>
                </td>
                <td className="input-cell">
                  <div className="date-inputs">
                    <input
                      type="text"
                      name="birthYear"
                      value={profileData.birthYear}
                      onChange={handleInputChange}
                      placeholder="년도"
                      maxLength="4"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="birthMonth"
                      value={profileData.birthMonth}
                      onChange={handleInputChange}
                      placeholder="월"
                      maxLength="2"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="birthDay"
                      value={profileData.birthDay}
                      onChange={handleInputChange}
                      placeholder="일"
                      maxLength="2"
                      disabled={isLoading}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="label-cell">
                  <label>비밀번호*</label>
                </td>
                <td className="input-cell">
                  <input
                    type="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요"
                    disabled={isLoading}
                  />
                </td>
                <td className="label-cell">
                  <label>비밀번호 확인*</label>
                </td>
                <td className="input-cell">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    disabled={isLoading}
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">
                  <label>이메일*</label>
                </td>
                <td className="input-cell full-width" colSpan="3">
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    required
                    disabled={isLoading}
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">
                  <label>주소*</label>
                </td>
                <td className="input-cell full-width" colSpan="3">
                  <div className="address-section">
                    <div className="zip-code-row">
                      <input
                        type="text"
                        name="zipCode"
                        value={profileData.zipCode}
                        onChange={handleInputChange}
                        placeholder="우편번호"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="zip-search-btn"
                        onClick={handleZipCodeSearch}
                      >
                        우편번호 찾기
                      </button>
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="기본주소"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="detailAddress"
                      value={profileData.detailAddress}
                      onChange={handleInputChange}
                      placeholder="상세주소"
                      disabled={isLoading}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="label-cell">
                  <label>연락처*</label>
                </td>
                <td className="input-cell full-width" colSpan="3">
                  <div className="phone-inputs">
                    <select
                      name="phonePrefix"
                      value={profileData.phonePrefix}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                      <option value="018">018</option>
                      <option value="019">019</option>
                    </select>
                    <span>-</span>
                    <input
                      type="text"
                      name="phoneMiddle"
                      value={profileData.phoneMiddle}
                      onChange={handleInputChange}
                      placeholder="1234"
                      maxLength="4"
                      disabled={isLoading}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      name="phoneLast"
                      value={profileData.phoneLast}
                      onChange={handleInputChange}
                      placeholder="5678"
                      maxLength="4"
                      disabled={isLoading}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 추가 정보 섹션 */}
          <div className="additional-section">
            <h3 className="section-title">추가 정보</h3>

            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-cell">
                    <label>변경할 비밀번호</label>
                  </td>
                  <td className="input-cell">
                    <input
                      type="password"
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="현재 비밀번호"
                      disabled={isLoading}
                    />
                  </td>
                  <td className="button-cell">
                    <button
                      type="button"
                      className="change-request-btn"
                      onClick={handlePasswordChangeRequest}
                    >
                      변경요청
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">
                    <label>변경할 비밀번호 확인</label>
                  </td>
                  <td className="input-cell full-width" colSpan="2">
                    <input
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleInputChange}
                      placeholder="새 비밀번호를 입력하세요"
                      disabled={isLoading}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">
                    <label>변경할 비밀번호 나머지</label>
                  </td>
                  <td className="input-cell full-width" colSpan="2">
                    <input
                      type="password"
                      name="newPasswordConfirm"
                      value={profileData.newPasswordConfirm}
                      onChange={handleInputChange}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      disabled={isLoading}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">
                    <label>비상연락처</label>
                  </td>
                  <td className="input-cell full-width" colSpan="2">
                    <input
                      type="text"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="비상연락처를 입력하세요"
                      disabled={isLoading}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 메시지 표시 */}
          {message && <div className={`message ${messageType}`}>{message}</div>}

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "수정 중..." : "정보 수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModifyPage;
