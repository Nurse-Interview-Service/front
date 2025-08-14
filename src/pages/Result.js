import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnalysisInfoApi } from '../api/InterviewAPI';
import InterviewBox from '../components/InterviewBox';
import TypingMent from '../components/Typing';
import ScoreChart from '../components/ScoreChart';
import './Result.css';
import '../components/AnalyzingOverlay.css';

// API 실패 시 사용할 샘플 데이터
const sampleData = {
  "InterviewList": [
    {
      "question": "자기소개 해주세요.",
      "useranswer": "안녕하세요, 저는 책임감 있고 소통을 중요하게 생각하는 지원자 홍길동입니다. 대학 시절 여러 프로젝트에 참여하며 개발뿐 아니라 기획과 협업 경험을 쌓았고, 현재는 풀스택 개발자로 성장 중입니다.",
      "LLM gen answer": "지원자는 자신을 명확하게 표현하고 핵심 역량을 잘 언급했습니다. 다만 '프로젝트'에 대한 구체적인 사례가 없고, 강점을 뒷받침하는 경험이 부족해 설득력이 떨어집니다.",
      "analysis": "분석내용: 어조는 침착하고 시선도 안정적이었음. 표정에서 긴장감은 있었으나 과도하지 않았음. \n미흡한점: 구체적인 프로젝트 사례가 없어 실제 경험 기반의 자기소개로 보기엔 아쉬움.\n개선점: 예시를 하나 넣어 신뢰도를 높이면 좋음.\n수정된 답변: 안녕하세요, 저는 책임감을 기반으로 협업을 중시하는 홍길동입니다. 대학 시절 팀 프로젝트에서 팀장을 맡아 React와 Firebase로 웹앱을 개발했으며, 일정과 소통을 총괄하며 프로젝트를 성공적으로 완수했습니다. 이런 경험을 통해 실무 중심의 커뮤니케이션 능력을 키웠습니다.",
      "score": 85
    },
    {
      "question": "최근 사용한 기술 스택은?",
      "useranswer": "최근에는 React와 Flask를 이용해서 예약 시스템을 개발했습니다. 프론트엔드는 React로 구성했고, Flask로 API 서버를 구축했습니다. MongoDB를 데이터베이스로 사용했습니다.",
      "LLM gen answer": "기술 스택에 대한 설명은 명확하나, 기술을 선택한 이유나 해결한 문제에 대한 언급이 없어 실무 역량이 충분히 드러나지 않습니다.",
      "analysis": "분석내용: 말은 또렷하고 전달력은 좋았음. 다만 내용은 나열식으로 기술되어 면접관의 관심을 끌기엔 부족했음.\n미흡한점: 단순한 기술 나열. 해당 기술이 사용된 배경과 결과가 빠짐.\n개선점: 기술 선택 이유와 구현 성과 또는 문제 해결 경험을 추가.\n수정된 답변: 최근에는 React와 Flask를 사용해 병원 예약 시스템을 개발했습니다. 프론트엔드는 사용자 친화적인 UI를 구현하기 위해 React를, 백엔드는 빠른 REST API 개발을 위해 Flask를 사용했습니다. 인증은 JWT를, DB는 MongoDB로 구성해 빠른 검색이 가능하도록 최적화했습니다.",
      "score": 78
    },
    {
      "question": "협업 중 갈등 해결 사례는?",
      "useranswer": "프로젝트 중 디자이너와 기능 우선순위를 두고 의견 충돌이 있었는데, 각자의 입장을 정리해 회의에서 공유하고 사용자 피드백을 기반으로 의사결정을 내렸습니다.",
      "LLM gen answer": "협업 상황을 명확히 설명하고 해결 과정도 논리적이지만, 감정적 갈등의 디테일이나 리더십 요소는 부족해 인상 깊지 않음.",
      "analysis": "분석내용: 침착한 어조와 중립적인 시선 처리로 긍정적인 인상. 논리 전개는 좋았으나 구체적 상황 묘사가 부족했음.\n미흡한점: '의견 충돌'의 강도나 해결의 주도성 부족. 본인의 역할이 불명확함.\n개선점: 자신이 어떻게 조율했는지를 강조하면 리더십 어필 가능.\n수정된 답변: 프로젝트 중 디자이너는 사용성, 저는 개발 난이도를 우선시해 우선순위 충돌이 있었습니다. 저는 두 입장을 문서화해 정리한 뒤 사용자 대상 테스트를 통해 우선순위를 조정했고, 결과적으로 일정과 품질을 모두 지킬 수 있었습니다.",
      "score": 82
    }
  ],
  "summary": "SampleData : 지원자는 전반적으로 명확한 어조와 침착한 태도를 유지하며 좋은 인상을 주었습니다. 특히 협업에 있어 논리적인 문제 해결 접근을 보였고, 기술 스택에 대한 이해도도 기본 이상이었습니다. 다만 전반적으로 '구체성'이 부족해 실무 능력을 강조하기에는 설득력이 다소 약했습니다. 이후에는 경험 중심의 답변 구성과 수치·성과 중심의 표현 연습이 필요합니다.",
  "video": "interview_20250728_user1234.mp4"
};

