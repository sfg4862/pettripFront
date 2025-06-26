import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PetSitterMainPage.style.css"
import PetSitterReservePage from "../PetSitterReservePage/PetSitterReservePage";
import axios from "axios";
import host from "../../host";


const PetSitterMainPage = () => {
    const navigate = useNavigate();
    const [isPetSitter, setIsPetSitter] = useState(0);
    const [isLoading, setIsLoading] = useState(0);

    useEffect(() => {
        if (!sessionStorage.getItem('user_id')) {
            setIsPetSitter(0);
            setIsLoading(1);
            return;
        }
        axios.get(`${host}/user/${sessionStorage.getItem('user_id')}`)
            .then((r) => {
                if (r.data.user_grade == "petsitter") {
                    setIsPetSitter(1);
                    setIsLoading(1);
                }
                else {
                    setIsPetSitter(0);
                    setIsLoading(1);
                }
            })
    }, []);
    //펫시터면 등록버튼 내용 바뀌게 수정

    return (
        <div className="psMainPage-wrapper">
            <div className="ps-background" />
            <div className="psMainPage-container">
                {isLoading ? (
                    <div className="psMainPage-btnContainer">
                        <div className="psMainPage-search" onClick={() => {
                            if (sessionStorage.getItem('user_id')) navigate('/petsitter/search');
                            else {
                                alert("로그인 또는 회원가입을 먼저 진행해주세요!");
                                navigate('/login');
                            }
                        }}>
                            <div className="psmp-des">일정기간 반려동물을 봐줄<br /> 펫시터가 필요하신가요?</div>
                            <div><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.5 6.5 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>펫시터 찾기</div>
                        </div>
                        {isPetSitter ? (
                            <div className="psMainPage-manage" onClick={() => {
                                if (sessionStorage.getItem('user_id')) navigate('/reservations');
                                else {
                                    alert("로그인 또는 회원가입을 먼저 진행해주세요!");
                                    navigate('/login');
                                }
                            }}>
                                <div className="psmp-des">이미 펫시터 시군요!</div>
                                <div>펫시터 관리</div>
                            </div>
                        ) : (
                            <div className="psMainPage-register" onClick={() => {
                                if (sessionStorage.getItem('user_id')) navigate('/petsitter/register');
                                else {
                                    alert("로그인 또는 회원가입을 먼저 진행해주세요!");
                                    navigate('/login');
                                }
                            }}>
                                <div className="psmp-des">아직 펫시터가 아니시군요 <br /> 저희와 함께해요!</div>
                                <div >펫시터 등록하기</div>
                            </div>
                        )}
                    </div>
                ) : ("")}
            </div>
        </div>
    );
};

export default PetSitterMainPage;