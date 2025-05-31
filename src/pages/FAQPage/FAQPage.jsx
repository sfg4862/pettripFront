import React, { useState } from "react";
import "./FAQPage.style.css";
import "../../fonts/Font.style.css";

const FAQPage = () => {
  // FAQ 아이템 데이터
  const faqItems = [
    {
      question: "펫트립은 어떤 서비스인가요?",
      answer:
        "펫트립은 반려동물의 건강과 성장을 기록하고 관리할 수 있는 서비스입니다. 건강 기록부터 일상 기록, 돌봄 및 여행 서비스까지 반려동물과 관련된 다양한 정보를 제공합니다.",
    },
    {
      question: "펫트립 서비스는 무료인가요?",
      answer:
        "기본적인 서비스는 무료로 제공됩니다. 건강 기록, 일상 관리 등의 기능을 무료로 이용하실 수 있으며, 일부 프리미엄 기능은 유료로 제공될 수 있습니다.",
    },
    {
      question: "반려동물을 어떻게 등록하나요?",
      answer:
        "회원가입 후 마이페이지에서 '반려동물 등록' 버튼을 클릭하여 정보를 입력하시면 됩니다. 이름, 생년월일, 품종, 성별 등 기본 정보를 입력하고 사진을 등록할 수 있습니다.",
    },
    {
      question: "건강 기록은 어떻게 관리되나요?",
      answer:
        "건강 기록 메뉴에서 예방접종, 건강검진, 질병 기록 등을 날짜별로 등록하고 관리할 수 있습니다. 기록된 데이터는 그래프 및 차트로 시각화되어 건강 상태를 한눈에 확인할 수 있습니다.",
    },
    {
      question: "문의사항이 있을 경우 어디로 연락해야 하나요?",
      answer:
        "고객센터 메뉴 또는 하단의 이메일(support@petstrip.com)로 문의하시면 빠른 시일 내에 답변드리겠습니다.",
    },
  ];

  // 열린 FAQ 아이템 상태 관리
  const [openItem, setOpenItem] = useState(null);

  // FAQ 아이템 클릭 핸들러
  const handleItemClick = (index) => {
    if (openItem === index) {
      setOpenItem(null); // 이미 열려있는 경우 닫기
    } else {
      setOpenItem(index); // 새로운 아이템 열기
    }
  };

  return (
    <div className="faq-page">
      <main className="faq-content">
        <section className="faq-header">
          <h1 className="faq-english-title">Common Questions</h1>
          <h2 className="faq-korean-title">자주 묻는 질문</h2>
          <div className="faq-divider"></div>
        </section>

        <section className="faq-list">
          {faqItems.map((item, index) => (
            <div
              className={`faq-item ${openItem === index ? "open" : ""}`}
              key={index}
              onClick={() => handleItemClick(index)}
            >
              <div className="faq-question">
                <span className="faq-plus">+</span>
                <h3>{item.question}</h3>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
              <div className="faq-item-divider"></div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default FAQPage;
