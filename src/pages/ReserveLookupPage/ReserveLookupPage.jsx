import React, { useState } from "react";
import "./ReserveLookupPage.style.css";

function ReserveLookupPage() {
  const [activeTab, setActiveTab] = useState("active");

  // 임시 예약 데이터
  const reservations = [
    {
      id: 1,
      date: "2025.05.21",
      sitterName: "전북 익산시 김블리 펫시터",
      sitterImage: "/api/placeholder/60/60",
      reserveDate: "2025.05.21",
      reserveTime: "13:00 ~ 15:00 (2시간)",
      petName: "김불리",
      status: "active",
    },
    {
      id: 2,
      date: "2025.05.20",
      sitterName: "전북 익산시 김블리 펫시터",
      sitterImage: "/api/placeholder/60/60",
      reserveDate: "2025.05.21",
      reserveTime: "13:00 ~ 15:00 (2시간)",
      petName: "김불리",
      status: "active",
    },
  ];

  const canceledReservations = [
    {
      id: 3,
      date: "2025.05.15",
      sitterName: "서울 강남구 이펫시터",
      sitterImage: "/api/placeholder/60/60",
      reserveDate: "2025.05.18",
      reserveTime: "10:00 ~ 12:00 (2시간)",
      petName: "김불리",
      status: "canceled",
      cancelReason: "개인 사정으로 인한 취소",
    },
    {
      id: 4,
      date: "2025.05.10",
      sitterName: "서울 서초구 박펫시터",
      sitterImage: "/api/placeholder/60/60",
      reserveDate: "2025.05.12",
      reserveTime: "14:00 ~ 18:00 (4시간)",
      petName: "김불리",
      status: "canceled",
      cancelReason: "펫시터 사정으로 인한 취소",
    },
    {
      id: 5,
      date: "2025.05.05",
      sitterName: "서울 마포구 최펫시터",
      sitterImage: "/api/placeholder/60/60",
      reserveDate: "2025.05.07",
      reserveTime: "09:00 ~ 17:00 (8시간)",
      petName: "김불리",
      status: "canceled",
      cancelReason: "반려동물 컨디션 난조",
    },
  ];

  const activeReservations = reservations.filter((r) => r.status === "active");
  const canceled = canceledReservations.filter((r) => r.status === "canceled");

  const handleReReserve = (reservationId) => {
    alert(`예약 ID ${reservationId} 재예약 기능 - 개발 예정`);
  };

  const handleWriteReview = (reservationId) => {
    alert(`예약 ID ${reservationId} 후기 작성 기능 - 개발 예정`);
  };

  return (
    <div className="reserve-lookup-page">
      <div className="reserve-lookup-container">
        <h1 className="page-title">예약내역 조회</h1>

        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            예약내역 조회({activeReservations.length})
          </button>
          <button
            className={`tab-button ${activeTab === "canceled" ? "active" : ""}`}
            onClick={() => setActiveTab("canceled")}
          >
            취소 내역 조회({canceled.length})
          </button>
        </div>

        <div className="reservation-list">
          {activeTab === "active" && (
            <>
              {activeReservations.length > 0 ? (
                activeReservations.map((reservation) => (
                  <div key={reservation.id} className="reservation-card">
                    <div className="reservation-date">{reservation.date}</div>
                    <div className="reservation-content">
                      <div className="reservation-info">
                        <img
                          src={reservation.sitterImage}
                          alt="펫시터"
                          className="sitter-image"
                        />
                        <div className="reservation-details">
                          <h3 className="sitter-name">
                            {reservation.sitterName}
                          </h3>
                          <div className="reservation-time-info">
                            <p>
                              <strong>예약 날짜:</strong>{" "}
                              {reservation.reserveDate}
                            </p>
                            <p>
                              <strong>예약 시간:</strong>{" "}
                              {reservation.reserveTime}
                            </p>
                            <p>
                              <strong>반려동물:</strong> {reservation.petName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="reservation-actions">
                        <button
                          className="action-button re-reserve"
                          onClick={() => handleReReserve(reservation.id)}
                        >
                          재예약
                        </button>
                        <button
                          className="action-button review"
                          onClick={() => handleWriteReview(reservation.id)}
                        >
                          후기 남기기
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

          {activeTab === "canceled" && (
            <>
              {canceled.length > 0 ? (
                canceled.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="reservation-card canceled"
                  >
                    <div className="reservation-date">{reservation.date}</div>
                    <div className="reservation-content">
                      <div className="reservation-info">
                        <img
                          src={reservation.sitterImage}
                          alt="펫시터"
                          className="sitter-image"
                        />
                        <div className="reservation-details">
                          <h3 className="sitter-name">
                            {reservation.sitterName}
                          </h3>
                          <div className="reservation-time-info">
                            <p>
                              <strong>예약 날짜:</strong>{" "}
                              {reservation.reserveDate}
                            </p>
                            <p>
                              <strong>예약 시간:</strong>{" "}
                              {reservation.reserveTime}
                            </p>
                            <p>
                              <strong>반려동물:</strong> {reservation.petName}
                            </p>
                            <p className="cancel-reason">
                              <strong>취소 사유:</strong>{" "}
                              {reservation.cancelReason}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="reservation-actions">
                        <button
                          className="action-button re-reserve"
                          onClick={() => handleReReserve(reservation.id)}
                        >
                          재예약
                        </button>
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
    </div>
  );
}

export default ReserveLookupPage;