function Result() {
  const location = useLocation();
  const sessionId = location.state?.session_id || null;
  const username = JSON.parse(localStorage.getItem('userInfo') || '{}').username || '게스트';
  const [interviewList, setInterviewList] = useState([]);
  const [summary, setSummary] = useState('');
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    getAnalysisInfoApi(sessionId)
      .then(result => {
        if (result.success) {
          const data = result.data;
          console.log('API 응답 데이터:', data);
          
          setInterviewList(data.InterviewList || []); 
          setSummary(data.summary || '');
          
          // 모든 인터뷰 항목에서 비디오 URL 수집
          const videoUrls = data.InterviewList?.filter(item => item.video).map(item => item.video) || [];
          setVideos(videoUrls);
          console.log("모든 비디오 설정 완료:", videoUrls);

        } else {
          console.error('API 실패:', result.message);
          setInterviewList(sampleData.InterviewList || []);
          setSummary(sampleData.summary || '');
          setVideos([sampleData.video || '']);
        }
        setAnalysisComplete(true);
      })
      .catch(error => {
        console.error('API 호출 중 오류:', error);
        setInterviewList(sampleData.InterviewList || []);
        setSummary(sampleData.summary || '');
        setVideos([sampleData.video || '']);
        setAnalysisComplete(true);
      });
  }, [sessionId]);

  // 분석 완료 후 3초 뒤 로딩 해제
  useEffect(() => {
    if (!analysisComplete) return;
    const id = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3초 뒤
    return () => clearTimeout(id);
  }, [analysisComplete]);

  // 이전/다음 비디오 네비게이션 함수
  const goToPreviousVideo = () => {
    setCurrentVideoIndex(prev => Math.max(0, prev - 1));
  };

  const goToNextVideo = () => {
    setCurrentVideoIndex(prev => Math.min(videos.length - 1, prev + 1));
  };

  const goToVideo = (index) => {
    setCurrentVideoIndex(index);
  };

  if (loading) {
    return (
      <div className="analyzing-overlay">
        <div className="analyzing-card">
          <div className="analyzing-spinner" />
          <div className="analyzing-text">면접 결과를 분석 중...</div>
          <div className="analyzing-subtext">잠시만 기다려주세요.</div>
        </div>
      </div>
    );
  }

  return (

    <div className="result-container">
      <div className="padd">
        <div className="vd">
          {/* 모든 비디오 표시 */}
          {videos.length > 0 ? (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                color: '#6366f1', 
                fontSize: '1.2rem',
                borderBottom: '2px solid #6366f1',
                paddingBottom: '0.5rem',
                textAlign: 'center'
              }}>
                📹 면접 영상 ({currentVideoIndex + 1}/{videos.length})
              </h3>
              
              {/* 현재 비디오 표시 */}
              <div style={{ 
                background: '#f8f9fa',
                padding: '0.5rem',
                borderRadius: '0.6rem',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <video 
                  key={currentVideoIndex} // 비디오가 변경될 때 리렌더링을 위한 키
                  controls 
                  width="100%" 
                  style={{ 
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '1600px',
                  }}
                >
                  <source src={videos[currentVideoIndex]} type="video/webm" />
                  <source src={videos[currentVideoIndex]} type="video/mp4" />
                  영상이 지원되지 않는 브라우저입니다.
                </video>

                {/* 네비게이션 버튼 */}
                {videos.length > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginTop: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <button
                      onClick={goToPreviousVideo}
                      disabled={currentVideoIndex === 0}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.4rem',
                        border: 'none',
                        background: currentVideoIndex === 0 ? '#e0e0e0' : '#6366f1',
                        color: currentVideoIndex === 0 ? '#999' : 'white',
                        cursor: currentVideoIndex === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (currentVideoIndex !== 0) {
                          e.target.style.background = '#5048e5';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentVideoIndex !== 0) {
                          e.target.style.background = '#6366f1';
                        }
                      }}
                    >
                      ← 이전
                    </button>

                    <span style={{
                      padding: '0.5rem 0.8rem',
                      background: 'white',
                      borderRadius: '0.4rem',
                      color: '#6366f1',
                      fontWeight: '600',
                      border: '1px solid #6366f1',
                      fontSize: '0.9rem'
                    }}>
                      {currentVideoIndex + 1} / {videos.length}
                    </span>

                    <button
                      onClick={goToNextVideo}
                      disabled={currentVideoIndex === videos.length - 1}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.4rem',
                        border: 'none',
                        background: currentVideoIndex === videos.length - 1 ? '#e0e0e0' : '#6366f1',
                        color: currentVideoIndex === videos.length - 1 ? '#999' : 'white',
                        cursor: currentVideoIndex === videos.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (currentVideoIndex !== videos.length - 1) {
                          e.target.style.background = '#5048e5';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentVideoIndex !== videos.length - 1) {
                          e.target.style.background = '#6366f1';
                        }
                      }}
                    >
                      다음 →
                    </button>
                  </div>
                )}

                {/* 비디오 인덱스 점(dots) */}
                {videos.length > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '0.3rem' 
                  }}>
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToVideo(index)}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          background: index === currentVideoIndex ? '#6366f1' : '#ddd',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={`영상 ${index + 1}로 이동`}
                        onMouseOver={(e) => {
                          if (index !== currentVideoIndex) {
                            e.target.style.background = '#bbb';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (index !== currentVideoIndex) {
                            e.target.style.background = '#ddd';
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem', 
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📹</div>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>면접 영상이 없습니다.</p>
            </div>
          )}

          <ScoreChart
            scores={{
              구체성: 80,
              논리성: 65,
              적합성: 75,
              표현력: 70,
              전문성: 60
            }}
          />

        </div>

        <div className="result">
          <div className="result-summary">
            <TypingMent name={username}/>
            <p>{summary}</p>
          </div>

          {interviewList && interviewList.length > 0 ? (
            interviewList.map((item, idx) => (
              <InterviewBox key={idx} item={item} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>면접 결과 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default Result;