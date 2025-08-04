import React, {useContext, useEffect, useState} from 'react';
import './_ProfileModify.css';
import {UserContext} from "../UserContext";
import {apiGet} from "../api";
import { useNavigate } from "react-router-dom";
const sampleUser ={
    username:"올마이트",
    email:"peace@naver.com",
    profileImage:"/allmight.png",
    profileStatusMessage:"Plus Ultra!"
}
export default function ProfilePage() {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileStatusMessage, setProfileStatusMessage] = useState("");
    //로그인 중이 아니면 SignIn페이지로
     if(!user){navigate('/SignIn');}
    useEffect(() => {
        const userInfo = apiGet('/api/user/info');
            if (userInfo.result==='ok') {
          const data = userInfo.data;
          setEmail(data.email);
          setUsername(data.username);
          //기존 API 외 - 프로필이미지,상태매시지
          setProfileImage(data.image);
          setProfileStatusMessage(data.statusMessage);
        }else{
          console.log('데이터를 가져오지 못했습니다.=>sampleuser사용');
          setEmail(sampleUser.email);
          setUsername(sampleUser.username);
          setProfileImage(sampleUser.image);
          setProfileStatusMessage(sampleUser.statusMessage);
        }
    },[]);
  return (
    <div className="profileModify-container">
      <div className="profile-grid">
        <div className="top-wrapper">
          {/* 왼쪽 위 빈 공간 */}
        <div className="left-top"></div>
        {/* 중앙 프로필 카드 */}
        <div className="profile-card">
          <img src={profileImage} className="profile-image" alt="프로필"/>
          <div className="user-details">
            <p><strong>name:</strong> {username}</p>
            <p><strong>email:</strong> {email}</p>
            <p><strong>상태메시지:</strong> {profileStatusMessage}</p>
          </div>
        </div>

        {/* 오른쪽 위  빈 공간 */}
        <div className="right-top"></div>
        </div>

        <div className="bottom-wrapper">
        {/* 왼쪽 아래 빈 공간 */}
        <div className="side-panel">
          <button className="glass-button">수정하기</button>
          <button className="glass-button">문의하기</button>
        </div>

        {/*아래 가운데 빈 공간*/}
        <div className="edit-panel">
          <h3>수정하기</h3>
          <div className="edit-item">
            <button className="glass-button">프로필 사진 바꾸기</button>
          </div>
          <div className="edit-item">
            <button className="glass-button">상태 메시지 바꾸기</button>
          </div>
          <div className="edit-item">
            <button className="glass-button">비밀번호 바꾸기</button>
          </div>
          <div className="edit-item">
            <button className="glass-button">기타 추가 설정</button>
          </div>
        </div>
        {/*아래 왼쪽 빈 공간*/}
        <div className="bottom-right"></div>
        </div>
      </div>
    </div>
  );
}

