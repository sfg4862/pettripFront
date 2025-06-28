import React, { useState, useEffect, useRef } from "react";
import "./ProfileModifyPage.style.css";
import url from '../../defImages';
import axios from 'axios';
import host from '../../host';

function ProfileModifyPage() {
  const [profileData, setProfileData] = useState({
    nickname: "",
    user_profil: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    email: "",
    phonePrefix: "",
    phoneMiddle: "",
    phoneLast: "",
    currentPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error
  const [previewImage, setPreviewImage] = useState(url.defaultProfileUrl);
  const [isUserOrPwchng, setIsUserOrPwchng] = useState("");
  const formRef = useRef(new FormData());

  // 컴포넌트 마운트 시 기존 정보 로드
  useEffect(() => {
    const loadUserData = () => {
      const nickname = sessionStorage.getItem("user_nickname") || "테스트사용자";

      axios.get(`${host}/user/edit/${sessionStorage.getItem('user_id')}`)
        .then((r) => {
          const data = r.data;

          const [year, month, day] = data.user_birthday
            ? data.user_birthday.split("-")
            : ["", "", ""];

          const phone = data.user_phoneNumber || "";
          const phonePrefix = phone.slice(0, 3);
          const phoneMiddle = phone.slice(3, 7);
          const phoneLast = phone.slice(7);

          setProfileData((prev) => ({
            ...prev,
            nickname: nickname,
            email: data.user_email, // 임시 데이터
            phonePrefix: phonePrefix,
            phoneMiddle: phoneMiddle,
            phoneLast: phoneLast,
            birthYear: year,
            birthMonth: month,
            birthDay: day,
            user_profil: data.user_profil ? data.user_profil : ""
          }));
          if(data.user_profil)setPreviewImage(`${host}/${data.user_profil}`)

        })
        .catch((e) => {
          alert("회원정보 수정에 실패하였습니다.");
          return;
        });
    }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      formRef.current.set('media', file);
    }

  };

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


  const handlePasswordChangeRequest = async (emptyStars) => {
    try {
      setIsUserOrPwchng("pwchng");
      if (!profileData.newPassword || !profileData.currentPassword) {
        setMessage("필수 항목을 모두 입력해주세요.");
        setMessageType("error");
        return;
      }

      if (profileData.newPassword != profileData.newPasswordConfirm) {
        setMessage("비밀번호 확인이 일치하지 않습니다.");
        setMessageType("error");
        return;
      }

      for (const key in profileData) {
        await formRef.current.set(key, profileData[key]);
      }
      formRef.current.set("type", "psChange");
      // 여기서 실제 API 호출을 할 것임 (현재는 시뮬레이션)
      await axios.put(`${host}/user/${sessionStorage.getItem('user_id')}`, formRef.current)
        .then((r) => { })
        .catch((e) => { throw (e.response.data.message) })

      setMessage("비밀번호가 성공적으로 업데이트되었습니다.");
      setMessageType("success");
      profileData.newPasswordConfirm = "";
      profileData.newPassword = "";
      profileData.currentPassword = "";

      // 페이지 새로고침으로 변경사항 반영
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage(`회원 정보 업데이트 중 오류가 발생했습니다: ${error}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
      formRef.current = new FormData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
      setIsUserOrPwchng("user");
    setMessage("");

    try {
      // 필수 필드 검증
      if (!profileData.nickname || !profileData.email || !profileData.password) {
        setMessage("필수 항목을 모두 입력해주세요.");
        setMessageType("error");
        return;
      }

      // 비밀번호 확인
      if (profileData.password !== profileData.confirmPassword) {
        setMessage("비밀번호확인이 일치하지 않습니다.");
        setMessageType("error");
        return;
      }
      for (const key in profileData) {
        await formRef.current.set(key, profileData[key]);
      }
      formRef.current.set("type", "all");
      // 여기서 실제 API 호출을 할 것임 (현재는 시뮬레이션)
      await axios.put(`${host}/user/${sessionStorage.getItem('user_id')}`, formRef.current)
        .then((r) => {
          sessionStorage.setItem("user_nickname", profileData.nickname);
          sessionStorage.setItem("user_profile_image", r.data.user_profil);
        })
        .catch((e) => { throw (`${e.response.data.message ? e.response.data.message : e}`) })

      setMessage("회원 정보가 성공적으로 업데이트되었습니다.");
      setMessageType("success");
      profileData.password = "";
      profileData.confirmPassword = "";

      // 페이지 새로고침으로 변경사항 반영
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage(`회원 정보 업데이트 중 오류가 발생했습니다: ${error}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
      formRef.current = new FormData();
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
                <td colSpan="4" className="label-cell">
                  <label>프로필 사진</label>
                </td>
              </tr>
              <tr>
                <td className="input-cell image-cell" colSpan="4">
                  <div className="profileImageContainer">
              <label htmlFor="image-upload">
                {!profileData.user_profil ? (
                  <img src={previewImage} alt="Profile" className="profileImage forinput" />
                ) : (
                  <img src={previewImage} alt="Profile" className="profileImage forinput" />
                )}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
                </td>
              </tr>
              <tr>
                <td className="label-cell">
                  <label>이름(닉네임)*</label>
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
                  <label>연락처*</label>
                </td>
                <td className="input-cell full-width" colSpan="3">
                  <div className="phone-inputs">
                    <input
                      type="text"
                      name="phonePrefix"
                      value={profileData.phonePrefix}
                      onChange={handleInputChange}
                      placeholder="010"
                      maxLength="3"
                      disabled={isLoading}
                    />
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
          {/* 제출 버튼 */}
          {/* 메시지 표시 */}
          {isUserOrPwchng == "user" && message && <div className={`message ${messageType}`}>{message}</div>}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "수정 중..." : "정보 수정"}
            </button>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="additional-section">
            <h3 className="section-title">추가 정보</h3>

            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-cell">
                    <label>현재 비밀번호</label>
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
                </tr>
                <tr>
                  <td className="label-cell">
                    <label>변경할 비밀번호</label>
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
                    <label>변경할 비밀번호 확인</label>
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
              </tbody>
            </table>
          </div>

          {/* 메시지 표시 */}
          {isUserOrPwchng == "pwchng" &&message && <div className={`message ${messageType}`}>{message}</div>}

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              className="change-request-btn"
              onClick={handlePasswordChangeRequest}
            >
              변경요청
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModifyPage;
