import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PetSitterDetail.style.css";
import axios from 'axios';
import host from '../../host';
import url from '../../defImages';
import reverseRegionData from "../../korea_region/reverse_json.json"

const PetSitterDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("시간별");
  const [expanded, setExpanded] = useState(false);
  const [petSitterReview, setPetSitterReview] = useState([]);
  const [petSitter, setPetSitter] = useState({
    id: "",
    user_name: "",
    user_profil: "",
    img: "",
    location: "",
    intro: "",
    fullIntro: "111111",
    activityType: "",
    isImbo: false,
    smallCost: "",
    normalCost: "",
    bigCost: "",
    dayCost: "",
    reviewCount: "준비중"
  });

  const [formData, setFormData] = useState({
    id: "",
    userId: sessionStorage.getItem('user_id'),
    petsitterId: id,
    isTimeOrDay: "시간별",
    startHour: "",
    endHour: "",
    startDate: "",
    endDate: "",
    petType: "",
    message: "",
    isAccept: false,
    createAt: ""
  });

  const activityMapping = {
    0: "주중",
    1: "주말",
    2: "요일 무관"
  };

  useEffect(() => {
    axios.get(`${host}/ps/${id}`)
      .then((r) => {
        setPetSitter(r.data);
        console.log(petSitter);
      })
      .catch((e) => {
        console.log("내부 서버에서 오류 발생")
      });

    axios.get(`${host}/ps/review/${id}`)
      .then((r) => {
        setPetSitterReview(r.data);
      })
      .catch((e) => {
        if (e.response && e.response.status == 404) return;
        alert("후기 요청에 실패하였습니다.")
      })

  }, [id]);

  function getRegionName(code) {
    const region = reverseRegionData[code];
    if (region) {
      return `${region.sido} ${region.sigungu}`;
    } else {
      return "알수없음";
    }
  }

  const formatKoreanDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = () => {
    if (!formData.petType || !formData.message) {
      alert("모든 조건 및 메시지를 선택(입력)해주세요!");
      return
    }
    if (activeTab === "시간별") {
      if (!formData.startHour || !formData.endHour || !formData.reserveDate) {
        alert("모든 조건을 선택해주세요!");
        return
      }
    }
    else if (activeTab === "종일권") {
      if (!formData.startDate || !formData.endDate) {
        alert("모든 조건을 선택해주세요!");
        return
      }
    }

    const userId = sessionStorage.getItem('user_id');
    setFormData((prevData) => ({
      ...prevData,
      userId: userId,
      petsitterId: id,
    }));

    console.log(formData);

    axios.post(`${host}/ps/reserve`, formData, {
      headers: {
      }
    })
      .then((r) => {
        alert("정상적으로 신청되었습니다.");
        document.location.reload();
      }
      )
      .catch((e) => {
        alert("오류가 발생했습니다.");
      })


  }

  return (
    <div className="petsitter-detail-container">
      <div className="petsitter-detail-content">
        <div className="petsitter-detail-gallery">
          <div className="petsitter-detail-gallery-full">
            <img src={ petSitter.img ? `${host}/${petSitter.img}` : url.defaultPostUrl} alt="Pet sitter's home" />
          </div>  
        </div>

        <div className="petsitter-detail-main">
          <div className="petsitter-detail-left-column">
            <section className="petsitter-detail-profile">
              <div className="petsitter-detail-profile-image">
                <img src={petSitter.user_profil ? `${host}/${petSitter.user_profil}` : url.defaultProfileUrl} alt={petSitter.name} />
              </div>
              <div className="petsitter-detail-profile-info">
                <h2 className="petsitter-detail-profile-title">
                  {getRegionName(petSitter.location)}: {petSitter.user_name}님
                </h2>
                <span> {activityMapping[petSitter.activityType]} 활동 펫시터 · 기간 임보 {petSitter.isImbo ? "가능" : "불가능"}</span>
                <p className="petsitter-detail-profile-description">
                  {petSitter.intro}
                </p>
              </div>
            </section>

            <section className="petsitter-detail-intro">
              <h3 className="petsitter-detail-section-title">소개말</h3>
              <p
                className={`petsitter-detail-intro-text ${expanded ? "expanded" : ""
                  }`}
              >
                {petSitter.fullIntro}
              </p>
              {petSitter.fullIntro?.length > 150 && (
                <button
                  className="petsitter-detail-intro-toggle"
                  onClick={toggleExpand}
                >
                  {expanded ? "접기" : "더보기"}
                </button>
              )}
            </section>

            <section className="petsitter-detail-reviews">
              <h3 className="petsitter-detail-section-title">
                고객 후기
                ({petSitterReview.length}개)
              </h3>

            </section>
            <section className="petsitter-detail-comments">
              {petSitterReview.length > 0 ? (
                petSitterReview.map((review) => (
                  <div key={review.id} className="petsitter-detail-comment">
                    <div className="petsitter-detail-comment-profile">
                      <img src={review.user_profil ? `${host}/${review.user_profil}` :
                        url.defaultProfileUrl} alt={petSitter.user_name} />
                    </div>
                    <div className="petsitter-detail-comment-content">
                      <h3 className="petsitter-detail-comment-title">
                        <span>{review.user_name} 님의 후기</span>
                        <span className="petsitter-detail-comment-title-pettype">{formatKoreanDate(review.reserveDate)}·{review.petType}·{review.isTimeOrDay}</span>
                      </h3>
                      {review.content}
                    </div>
                  </div>
                ))
              ) : null
              }
            </section>
          </div>

          <div className="petsitter-detail-right-column">
            <div className="petsitter-detail-reservation">
              <div className="petsitter-detail-reservation-header">
                <h3 className="petsitter-detail-reservation-title">
                  언제 펫시터가 필요하시나요?
                </h3>

                <div className="petsitter-detail-time-tabs">
                  <button
                    className={`petsitter-detail-tab ${activeTab === "시간별" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("시간별");
                      setFormData((prev) => ({
                        ...prev,
                        startDate: "",
                        endDate: "",
                        isTimeOrDay: "시간별"
                      }));
                    }}
                  >
                    시간별
                  </button>
                  <button
                    className={`petsitter-detail-tab ${activeTab === "종일권" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("종일권");
                      setFormData((prev) => ({
                        ...prev,
                        reserveDate: "",
                        startHour: "",
                        endHour: "",
                        isTimeOrDay: "종일권"
                      }));
                    }}
                  >
                    종일권
                  </button>
                </div>
                {activeTab === "시간별" ? (
                  <div className="petsitter-detail-time-container">
                    <div className="petsitter-detail-full-column">
                      <label>예약 날짜 </label>
                      <input
                        type="date"
                        name="reserveDate"
                        value={formData.reserveDate}
                        onChange={(e) =>
                          setFormData({ ...formData, reserveDate: e.target.value })
                        }
                      />
                    </div>

                    <div className="ps-d-t">
                      <div className="petsitter-detail-time-column">
                        <div className="petsitter-detail-time-label">시작 시간</div>
                        <div className="petsitter-detail-time-select">
                          <select
                            name="startHour"
                            value={formData.startHour}
                            onChange={(e) =>
                              setFormData({ ...formData, startHour: e.target.value })
                            }
                          >
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
                          <select
                            name="endHour"
                            value={formData.endHour}
                            onChange={(e) =>
                              setFormData({ ...formData, endHour: e.target.value })
                            }
                          >
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
                  </div>
                ) : activeTab === "종일권" ? (
                  petSitter.isImbo ? (
                    <div className="petsitter-detail-full-container">
                      <div className="petsitter-detail-full-column">
                        <label>시작 날짜</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="petsitter-detail-full-column">
                        <label>종료 날짜</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({ ...formData, endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  ) : ("해당유저는 기간 임보를 지원하지 않아요")) : ("올바르게지정하세요.")}


                <div className="petsitter-detail-pet-select">
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={(e) =>
                      setFormData({ ...formData, petType: e.target.value })
                    }
                  >
                    <option value="">반려동물 선택</option>
                    <option value="소형종">소형종</option>
                    <option value="중형종">중형종</option>
                    <option value="대형종">대형종</option>
                    <option value="고양이">고양이</option>
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
                        $ {petSitter.smallCost}
                      </div>
                    </div>
                    <div className="petsitter-detail-price-item">
                      <div className="petsitter-detail-price-pet">
                        <span className="petsitter-detail-price-icon">🐕</span>
                        중형견
                      </div>

                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.normalCost}
                      </div>
                    </div>
                    <div className="petsitter-detail-price-item">
                      <div className="petsitter-detail-price-pet">
                        <span className="petsitter-detail-price-icon">🐕</span>
                        대형견
                      </div>

                      <div className="petsitter-detail-price-amount">
                        $ {petSitter.bigCost}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="petsitter-detail-calendar-section">
                  <h3 className="petsitter-detail-section-title">
                    예약 메시지
                  </h3>
                  <textarea
                    className="ps-rs-ta"
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                    }
                    }
                  />
                </div>
                {sessionStorage.getItem('user_id') != petSitter.userId ? (
                  <button className="petsitter-detail-reserve-button" onClick={handleSubmit}>
                  예약 하기
                  </button>
                ):(
                  <span className="cant-submit">본인은 예약할 수 없습니다.</span>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSitterDetail;
