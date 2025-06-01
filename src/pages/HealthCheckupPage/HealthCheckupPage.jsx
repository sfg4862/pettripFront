import React, { useState, useRef, useEffect, useCallback } from "react";
import "./HealthCheckupPage.style.css";
import host from "../../host.js";
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
      description: "결막염은 결막에 염증이 생긴 상태로, 눈곱 증가와 충혈 등의 증상이 나타납니다.",
      defaultSeverity: 2,
      detailedResult: {
        symptoms: ["눈곱 증가", "결막 충혈", "눈물 분비", "눈 가려움"],
        causes: ["세균 감염", "알레르기", "이물질", "건조"],
        treatment: ["항생제 안약", "보호자 관리", "환경 개선", "정기 검진"],
      },
    },
    {
      diagnosisName: "궤양성각막질환",
      description: "각막에 궤양이 생기는 심각한 상태로 빠른 처치가 필요합니다.",
      defaultSeverity: 5,
      detailedResult: {
        symptoms: ["눈 통증", "시력 저하", "각막 혼탁", "눈물 과다"],
        causes: ["외상", "감염", "화학물질", "기계적 자극"],
        treatment: ["응급 수의사 치료", "항생제", "보호렌즈", "수술"],
      },
    },
    {
      diagnosisName: "백내장",
      description: "백내장은 수정체가 혼탁해져 시야가 흐려지는 질환입니다.",
      defaultSeverity: 2,
      detailedResult: {
        symptoms: ["시야 흐림", "야간 시력 저하", "빛 번짐", "색상 구분 어려움"],
        causes: ["노화", "유전", "당뇨병", "외상"],
        treatment: ["정기 검진", "수술", "영양 관리", "보조기구 사용"],
      },
    },
    {
      diagnosisName: "비궤양성각막질환",
      description: "비궤양성 각막질환은 각막에 상처 없이 염증이나 혼탁이 생기는 상태입니다.",
      defaultSeverity: 3,
      detailedResult: {
        symptoms: ["눈물", "결막 충혈", "시력 저하", "가벼운 통증"],
        causes: ["건조", "이물감", "염증", "피로"],
        treatment: ["인공눈물", "항염제", "환경 조절", "보호안대"],
      },
    },
    {
      diagnosisName: "색소침착성각막염",
      description: "각막에 검은 색소가 침착되어 시야에 영향을 줄 수 있는 질환입니다.",
      defaultSeverity: 4,
      detailedResult: {
        symptoms: ["시야 흐림", "눈 흑변", "시력 감소", "빛 민감"],
        causes: ["만성 염증", "자외선", "눈물막 이상", "유전"],
        treatment: ["항염 치료", "UV 차단", "보조 렌즈", "정기 검진"],
      },
    },
    {
      diagnosisName: "안검내반증",
      description: "눈꺼풀이 안쪽으로 말려 속눈썹이 각막을 자극하는 질환입니다.",
      defaultSeverity: 4,
      detailedResult: {
        symptoms: ["눈 가려움", "눈물", "각막 자극", "결막염 동반"],
        causes: ["유전", "외상", "노화", "피부 문제"],
        treatment: ["수술", "인공눈물", "보호 렌즈", "약물 치료"],
      },
    },
    {
      diagnosisName: "안검염",
      description: "눈꺼풀 가장자리에 염증이 생기는 질환으로 가려움과 통증이 동반됩니다.",
      defaultSeverity: 3,
      detailedResult: {
        symptoms: ["눈꺼풀 부종", "통증", "분비물", "피부 껍질"],
        causes: ["세균 감염", "피지선 문제", "알레르기", "기생충"],
        treatment: ["청결 유지", "항생제 연고", "온찜질", "진단 후 치료"],
      },
    },
    {
      diagnosisName: "안검종양",
      description: "눈꺼풀에 발생하는 종양으로 양성 및 악성 모두 존재할 수 있습니다.",
      defaultSeverity: 5,
      detailedResult: {
        symptoms: ["덩어리 발생", "출혈", "눈꺼풀 변형", "통증"],
        causes: ["유전", "자외선", "노화", "염증"],
        treatment: ["조직 검사", "외과적 제거", "재발 모니터링", "약물 보조"],
      },
    },
    {
      diagnosisName: "유루증",
      description: "눈물이 과도하게 흐르는 증상으로 눈 밑 피부염을 유발할 수 있습니다.",
      defaultSeverity: 2,
      detailedResult: {
        symptoms: ["눈물 흘림", "눈 주변 착색", "피부 자극", "냄새"],
        causes: ["눈물길 폐쇄", "과도한 분비", "이물질", "눈꺼풀 문제"],
        treatment: ["눈물길 세척", "항생제", "수술", "피부 관리"],
      },
    },
    {
      diagnosisName: "핵경화",
      description: "노령 동물에게 흔히 나타나는 수정체의 단단해지는 자연스러운 변화입니다.",
      defaultSeverity: 1,
      detailedResult: {
        symptoms: ["시야 흐림", "푸르스름한 눈동자", "빛 번짐", "노안"],
        causes: ["노화"],
        treatment: ["정기 검진", "영양 관리", "수술은 필요 없음", "생활 환경 조절"],
      },
    },
    {
      diagnosisName: "정상",
      description: "이상 징후가 보이지 않으며 눈 건강이 양호한 상태입니다.",
      defaultSeverity: 1,
      detailedResult: {
        symptoms: ["정상 시야", "통증 없음", "충혈 없음", "분비물 없음"],
        causes: ["건강한 눈 상태"],
        treatment: ["정기 검진 유지", "청결 유지", "균형 잡힌 식사", "환경 관리"],
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

        const matched = diagnosisExamples.find(
            (item) => item.diagnosisName === diagnosisName
        );

        if (matched) {
          const now = new Date();
          const timeString = `오후 ${now.getHours()}:${now
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          const severity = matched.defaultSeverity;
          const severityLabel =
              moodOptions.find((m) => m.value === severity)?.label || "보통";

          setDiagnosisData({
            diagnosisName: matched.diagnosisName,
            description: matched.description,
            severity: severityLabel,
            recommendations:
                severity >= 4
                    ? "빠른 시일 내에 동물 병원 방문을 권장드립니다."
                    : "정기적인 관찰이 필요합니다.",
            records: [
              {
                name: matched.diagnosisName,
                status: severityLabel,
                time: timeString,
                severity: severity,
              },
              {
                name: petType || "반려동물",
                status: severityLabel,
                time: `오후 ${now.getHours()}:${(
                    now.getMinutes() + Math.floor(Math.random() * 10) + 1
                )
                    .toString()
                    .padStart(2, "0")}`,
                severity: severity,
              },
            ],
            detailedResult: matched.detailedResult,
          });
          setSelectedMood(severity);
          setActiveTab("result");
        } else {
          alert("백엔드 진단 결과가 사전에 등록된 예시와 일치하지 않습니다.");
        }
      } catch (err) {
        console.error(err);
        alert("분석 도중 오류가 발생했습니다.");
      }
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
                    <p>증상 사진을 첨부해주세요.</p>
                    <button
                      className="healthcheckup-upload-button"
                      onClick={handleButtonClick}
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
