import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const tabData = [
  {
    id: 1,
    text: '면접 질문 - LLM 생성',
    // imgSrc: 'https://placehold.co/1200x750/3B82F6/FFFFFF?text=LLM+%E1%84%86%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%B8+%E1%84%8C%E1%85%B5%E1%86%AF%E1%84%86%E1%85%AE%E1%86%AB+%E1%84%89%E1%85%A2%E1%86%BC%E1%84%89%E1%85%A5%E1%86%BC&font=noto-sans-kr',
    imgSrc: 'question_gen.mov',
  },
  {
    id: 2,
    text: '면접 화면',
    // imgSrc: 'https://placehold.co/1200x750/10B981/FFFFFF?text=%E1%84%86%E1%85%A9%E1%84%8B%E1%85%B4+%E1%84%86%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%B8&font=noto-sans-kr',
    imgSrc: 'interview_example.mov',
  },
  // {
  //   id: 3,
  //   text: '실전 면접',
  //   // imgSrc: 'https://placehold.co/1200x750/8B5CF6/FFFFFF?text=%E1%84%89%E1%85%B5%E1%86%AF%E1%84%8C%E1%85%A5%E1%86%AB+%E1%84%86%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%B8&font=noto-sans-kr',
  //   imgSrc: 'result.png',
  // },
  {
    id: 3,
    text: '면접 내용 분석&피드백',
    // imgSrc: 'https://placehold.co/1200x750/F59E0B/FFFFFF?text=%E1%84%87%E1%85%AE%E1%86%AB%E1%84%89%E1%85%A5%E1%86%A8+%26+%E1%84%91%E1%85%B5%E1%84%83%E1%85%B3%E1%84%87%E1%85%A2%E1%86%A8&font=noto-sans-kr',
    imgSrc: 'interview_analysis.mov',
  },
];


function Home() {
  // 기본으로 '실전 면접' 탭이 선택되도록 설정합니다.
  const [selectedTab, setSelectedTab] = useState(tabData[0]);

  return (
    <div className="home-wrapper">
      {/* 애니메이션 배경을 위한 컨테이너 */}
      <div className="background-container">
        <div className="blob-c1"></div>
        <div className="blob-c2"></div>
        <div className="blob-c3"></div>
        <div className="blob-c4"></div>
        <div className="blob-c5"></div>
        <div className="blob-c6"></div>
        <div className="blob-c7"></div>
        <div className="blob-c8"></div>
      </div>

      {/* 기존 콘텐츠는 content-container로 감싸서 배경 위에 오도록 처리 */}
      <div className="content-container">
        <div className='home-title'>
          <h1>AI 기반 개인 면접 서비스</h1>
          {/* <h1>AI-Based Personal Interview Service</h1> */}
          <p className='home-subtitle'>
            실제 면접처럼, 다양한 분야의 질문을 AI가 제공합니다.<br />
            준비된 인터뷰로 실력을 점검해보세요!
          </p>
          <Link to="/select-job">
            <button className="main-btn mt-4">면접 시작하기</button>
          </Link>
        </div>

        <div className="home-explains">
          {/* tabData를 기반으로 버튼들을 동적으로 생성합니다. */}
          {tabData.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selectedTab.id === tab.id}
              className={`tab ${selectedTab.id === tab.id ? 'selected' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.text}
            </button>
          ))}
        </div>

        {/* 탭 선택에 따라 이미지를 표시하는 컨테이너 */}
        <div className="home-content-area">
          <video
            key={selectedTab.id} // key를 변경하여 이미지가 바뀔 때마다 애니메이션이 다시 실행되도록 함
            src={selectedTab.imgSrc}
            alt={`${selectedTab.text} 기능 시연 이미지`}
            className="tab-image"
            autoPlay
            muted
            loop
            playsInline
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x750/CCCCCC/FFFFFF?text=Image+Not+Found'; }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
