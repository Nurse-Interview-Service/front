import React, { useState,useContext,useEffect,useRef } from "react";
import "./_GenerationLoading.css";
import Lottie from "lottie-react";
import loadingAnim from "./_loading.json";
import { useLocation, useNavigate } from 'react-router-dom';


 function _GenerationLoading() {
    const navigate = useNavigate();
    const location = useLocation();
    const job = location.state?.job
    const nextPage=()=>{
        navigate("/interview", { state: { job: job } });
     };
    // const nextpage=nextPage();

     const lottieRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      lottieRef.current.stop();
      nextPage();
    }, 200000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);
  return (
<div className="loading-wrapper">
  {/* 말풍선 텍스트 */}
  <div className="speech-bubble">
    <strong>면접 🍯TIP 🍯</strong>
    <br />
    주장에 대한 근거를 명확히 설명해야해요!
  </div>

  {/* Lottie 애니메이션 or 이미지 */}
  <div className="character">
      <div className="character-wrapper">
      <strong className="overlay-text">알고 계셨나요?...</strong>
        <Lottie
          animationData={loadingAnim}
          loop
          autoplay
          className="lottie"
        />

          </div>
    <p className="loading-text">문제 생성중입니다....</p>
  </div>
</div>
 );
}
export default  _GenerationLoading