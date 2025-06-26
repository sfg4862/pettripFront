import React, { useState, useEffect } from "react";
import "./ReserveLookupPage.style.css";
import axios from 'axios';
import host from '../../host';
import url from "../../defImages";

function ReserveLookupPage() {
  const [isPetSitter, setIsPetSitter] = useState(0);
  const [sittersReservation, setSittersReservation] = useState([]);
  const [sitterTab, setSitterTab] = useState("active");
  const [activeTab, setActiveTab] = useState("active");
  const [PetSitterReservations, setPetSitterReservations] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reviewContent,setReviewContent] = useState("");



  useEffect(() => {
    axios.get(`${host}/ps/reserve/${sessionStorage.getItem('user_id')}`, {
      headers: {
      }
    })
      .then((r) => {
        setPetSitterReservations(r.data);
        console.log(r.data);
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          return;
        } else if (e.response && e.response.status === 500) {
          alert("서버 내부 오류가 발생했습니다.");
        } else {
          alert("요청이 실패하였습니다.");
        }
      })

    if (sessionStorage.getItem('user_id')) {
      axios.get(`${host}/user/${sessionStorage.getItem('user_id')}`)
        .then((r) => {
          if (r.data.user_grade == "petsitter") {
            setIsPetSitter(1);
            axios.get(`${host}/ps/reserve/list/${sessionStorage.getItem('user_id')}`)
              .then((r) => {
                setSittersReservation(r.data);
                console.log(r.data);
              })
              .catch((e) => {
                if (e.response && e.response.status === 404) {
                  return;
                }
                else alert("요청에 실패하였습니다.");
              })
          }
          else {
            setIsPetSitter(0);
          }
        })
    }
  }, [])

  const status = {
    0: "대기중",
    1: "수락완료",
    2: "거절됨"
  }

  const activeReservations = PetSitterReservations.filter((r) => r.isAccept == 0);
  const resultReservations = PetSitterReservations.filter((r) => r.isAccept != 0);
  const requestReservations = sittersReservation.filter((r) => r.isAccept == 0);
  const responseReservations = sittersReservation.filter((r) => r.isAccept != 0);
  console.log(requestReservations);

  const handleResult = (reserveid, statusCode) => {
    const request = {
      id: reserveid,
      isAccept: statusCode
    }
    axios.put(`${host}/ps/reserve`, request)
      .then((r) => {
        alert("처리되었습니다.");
        window.location.reload();
      })
      .catch((e) => {
        if (e.response.status && e.response.status == 404) {
          alert("대상 예약을 확인할 수 없습니다.");
          return;
        }
        alert("서버 오류가 발생하였습니다.");
      })
  }


  const handleViewReview = (reservation) => {
    setSelectedReservation(reservation);
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedReservation(null);
  };


  return (
    <div className="reserve-lookup-page">
      <div className="reserve-lookup-container">
        <h1 className="page-title">펫시터 관리</h1>
        {isPetSitter == 1 && (<div>
          <div>
            <div className="petsitterPanel">
              <div>
                <strong>받은 펫시터 예약관리</strong>
              </div>
            </div>
            <div className="tab-container">
              <button
                className={`tab-button ${sitterTab === "active" ? "active" : ""}`}
                onClick={() => setSitterTab("active")}
              >
                응답대기 예약({requestReservations.length})
              </button>
              <button
                className={`tab-button ${sitterTab === "result" ? "active" : ""}`}
                onClick={() => setSitterTab("result")}
              >
                응답한 예약({responseReservations.length})
              </button>
            </div>
          </div>
          <div className="reservation-list">
            {sitterTab === "active" && (
              <>
                {requestReservations.length > 0 ? (
                  requestReservations.map((reserve) => (
                    <div key={reserve.id} className="reservation-card">
                      <div className="reservation-date">{reserve.isTimeOrDay == "시간별" ? reserve.reserveDate : "종일권"}</div>
                      <div className="reservation-content">
                        <div className="reservation-info">
                          <img
                            src={reserve.user_profil ? (`${host}/${reserve.user_profil}`) : (url.defaultProfileUrl)}
                            alt="펫시터"
                            className="sitter-image"
                          />
                          <div className="reservation-details">
                            <h3 className="sitter-name">
                              {reserve.user_name} 님의 신청
                            </h3>
                            <div className="reservation-time-info">
                              <p>
                                <strong>예약 날짜:</strong> {reserve.isTimeOrDay == "시간별" ? reserve.reserveDate : "기간 임시보호"}
                              </p>
                              <p>
                                {reserve.isTimeOrDay == "시간별" ? (
                                  <>
                                    <strong>예약 시간:</strong> {`${reserve.startHour}~${reserve.endHour}`}
                                  </>
                                ) : (
                                  <>
                                    <strong>예약 기간:</strong> {`${reserve.startDate}~${reserve.endDate}`}
                                  </>)}
                              </p>
                              <p>
                                <strong>반려동물:</strong> {reserve.petType}
                              </p>
                              <p>
                                <strong>연락처:</strong> 수락시 응답한 예약에서 확인가능합니다.
                              </p>
                              <p>
                                <strong>메시지:</strong> {reserve.message}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="reservation-actions">
                          <button
                            className="action-button re-reserve"
                            onClick={() => handleResult(reserve.id, 1)}
                          >
                            수락하기
                          </button>
                          <button
                            className="action-button review"
                            onClick={() => handleResult(reserve.id, 2)}
                          >
                            거절하기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>받은 대기중인 신청내역이 없습니다.</p>
                  </div>
                )}
              </>
            )}
            {sitterTab === "result" && (
              <>
                {responseReservations.length > 0 ? (
                  responseReservations.map((reserve) => (
                    <div key={reserve.id} className={reserve.isAccept == 2 ? "reservation-card result"
                      : reserve.isAccept == 1 ? "reservation-card result2" : 1}>
                      {reserve.isAccept == 1 ? (
                        <div className="reservation-date-accept">수락된 건으로, 신청자에게 연락하세요!</div>
                      ) : reserve.isAccept == 2 ? (
                        <div className="reservation-date">{reserve.reserveDate}</div>
                      ) : 1}
                      <div className="reservation-content">
                        <div className="reservation-info">
                          <img
                            src={reserve.user_profil ? (`${host}/${reserve.user_profil}`) : (url.defaultProfileUrl)}
                            alt="펫시터"
                            className="sitter-image"
                          />
                          <div className="reservation-details">
                            <h3 className="sitter-name">
                              {reserve.user_name} 님의 신청
                            </h3>
                            <div className="reservation-time-info">
                              <p>
                                <strong>예약 날짜: </strong>{reserve.isTimeOrDay == "시간별" ? reserve.reserveDate : "기간 임시보호"}
                              </p>
                              <p>
                                {reserve.isTimeOrDay == "시간별" ? (
                                  <>
                                    <strong>예약 시간:</strong> {`${reserve.startHour}~${reserve.endHour}`}
                                  </>
                                ) : (
                                  <>
                                    <strong>예약 기간:</strong> {`${reserve.startDate}~${reserve.endDate}`}
                                  </>)}
                              </p>
                              <p>
                                <strong>반려동물:</strong> {reserve.petType}
                              </p>
                              {reserve.isAccept == 1 &&
                                <p>
                                  <strong>연락처:</strong> {reserve.user_phoneNumber}
                                </p>
                              }
                              <p>
                                <strong>메시지:</strong> {reserve.message}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="reservation-actions">
                          <button
                            className="action-button re-reserve waiting sitterResult"
                            onClick={() => 1}
                          >
                            {reserve.isAccept == 1 ? "수락됨" : "거절됨"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>받은 신청내역이 없습니다.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>)}
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            대기중인 예약내역({activeReservations.length})
          </button>
          <button
            className={`tab-button ${activeTab === "result" ? "active" : ""}`}
            onClick={() => setActiveTab("result")}
          >
            예약 결과({resultReservations.length})
          </button>
        </div>

        <div className="reservation-list">
          {activeTab === "active" && (
            <>
              {activeReservations.length > 0 ? (
                activeReservations.map((reserve) => (
                  <div key={reserve.id} className="reservation-card">
                    <div className="reservation-date">{reserve.isTimeOrDay == "시간별" ? reserve.reserveDate : "종일권"}</div>
                    <div className="reservation-content">
                      <div className="reservation-info">
                        <img
                          src={reserve.user_profil ? (`${host}/${reserve.user_profil}`) : (url.defaultProfileUrl)}
                          alt="펫시터"
                          className="sitter-image"
                        />
                        <div className="reservation-details">
                          <h3 className="sitter-name">
                            {reserve.user_name}
                          </h3>
                          <div className="reservation-time-info">
                            <p>
                              <strong>예약 날짜:</strong> {reserve.isTimeOrDay == "시간별" ? reserve.reserveDate : "기간 임시보호"}
                            </p>
                            <p>
                              {reserve.isTimeOrDay == "시간별" ? (
                                <>
                                  <strong>예약 시간:</strong> {`${reserve.startHour}~${reserve.endHour}`}
                                </>
                              ) : (
                                <>
                                  <strong>예약 기간:</strong> {`${reserve.startDate}~${reserve.endDate}`}
                                </>)}

                            </p>
                            <p>
                              <strong>반려동물:</strong> {reserve.petType}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="reservation-actions">
                        <button
                          className="action-button re-reserve waiting"
                          onClick={() => 1}
                        >
                          {status[reserve.isAccept]}
                        </button>
                        <button
                          className="action-button review"
                          onClick={() => 1}
                        >
                          취소하기
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>예약 내역이 없습니다.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "result" && (
            <>
              {resultReservations.length > 0 ? (
                resultReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={reservation.isAccept == 2 ? "reservation-card result"
                      : reservation.isAccept == 1 ? "reservation-card result2" : 1}
                  >
                    {reservation.isAccept == 1 ? (
                      <div className="reservation-date-accept">{reservation.reserveDate}</div>
                    ) : reservation.isAccept == 2 ? (
                      <div className="reservation-date">{reservation.reserveDate}</div>
                    ) : 1}
                    <div className="reservation-content">
                      <div className="reservation-info">
                        <img
                          src={reservation.user_profil ? (`${host}/${reservation.user_profil}`) : (url.defaultProfileUrl)}
                          alt="펫시터"
                          className="sitter-image"
                        />
                        <div className="reservation-details">
                          <h3 className="sitter-name">
                            {reservation.user_name}
                          </h3>
                          <div className="reservation-time-info">
                            <p>
                              <strong>예약 날짜: </strong>{reservation.isTimeOrDay == "시간별" ? reservation.reserveDate : "기간 임시보호"}
                            </p>
                            <p>
                              {reservation.isTimeOrDay == "시간별" ? (
                                <>
                                  <strong>예약 시간:</strong>{` ${reservation.startHour}~${reservation.endHour}`}
                                </>
                              ) : (
                                <>
                                  <strong>예약 기간:</strong>{` ${reservation.startDate}~${reservation.endDate}`}
                                </>)}
                            </p>
                            <p>
                              <strong>반려동물: </strong> {reservation.petType}
                            </p>
                            {reservation.isAccept == 1 ? (
                              <>
                                <p className="result-reason-accept">
                                  <strong>신청 상태: </strong>{status[reservation.isAccept]}
                                </p>
                                <p className="accept-inst">
                                  신청이 승인되었습니다. 펫시터의 연락을 기다려주세요!
                                </p>
                              </>
                            ) : reservation.isAccept == 2 ? (
                              <p className="result-reason">
                                <strong>신청 상태: </strong>{status[reservation.isAccept]}
                              </p>

                            ) : 1}
                          </div>
                        </div>
                      </div>
                      <div className="reservation-actions">
                      </div>
                      <div className="reviewbtn-container">
                        {reservation.isAccept == 1 && (reservation.isReviewed ? (
                          <button className="action-button postReview-done">후기작성완료</button>
                        ):(
                          <button className="action-button postReview-btn"
                            onClick={() => handleViewReview(reservation)}>후기작성</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>취소된 예약 내역이 없습니다.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedReservation.user_name}님의 후기 작성</h2>
            <textarea
              placeholder="펫시터 사용 후기를 남겨주세요!"
              rows="5"
              className="modal-textarea"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            ></textarea>
            <div className="modal-buttons">
              <button className="postReview-submit pr-cancel" onClick={handleCloseModal}>취소</button>
              <button className="postReview-submit pr-submit" onClick={() => {
                console.log(selectedReservation)
                axios.post(`${host}/ps/review`, {
                  content: reviewContent,
                  userId: sessionStorage.getItem('user_id'),
                  petsitterId: selectedReservation.petsitterId,
                  isTimeOrDay: selectedReservation.isTimeOrDay,
                  reserveDate: selectedReservation.reserveDate,
                  petType: selectedReservation.petType,
                  reserveId: selectedReservation.id,
                })
                .then((r)=>{
                  alert("후기 등록이 완료되었습니다.");
                  setShowReviewModal(0);
                  setReviewContent("");
                  window.location.reload();
                })
                .catch((e)=>{
                  alert("제출에 오류가 발생했습니다.");

                })
              }}>제출</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReserveLookupPage;
