import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PetSitterRegisterPage.style.css"
import "../../fonts/Font.style.css";
import regionData from "../../korea_region/reference_json.json";
import axios from 'axios';
import host from "../../host.js";


const PetSitterRegisterPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const formRef = useRef(new FormData());
    const [selectedSido, setSelectedSido] = useState("");
    const [selectedSigungu, setSelectedSigungu] = useState("");
    const [sigunguCode, setSigunguCode] = useState("");
    const [formData, setFormData] = useState({
        user_id: sessionStorage.getItem('user_id'),
        location: "",
        intro: "",
        fullIntro: "",
        activityType: "",
        isImbo: false,
        smallCost: "",
        normalCost: "",
        bigCost: "",
        dayCost: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

        console.log(formData);
    };

    const handleSidoChange = (e) => {
        const sido = e.target.value;
        setSelectedSido(sido);
        setSelectedSigungu("");
        setSigunguCode("");
    };

    const handleSigunguChange = (e) => {
        const sigungu = e.target.value;
        setSelectedSigungu(sigungu);

        // 시군구에 포함된 읍면동 중 첫 번째 항목의 코드 기준으로 시군구 코드 추출
        const firstDong = regionData[selectedSido][sigungu][0];
        const code = firstDong.code.slice(0, 5); // 앞 5자리 = 시군구 코드
        setSigunguCode(code);
        setFormData({
            ...formData,
            location: code,
        })
    };

    const handleSumbit = () => {
        const requiredFields = {
            location: "활동 지역",
            intro: "한줄 소개",
            fullIntro: "펫시터 소개",
            activityType: "활동 요일",
            smallCost: "소형종 비용",
            normalCost: "중형종 비용",
            bigCost: "대형종 비용",
        };

        for (const key in requiredFields) {
            if (!formData[key]) {
                alert(`${requiredFields[key]}을(를) 입력해주세요.`);
                return;
            }
        }

        for (const key in formData) {
            formRef.current.set(key, formData[key]);
        }

        axios.post(`${host}/ps`, formRef.current, {
            headers: {
            }
        })
            .then(r => {
                alert('펫시터가 정상적으로 등록되었습니다!');
            })
            .catch(e => {
                alert('잘못된 요청입니다!');
            })

    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            if (file && file.type.startsWith("image/")) {
                formRef.current.set('media', file);
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImage = {
                        id: Date.now() + Math.random(),
                        src: event.target.result,
                        name: file.name,
                        file: file,
                    };
                    setUploadedImages([newImage]);
                };
                reader.readAsDataURL(file);
                //확인인
            }
        });
        e.target.value = "";

        console.log(uploadedImages);
    };

    const triggerImageUpload = () => {
        fileInputRef.current.click();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);

        files.forEach((file) => {
            if (file && file.type.startsWith("image/")) {
                formRef.current.set('media', file);
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImage = {
                        id: Date.now() + Math.random(),
                        src: event.target.result,
                        name: file.name,
                        file: file,
                    };
                    setUploadedImages([newImage]);
                };
                reader.readAsDataURL(file);
            }
        });
    }


    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeImage = (imageId) => {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    return (

        <div className='ps-rg-container'>
            <h1>펫시터될 준비, 되셨나요?</h1>
            <div className="ps-register-section">
                <div className="ps-image-section">
                    <h3 className="section-title">📷 펫시터 대표 사진을 등록해주세요!</h3>
                    {(uploadedImages.length == 0) ? (
                        <div
                            className="rg-image-drop-zone"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={triggerImageUpload}
                        >
                            <div className="rg-drop-zone-content">
                                <div className="upload-icon">📁</div>
                                <p>클릭하거나 이미지를 드래그해서 업로드하세요</p>
                                <span className="upload-hint">JPG, PNG, GIF 파일 지원</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </div>
                    ) : (
                        <div
                            className="rg-image-drop-zone"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={triggerImageUpload}
                        >
                            <div className="rg-drop-zone-content">
                                <img src={uploadedImages[0].src}></img>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="ps-input-region">
                    <div className="ps-region-question-container">
                        <h2 className="ps-region-question">어디에서 <br />활동하시나요?</h2>
                    </div>
                    <div className="rg-province-city-container">
                        <div className="rg-province-city-dropdown">
                            <select value={selectedSido} onChange={handleSidoChange}>
                                <option value="">시/도 선택</option>
                                {Object.keys(regionData).map((sido) => (
                                    <option key={sido} value={sido}>{sido}</option>
                                ))}
                            </select>

                            <select value={selectedSigungu} onChange={handleSigunguChange} disabled={!selectedSido}>
                                <option value="">시/군/구 선택</option>
                                {selectedSido &&
                                    Object.keys(regionData[selectedSido]).map((sigungu) => (
                                        <option key={sigungu} value={sigungu}>{sigungu}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>
                <hr style={{ border: '1px solid rgb(230, 230, 230)', margin: '20px 0' }} />
                <div className="rg-info-container">
                    <h3>한줄소개</h3>
                    <div className="rg-info-q1">
                        <input
                            type="text"
                            id="intro"
                            name="intro"
                            className="form-input"
                            placeholder="한줄소개를 입력하세요."
                            value={formData.intro}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="rg-info-container">

                    <h3>펫시터<br />소개</h3>
                    <div className="rg-info-q2">
                        <textarea
                            type="text"
                            id="fullIntro"
                            name="fullIntro"
                            className="form-input"
                            placeholder="펫시터님을 소개시켜주세요."
                            value={formData.fullIntro}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <hr style={{ border: '1px solid rgb(230, 230, 230)', margin: '20px 0' }} />
                <div className="rg-time-container">
                    <div className="rg-time-con">
                        <h2>주 활동 요일</h2>
                    </div>
                    <div className="rg-time-select">
                        <div className="rg-time-radio">
                            <form>
                                <label>
                                    <input type="radio"
                                        name="activityType"
                                        value="1"
                                        onChange={handleChange} />
                                    평일
                                </label>
                                <label>
                                    <input type="radio"
                                        name="activityType"
                                        value="2"
                                        onChange={handleChange} />
                                    주말
                                </label>
                                <label>
                                    <input type="radio"
                                        name="activityType"
                                        value="3"
                                        onChange={handleChange} />
                                    무관
                                </label>
                            </form>
                        </div>
                        <div className="temp1">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isImbo"
                                    checked={formData.isImbo}
                                    onChange={handleChange}
                                />
                                기간 임시보호 여부
                            </label>
                        </div>
                    </div>

                </div>
                <hr style={{ border: '1px solid rgb(230, 230, 230)', margin: '20px 0' }} />
                <div>
                    <div className="rg-text">
                        <h2>돌봄 비용(시간당)을 정해주세요.</h2>
                    </div>
                    <div className="rg-type-cost">
                        <h3>소형종: </h3>
                        <input
                            type="text"
                            id="smallCost"
                            name="smallCost"
                            className="form-input"
                            placeholder="소형종의 경우 가격"
                            value={formData.smallCost}
                            onChange={handleChange}
                            required
                        />
                        <span>원</span>
                    </div>
                    <div className="rg-type-cost">
                        <h3>중형종: </h3>
                        <input
                            type="text"
                            id="normalCost"
                            name="normalCost"
                            className="form-input"
                            placeholder="중형종의 경우 가격"
                            value={formData.normalCost}
                            onChange={handleChange}
                            required
                        />
                        <span>원</span>
                    </div>
                    <div className="rg-type-cost">
                        <h3>대형종: </h3>
                        <input
                            type="text"
                            id="bigCost"
                            name="bigCost"
                            className="form-input"
                            placeholder="대형종의 경우 가격"
                            value={formData.bigCost}
                            onChange={handleChange}
                            required
                        />
                        <span>원</span>
                    </div>
                    {formData.canFull &&
                        <div className="rg-type-cost"
                            style={{ 'flex-direction': 'column' }}>
                            <div>
                                <h3>1일기준(기간 임시 보호 가능의 경우) </h3>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="dayCost"
                                    name="dayCost"
                                    className="form-input"
                                    placeholder="하루 임금"
                                    value={formData.dayCost}
                                    onChange={handleChange}
                                    required
                                />
                                <span>원</span>
                            </div>
                        </div>
                    }
                </div>
                <div className="rg-submit-container">
                    <button className="rg-refuse">
                        등록취소
                    </button>
                    <button className="rg-sumbit" onClick={handleSumbit}>
                        등록하기
                    </button>
                </div>

            </div>
        </div >
    );
};


export default PetSitterRegisterPage;