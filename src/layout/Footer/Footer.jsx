import React from "react";
import "../Footer/Footer.style.css";

export const Footer = () => {
  return (
    <div className="footer">
      <div className="text-wrapper">PETTRIP</div>
      <p className="element-all-rights">
        ⓒ 2024. 공공데이터활용대회 All rights reserved.
        <br />
        상호: PETTRIP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 대표:
        시바견&nbsp;&nbsp;&nbsp;&nbsp;개인정보책임자: 불독
        <br />
        소재지: 전북특별자치도 익산시 익산대로 460 원광대학교
      </p>
    </div>
  );
};

export default Footer;
