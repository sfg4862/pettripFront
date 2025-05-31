import React, { useState,useEffect } from "react";
import "./RecordDailyPage.style.css";
import host from '../../host.js';
import axios from 'axios';

const RecordDailyPage = () => {
  // 현재 날짜 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    type: "예방 접종", // 기본값: 예방 접종
    time: "",
    memo: "",
    details: [],
  });

  // 캘린더에 표시할 이벤트 데이터 샘플
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {

    const r = axios.get(`${host}/daily`,{
      headers : {
        "Authorization" : sessionStorage.getItem('user_id')
      }}
    )
    .then(r=>{
      const r_dict = r.data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      
      setEvents(r_dict);
      setCalendarEvents(r_dict);
      console.log(r_dict);
    })
    .catch(e =>{
      alert("잘못된 요청입니다.")
    })

}, []);

  // 이벤트 유형 옵션 - 이미지에 맞게 수정
  const eventTypes = ["동물병원", "펫시터", "미용", "건강관리/체중", "기타"];

  // 현재 연도와 월 구하기
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 해당 월의 일수 구하기
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 해당 월의 첫 날의 요일 구하기 (0: 일요일, 1: 월요일, ...)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // 캘린더 그리드 생성
  const generateCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const grid = [];

    // 첫째 주 빈 칸 채우기
    let firstWeek = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      firstWeek.push(null);
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      firstWeek.push(day);
      if (firstWeek.length === 7) {
        grid.push(firstWeek);
        firstWeek = []; // 새 배열 할당
      }
    }

    // 마지막 주 빈 칸 채우기
    if (firstWeek.length > 0) {
      while (firstWeek.length < 7) {
        firstWeek.push(null);
      }
      grid.push(firstWeek);
    }

    return grid;
  };

  // 특정 날짜에 이벤트가 있는지 확인
  const getEventsForDay = (day) => {
    if (!day) return [];
    const date = new Date(year, month, day);
    return calendarEvents.filter((event) => {
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    });
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(year, month, day);
    setSelectedDate(date);

    // 선택한 날짜에 이벤트가 있으면 보여주기
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setEvents(dayEvents);
    } else {
      setEvents([]);
    }
  };

  // 이벤트 추가 버튼 클릭 핸들러
  const handleAddEventClick = () => {
    setShowEventForm(true);
  };

  // 이벤트 입력 핸들러
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // 이벤트 세부 항목 추가 핸들러
  const handleAddDetail = () => {
    setNewEvent((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }));
  };

  // 이벤트 세부 항목 변경 핸들러
  const handleDetailChange = (index, value) => {
    const updatedDetails = [...newEvent.details];
    updatedDetails[index] = value;
    setNewEvent((prev) => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  // 이벤트 제출 핸들러
  const handleSubmitEvent = (e) => {
    e.preventDefault();

    if (!selectedDate) return;

    const newEventObj = {
      ...newEvent,
      date: selectedDate,
    };

    // 체중 데이터 추가
    if (newEvent.type === "건강검진" || newEvent.type === "체중/체중") {
      newEventObj.weight = newEvent.weight || "0kg";
    }

    newEventObj.user_id = sessionStorage.getItem('user_id');
    
    console.log(newEventObj);

    const r = axios.post(`${host}/daily`,newEventObj)
      .then(r=>{
        alert('일정이 정상적으로 추가되었습니다.');
      })
      .catch(e=>{
        alert('잘못된 요청입니다.');
      })


    //
    //
    //
    //
    //지울수도?
    //
    //
    //
    //

    // 이벤트 추가
    setCalendarEvents((prev) => [...prev, newEventObj]);
    //
    //
    //
    //
    //
    //
    //
    //


    // 폼 초기화
    setNewEvent({
      type: "예방 접종",
      time: "",
      memo: "",
      details: [],
    });

    setShowEventForm(false);

    // 방금 추가한 이벤트 포함하여 이벤트 목록 업데이트
    setEvents((prev) => [...prev, newEventObj]);
  };

  // 이벤트 취소 핸들러
  const handleCancelEvent = () => {
    setShowEventForm(false);
    setNewEvent({
      type: "예방 접종",
      time: "",
      memo: "",
      details: [],
    });
  };

  // 이벤트 삭제 핸들러
  const handleDeleteEvent = (index) => {
    // 이벤트 삭제 확인
    if (window.confirm("이 일정을 삭제하시겠습니까?")) {
      // 해당 이벤트 제거
      const eventToDelete = events[index];
      setCalendarEvents((prev) =>
        prev.filter(
          (event) =>
            !(
              event.date.getTime() === eventToDelete.date.getTime() &&
              event.type === eventToDelete.type &&
              event.time === eventToDelete.time
            )
        )
      );

      // 현재 표시된 이벤트 목록에서 제거
      setEvents((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 이벤트 타입에 따른 색상 클래스 반환
  const getEventColorClass = (type) => {
    switch (type) {
      case "예방 접종":
        return "event-vaccination";
      case "펫시터":
        return "event-petsitter";
      case "미용":
        return "event-grooming";
      case "동물병원":
        return "event-hospital";
      case "건강관리/체중":
        return "event-weight";
      default:
        return "event-other";
    }
  };

  // 달력 그리드 생성
  const calendarGrid = generateCalendarGrid();

  // 요일 레이블
  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  // 포맷된 날짜 (YYYY.MM)
  const formattedDate = `${year}.${String(month + 1).padStart(2, "0")}`;

  // 선택된 날짜 포맷팅 (YYYY.MM.DD, 요일)
  const formatSelectedDate = (date) => {
    if (!date) return "";
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekday = days[date.getDay()];
    return `${year}.${month}.${day}. ${weekday}`;
  };

  return (
    <div className="record-daily-page">
      <div className="calendar-container">
        <header className="main-header">
          <h1 className="current-month">{formattedDate}</h1>
          <div className="header-controls">
            <button className="nav-btn prev" onClick={goToPreviousMonth}>
              &lt;
            </button>
            <button className="nav-btn next" onClick={goToNextMonth}>
              &gt;
            </button>
          </div>
        </header>

        <div className="event-indicators">
          <div className="event-indicator-item vaccination">
            <span className="dot"></span>
            <span className="text">예방 접종</span>
          </div>
          <div className="event-indicator-item hospital">
            <span className="dot"></span>
            <span className="text">동물병원</span>
          </div>
          <div className="event-indicator-item petsitter">
            <span className="dot"></span>
            <span className="text">펫시터</span>
          </div>
          <div className="event-indicator-item grooming">
            <span className="dot"></span>
            <span className="text">미용</span>
          </div>
          <div className="event-indicator-item weight">
            <span className="dot"></span>
            <span className="text">건강관리/체중</span>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekday-row">
            {weekdayLabels.map((day, index) => (
              <div
                key={index}
                className={`weekday ${index === 0 ? "sunday" : ""} ${
                  index === 6 ? "saturday" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {calendarGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="week-row">
              {week.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day);
                const isToday =
                  day &&
                  new Date().getDate() === day &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;
                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;

                return (
                  <div
                    key={dayIndex}
                    className={`day-cell ${!day ? "empty-cell" : ""} ${
                      isToday ? "today" : ""
                    } ${isSelected ? "selected" : ""} ${
                      dayIndex === 0 ? "sunday" : ""
                    } ${dayIndex === 6 ? "saturday" : ""}`}
                    onClick={() => day && handleDateClick(day)}
                  >
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        {dayEvents.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`day-event ${getEventColorClass(
                              event.type
                            )}`}
                          >
                            <span className="dot"></span>
                            {event.type === "예방 접종" && event.time && (
                              <span className="event-text">{event.time}</span>
                            )}
                            {event.type === "동물병원" && event.time && (
                              <span className="event-text">{event.time}</span>
                            )}
                            {event.type === "건강관리/체중" && event.weight && (
                              <span className="event-text">{event.weight}</span>
                            )}
                            {(event.type === "펫시터" ||
                              event.type === "미용") && (
                              <span className="event-text">{event.type}</span>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="event-details-container">
            {showEventForm ? (
              <div className="event-form">
                <h3>새 일정 추가</h3>
                <form onSubmit={handleSubmitEvent}>
                  <div className="form-group">
                    <label>일정 종류 선택</label>
                    <div className="event-type-options">
                      {eventTypes.map((type, index) => (
                        <div key={index} className="event-type-option">
                          <input
                            type="radio"
                            id={`type-${index}`}
                            name="type"
                            value={type}
                            checked={newEvent.type === type}
                            onChange={handleEventChange}
                          />
                          <label
                            htmlFor={`type-${index}`}
                            className={getEventColorClass(type)}
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>일정 시간</label>
                    <input
                      type="time"
                      name="time"
                      value={newEvent.time}
                      onChange={handleEventChange}
                    />
                  </div>

                  {(newEvent.type === "동물병원" ||
                    newEvent.type === "건강관리/체중") && (
                    <div className="form-group">
                      <label>체중</label>
                      <input
                        type="text"
                        name="weight"
                        placeholder="예) 5.1kg"
                        value={newEvent.weight || ""}
                        onChange={handleEventChange}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>메모</label>
                    <textarea
                      name="memo"
                      value={newEvent.memo}
                      onChange={handleEventChange}
                      placeholder="일정에 대한 메모를 작성하세요"
                    />
                  </div>

                  {newEvent.type === "예방 접종" && (
                    <div className="form-group">
                      <label>상세 항목</label>
                      {newEvent.details.map((detail, index) => (
                        <input
                          key={index}
                          type="text"
                          value={detail}
                          onChange={(e) =>
                            handleDetailChange(index, e.target.value)
                          }
                          placeholder="예방 접종 항목"
                        />
                      ))}
                      <button
                        type="button"
                        className="add-detail-btn"
                        onClick={handleAddDetail}
                      >
                        + 항목 추가
                      </button>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCancelEvent}
                    >
                      취소
                    </button>
                    <button type="submit" className="submit-btn">
                      저장
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="event-list">
                <div className="event-list-header">
                  <h3>{formatSelectedDate(selectedDate)}</h3>
                  <button
                    className="add-event-btn"
                    onClick={handleAddEventClick}
                  >
                    + 일정 추가
                  </button>
                </div>

                {events.length > 0 ? (
                  <div className="events">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className={`event-item ${getEventColorClass(
                          event.type
                        )}`}
                      >
                        <div className="event-header">
                          <h4>{event.type}</h4>
                          <div className="event-actions">
                            <button className="edit-event-btn">수정</button>
                            <button
                              className="delete-event-btn"
                              onClick={() => handleDeleteEvent(index)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        {event.time && (
                          <p className="event-time">시간: {event.time}</p>
                        )}
                        {event.weight && (
                          <p className="event-weight">체중: {event.weight}</p>
                        )}

                        {event.details && event.details.length > 0 && (
                          <div className="event-details">
                            <h5>상세 항목:</h5>
                            <ul>
                              {event.details.map((detail, detailIndex) => (
                                <li key={detailIndex}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {event.memo && (
                          <div className="event-memo">
                            <h5>메모:</h5>
                            <p>{event.memo}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-events">등록된 일정이 없습니다.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordDailyPage;
