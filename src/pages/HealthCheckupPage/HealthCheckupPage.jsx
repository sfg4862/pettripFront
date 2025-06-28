import React, { useState, useRef, useEffect, useCallback } from "react";
import "./HealthCheckupPage.style.css";
import host from "../../host.js";
import healthcheckupImage from "../../images/HealthCheckupPage/healthcheckupimage.png";

const LoadingSpinner = () => (
  <div className="ai-loading-overlay">
    <div className="ai-loading-spinner">
      <div className="ai-spinner"></div>
      <p className="ai-loading-text">AI가 이미지를 분석 중입니다...</p>
    </div>
  </div>
);

function HealthCheckupPage() {
  const [activeTab, setActiveTab] = useState("intro");
  const [petType, setPetType] = useState("");
  const [symptom, setSymptom] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState({
    diagnosisName: "결막염",
    description:
      "개의 결막은 눈꺼풀 안쪽에서 안구를 보호하는 막으로, 흰자 팰 앞에 위치해있기 때문에 각종 외부환경과 자극에 가장 먼저 노출되는 부위입니다. 결막에 문제가 생겨 염증이 생겨나는 병",
    severity: "매우 좋음",
    recommendations: "정기적인 관찰이 필요합니다.",
    records: [
      {
        name: "결막염",
        status: "매우 좋음",
        time: "오후 13:00",
        severity: 1,
      },
      {
        name: "반려동물",
        status: "매우 좋음",
        time: "오후 13:06",
        severity: 1,
      },
    ],
    detailedResult: {
      symptoms: [
        "눈물 과다 분비",
        "눈곱 증가",
        "결막 충혈",
        "눈 비비는 행동 증가",
      ],
      causes: ["세균 감염", "알레르기 반응", "이물질 자극", "건조한 환경"],
      treatment: [
        "수의사 진료 필요",
        "항생제 안약 사용",
        "깨끗한 거즈로 눈곱 제거",
        "충분한 수분 공급",
      ],
    },
  });
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const moodOptions = [
    { value: 1, label: "매우 좋음", emoji: "😊", color: "#4CAF50" },
    { value: 2, label: "좋음", emoji: "🙂", color: "#8BC34A" },
    { value: 3, label: "보통", emoji: "😐", color: "#FFC107" },
    { value: 4, label: "나쁨", emoji: "😟", color: "#FF9800" },
    { value: 5, label: "매우 나쁨", emoji: "😞", color: "#F44336" },
  ];

  const diagnosisExamples = [];

  const handleFiles = useCallback(
    (files) => {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [petType, symptom]
  );

  const handlePaste = useCallback(
    (e) => {
      const items = (e.clipboardData || window.clipboardData).items;
      for (let item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file.type.startsWith("image/")) {
            handleFiles([file]);
          }
        }
      }
    },
    [handleFiles]
  );

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      const preventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const highlight = () => {
        dropArea.classList.add("highlight");
      };

      const unhighlight = () => {
        dropArea.classList.remove("highlight");
      };

      const handleDrop = (e) => {
        preventDefault(e);
        unhighlight();

        const dt = e.dataTransfer;
        const files = dt.files;

        if (files && files.length) {
          handleFiles(files);
        }
      };

      dropArea.addEventListener("dragenter", highlight, false);
      dropArea.addEventListener("dragover", highlight, false);
      dropArea.addEventListener("dragleave", unhighlight, false);
      dropArea.addEventListener("drop", handleDrop, false);

      document.addEventListener("paste", handlePaste);

      return () => {
        dropArea.removeEventListener("dragenter", highlight);
        dropArea.removeEventListener("dragover", highlight);
        dropArea.removeEventListener("dragleave", unhighlight);
        dropArea.removeEventListener("drop", handleDrop);
        document.removeEventListener("paste", handlePaste);
      };
    }
  }, [handleFiles, handlePaste]);

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const generateRandomDiagnosis = () => {
    const randomDiagnosis =
      diagnosisExamples[Math.floor(Math.random() * diagnosisExamples.length)];
    const currentTime = new Date();
    const timeString = `오후 ${currentTime.getHours()}:${currentTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const diagnosisSeverity = randomDiagnosis.defaultSeverity;
    const severityLabel =
      moodOptions.find((m) => m.value === diagnosisSeverity)?.label || "보통";

    setDiagnosisData({
      diagnosisName: randomDiagnosis.diagnosisName,
      description: randomDiagnosis.description,
      severity: severityLabel,
      recommendations:
        diagnosisSeverity >= 4
          ? "빠른 시일 내에 동물 병원 방문을 권장드립니다."
          : "정기적인 관찰이 필요합니다.",
      records: [
        {
          name: randomDiagnosis.diagnosisName,
          status: severityLabel,
          time: timeString,
          severity: diagnosisSeverity,
        },
        {
          name: petType || "반려동물",
          status: severityLabel,
          time: `오후 ${currentTime.getHours()}:${(
            currentTime.getMinutes() +
            Math.floor(Math.random() * 10) +
            1
          )
            .toString()
            .padStart(2, "0")}`,
          severity: diagnosisSeverity,
        },
      ],
      detailedResult: randomDiagnosis.detailedResult,
    });
    setSelectedMood(diagnosisSeverity);
  };

  const handleAnalyzeClick = async () => {
    if (uploadedImage && petType && symptom) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        const file = new File([blob], "upload.png", { type: blob.type });
        formData.append("image", file);

        const res = await fetch(`${host}/predict`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("서버 응답 실패");

        const result = await res.json();
        const diagnosisName = result?.[0]?.predicted_class;

        // 새 로직: diagnosisName이 있으면 바로 챗봇 요청 및 데이터 설정
        if (diagnosisName) {
          const now = new Date();
          const timeString = `오후 ${now.getHours()}:${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          let chatbotData = {};
          try {
            const chatbotRes = await fetch(`${host}/chatbot/ask`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: diagnosisName }),
            });

            if (chatbotRes.ok) {
              chatbotData = await chatbotRes.json();
            } else {
              console.error("챗봇 응답 오류:", await chatbotRes.text());
            }
          } catch (e) {
            console.error("챗봇 요청 실패:", e);
          }

          setDiagnosisData({
            diagnosisName: diagnosisName,
            description: chatbotData.description || "",
            severity: "보통",
            recommendations: "정기적인 관찰이 필요합니다.",
            records: [
              {
                name: diagnosisName,
                status: "보통",
                time: timeString,
                severity: 3,
              },
              {
                name: petType || "반려동물",
                status: "보통",
                time: `오후 ${now.getHours()}:${(
                  now.getMinutes() +
                  Math.floor(Math.random() * 10) +
                  1
                )
                  .toString()
                  .padStart(2, "0")}`,
                severity: 3,
              },
            ],
            detailedResult: chatbotData.mainSymptoms
              ? {
                  symptoms: chatbotData.mainSymptoms,
                  causes: chatbotData.causes,
                  treatment: chatbotData.recommendedTreatment,
                }
              : undefined,
          });
          setSelectedMood(3);
          setActiveTab("result");
        }
      } catch (err) {
        console.error(err);
        alert("분석 도중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="healthcheckup-page">
      {/* 로딩 스피너 오버레이 */}
      {isLoading && <LoadingSpinner />}

      {activeTab === "intro" && (
        <div className="healthcheckup-intro">
          <div className="healthcheckup-intro-content">
            <div className="healthcheckup-title-section">
              <h1 className="healthcheckup-main-title">
                AI 비대면
                <br />
                간단 건강검진
              </h1>
              <img
                src={healthcheckupImage}
                alt="반려동물 의사 일러스트"
                className="healthcheckup-main-image"
              />
            </div>

            <div className="healthcheckup-upload-section">
              <div className="healthcheckup-upload-box">
                <div className="healthcheckup-upload-content">
                  <button
                    className="healthcheckup-upload-button"
                    onClick={() => setActiveTab("upload")}
                  >
                    AI 진단하러 가기
                  </button>
                  <p className="healthcheckup-upload-text">
                    사진으로 쉽게 진단하세요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="healthcheckup-upload">
          <h2>반려동물 건강 체크</h2>
          <p className="healthcheckup-upload-instruction">
            반려동물의 눈 사진을 업로드하면 건강 상태를 분석해드립니다.
          </p>

          <div className="healthcheckup-upload-form">
            <div className="healthcheckup-upload-field">
              <label>반려동물 종류</label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="healthcheckup-select"
                disabled={isLoading}
              >
                <option value="">선택해주세요</option>
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
                <option value="토끼">토끼</option>
                <option value="햄스터">햄스터</option>
                <option value="기니피그">기니피그</option>
              </select>
            </div>

            <div className="healthcheckup-upload-field">
              <label>증상</label>
              <input
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="ex) 강아지가 기운이 없어요"
                className="healthcheckup-input"
                disabled={isLoading}
              />
            </div>

            <div className="healthcheckup-upload-field">
              <label>이미지 업로드</label>
              <div className="healthcheckup-upload-zone" ref={dropAreaRef}>
                {uploadedImage ? (
                  <div className="healthcheckup-preview-container">
                    <img
                      src={uploadedImage}
                      alt="미리보기"
                      className="healthcheckup-preview-image"
                    />
                    <button
                      className="healthcheckup-preview-remove"
                      onClick={() => setUploadedImage(null)}
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="healthcheckup-dropzone-content">
                    <p>증상 사진을 첨부해주세요.</p>
                    <button
                      className="healthcheckup-upload-button"
                      onClick={handleButtonClick}
                      disabled={isLoading}
                    >
                      이미지 선택
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="healthcheckup-file-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              className="healthcheckup-analyze-button"
              onClick={handleAnalyzeClick}
              disabled={!petType || !symptom || !uploadedImage || isLoading}
            >
              {isLoading ? "분석 중..." : "분석하기"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "result" && (
        <div className="healthcheckup-result-page">
          <div className="healthcheckup-result-layout">
            <div className="healthcheckup-result-image-section">
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="분석된 반려동물 이미지"
                  className="healthcheckup-uploaded-image"
                />
              )}
            </div>

            <div className="healthcheckup-result-content">
              <div className="healthcheckup-result-header">
                <h2 className="healthcheckup-result-title">진단 결과</h2>
                <p className="healthcheckup-result-subtitle">
                  '
                  <span className="healthcheckup-highlight">
                    {diagnosisData.diagnosisName}
                  </span>
                  ' 징후가 있는 것 같아요.
                </p>
                {/* Inline disease description right under the title/message */}
                {diagnosisData?.description && (
                  <div className="healthcheckup-description-text" style={{ margin: "1rem 0" }}>
                    <p>{diagnosisData.description}</p>
                  </div>
                )}
                <hr className="healthcheckup-divider" />
              </div>

              <div className="healthcheckup-record-section">
                <h3 className="healthcheckup-record-title">진단 기록</h3>
                <div className="healthcheckup-record-fields">
                  {diagnosisData.records.map((record, index) => (
                    <div key={index} className="healthcheckup-record-field">
                      <span className="healthcheckup-record-label">
                        {record.name}
                      </span>
                      <div className="healthcheckup-record-value">
                        <span className="healthcheckup-record-time">
                          {record.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="healthcheckup-detailed-info">
                <div className="healthcheckup-info-card">
                  <h4 className="healthcheckup-info-title">주요 증상</h4>
                  <ul className="healthcheckup-info-list">
                    {diagnosisData.detailedResult?.symptoms.map(
                      (symptom, index) => (
                        <li key={index} className="healthcheckup-info-item">
                          <span className="healthcheckup-bullet symptom"></span>
                          {symptom}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="healthcheckup-info-card">
                  <h4 className="healthcheckup-info-title">원인</h4>
                  <ul className="healthcheckup-info-list">
                    {diagnosisData.detailedResult?.causes.map(
                      (cause, index) => (
                        <li key={index} className="healthcheckup-info-item">
                          <span className="healthcheckup-bullet cause"></span>
                          {cause}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="healthcheckup-info-card">
                  <h4 className="healthcheckup-info-title">권장 치료</h4>
                  <ul className="healthcheckup-info-list">
                    {diagnosisData.detailedResult?.treatment.map(
                      (treatment, index) => (
                        <li key={index} className="healthcheckup-info-item">
                          <span className="healthcheckup-bullet treatment"></span>
                          {treatment}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>


              <div className="healthcheckup-action-buttons">
                <button className="healthcheckup-primary-button">
                  수의사 상담 예약
                </button>
                <button className="healthcheckup-secondary-button">
                  진단 기록 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthCheckupPage;
