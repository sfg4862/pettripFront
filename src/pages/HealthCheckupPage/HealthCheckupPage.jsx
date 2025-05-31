import React, { useState, useRef, useEffect, useCallback } from "react";
import "./HealthCheckupPage.style.css";
import healthcheckupImage from "../../images/HealthCheckupPage/healthcheckupimage.png";

function HealthCheckupPage() {
  const [activeTab, setActiveTab] = useState("intro");
  const [petType, setPetType] = useState("");
  const [symptom, setSymptom] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(1);
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

  const diagnosisExamples = [
    {
      diagnosisName: "결막염",
      description:
        "개의 결막은 눈꺼풀 안쪽에서 안구를 보호하는 막으로, 흰자 팰 앞에 위치해있기 때문에 각종 외부환경과 자극에 가장 먼저 노출되는 부위입니다. 결막에 문제가 생겨 염증이 생겨나는 병",
      defaultSeverity: 1,
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
    },
    {
      diagnosisName: "백내장",
      description:
        "백내장은 눈의 수정체가 혼탁해져서 시야가 흐려지는 질환입니다. 노화나 유전적 요인, 외상 등으로 인해 발생할 수 있으며, 초기에는 증상이 미미하지만 진행되면서 시력 저하가 나타납니다.",
      defaultSeverity: 2,
      detailedResult: {
        symptoms: [
          "시야 흐림",
          "야간 시력 저하",
          "빛 번짐",
          "색깔 구분 어려움",
        ],
        causes: ["노화", "유전적 요인", "외상", "당뇨병"],
        treatment: ["정기 검진", "수술적 치료", "보호용 안경", "영양 관리"],
      },
    },
    {
      diagnosisName: "각막염",
      description:
        "각막염은 눈의 가장 바깥쪽 투명한 막인 각막에 염증이 생기는 질환입니다. 세균, 바이러스, 진균 감염이나 외상, 알레르기 등이 원인이 될 수 있으며, 심한 경우 시력 손상을 초래할 수 있습니다.",
      defaultSeverity: 3,
      detailedResult: {
        symptoms: ["심한 눈 통증", "눈물 과다", "빛 공포증", "각막 혼탁"],
        causes: ["세균 감염", "바이러스 감염", "진균 감염", "외상"],
        treatment: ["즉시 치료", "항생제 점안", "진통제", "각막 보호"],
      },
    },
    {
      diagnosisName: "녹내장",
      description:
        "녹내장은 눈 안의 압력이 높아져서 시신경이 손상되는 질환입니다. 초기에는 증상이 거의 없어 발견이 어렵지만, 진행되면 시야가 좁아지고 심한 경우 실명할 수 있습니다.",
      defaultSeverity: 4,
      detailedResult: {
        symptoms: ["시야 좁아짐", "눈 통증", "두통", "시력 저하"],
        causes: ["안압 상승", "유전적 요인", "연령", "스트레스"],
        treatment: ["안압 강하제", "수술적 치료", "정기 검진", "생활습관 개선"],
      },
    },
    {
      diagnosisName: "심각한 각막 손상",
      description:
        "심각한 각막 손상은 외상이나 감염으로 인해 각막에 깊은 상처나 천공이 생긴 상태입니다. 즉시 치료하지 않으면 시력을 완전히 잃을 수 있는 응급상황입니다.",
      defaultSeverity: 5,
      detailedResult: {
        symptoms: [
          "극심한 눈 통증",
          "시력 급격한 저하",
          "눈물과 분비물",
          "빛에 대한 극도의 민감성",
        ],
        causes: ["외상", "심각한 감염", "화학물질 노출", "이물질 손상"],
        treatment: ["응급 수술", "항생제 치료", "통증 관리", "각막 이식"],
      },
    },
  ];

  const handleFiles = useCallback(
    (files) => {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
          if (petType && symptom) {
            setActiveTab("result");
          }
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

  const handleAnalyzeClick = () => {
    if (uploadedImage) {
      generateRandomDiagnosis();
      setActiveTab("result");
    }
  };

  return (
    <div className="healthcheckup-page">
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
                    이미지 업로드
                  </button>
                  <p className="healthcheckup-upload-text">
                    또는 파일 넣기, 붙여넣기
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
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="healthcheckup-dropzone-content">
                    <p>이미지를 여기에 끌어다 놓거나</p>
                    <button
                      className="healthcheckup-upload-button"
                      onClick={handleButtonClick}
                    >
                      파일 선택
                    </button>
                    <p className="healthcheckup-upload-hint">
                      또는 Ctrl+V로 붙여넣기
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="healthcheckup-file-input"
                />
              </div>
            </div>

            <button
              className="healthcheckup-analyze-button"
              onClick={handleAnalyzeClick}
              disabled={!petType || !symptom || !uploadedImage}
            >
              분석하기
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
                <hr className="healthcheckup-divider" />
              </div>

              <div className="healthcheckup-result-description">
                <p>{diagnosisData.description}</p>
              </div>

              <div className="healthcheckup-severity-section">
                <h3 className="healthcheckup-severity-title">종합 결과</h3>
                <div className="healthcheckup-severity-info">
                  <span
                    className="healthcheckup-severity-label"
                    style={{
                      color:
                        moodOptions.find((m) => m.value === selectedMood)
                          ?.color || "#e74c3c",
                    }}
                  >
                    상태 - {diagnosisData.severity}
                  </span>
                </div>

                <div className="healthcheckup-current-mood">
                  <div
                    className="healthcheckup-selected-mood"
                    style={{
                      backgroundColor:
                        moodOptions.find((m) => m.value === selectedMood)
                          ?.color || "#e74c3c",
                    }}
                  >
                    <span className="healthcheckup-selected-emoji">
                      {moodOptions.find((m) => m.value === selectedMood)
                        ?.emoji || "😟"}
                    </span>
                    <span className="healthcheckup-selected-label">
                      {moodOptions.find((m) => m.value === selectedMood)
                        ?.label || "나쁨"}
                    </span>
                  </div>
                </div>

                <div className="healthcheckup-severity-progress">
                  <div
                    className="healthcheckup-severity-bar"
                    style={{
                      width: `${(selectedMood / 5) * 100}%`,
                      backgroundColor:
                        moodOptions.find((m) => m.value === selectedMood)
                          ?.color || "#e74c3c",
                    }}
                  ></div>
                </div>

                <p className="healthcheckup-severity-note">
                  {diagnosisData.recommendations}
                </p>
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
                        <span
                          className={`healthcheckup-tag ${
                            record.severity <= 3 ? "good" : "bad"
                          }`}
                        >
                          {record.status}
                        </span>
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
