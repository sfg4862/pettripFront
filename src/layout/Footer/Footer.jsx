import React from "react";
import "../Footer/Footer.style.css";

export const Footer = () => {
  return (
    <div className="footer">
      <div className="text-wrapper">PETTRIP</div>
      <p className="element-all-rights">
        ⓒ 2024. 기업연계프로젝트 All rights reserved.
        <br />
        상호: PETTRIP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 대표:
        차지태&nbsp;&nbsp;&nbsp;&nbsp;개인정보책임자: 차지태
        <br />
        소재지: 전북특별자치도 익산시 익산대로 460 원광대학교
      </p>
    </div>
  );
};

export default Footer;
