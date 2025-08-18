import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { getUserInfoApi } from '../api/authAPI';
import { getGroupedInterviewHistoryApi } from '../api/InterviewAPI';
import './Profile.css'

function Profile() {
  const { user, signIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 사용자 정보 및 인터뷰 내역 조회
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1) 사용자 정보 조회
        const userResult = await getUserInfoApi();
        console.log('사용자 정보 조회 결과:', userResult);
        
        if (userResult.success) {
          setProfileData(userResult.data);
          // UserContext의 user 정보도 업데이트
          if (!user || user.email !== userResult.data.email) {
            signIn(userResult.data.email, userResult.data.username);
          }
        } else {
          setError(userResult.message);
          console.warn('사용자 정보 조회 실패:', userResult.message);
        }

        // 2) 인터뷰 내역 조회
        const historyResult = await getGroupedInterviewHistoryApi();
        console.log('인터뷰 내역 조회 결과:', historyResult);
        
        if (historyResult.success) {
          setInterviewHistory(historyResult.data.sessions || []);
        } else {
          console.warn('인터뷰 내역 조회 실패:', historyResult.message);
          setInterviewHistory([]); // 실패 시 빈 배열
        }
        
      } catch (error) {
        console.error('데이터 조회 중 오류:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, signIn]);

  // 자세히보기 버튼 클릭 핸들러
  const handleViewDetails = (sessionId) => {
    navigate('/selectedresult', { 
      state: { 
        session_id: sessionId 
      } 
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="profile-container">
        <h2>내 프로필</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          사용자 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>내 프로필</h2>
      
      {/* 에러 메시지 표시 */}
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {/* 가로 배치 컨테이너 */}
      <div className="profile-layout">
        
        {/* 왼쪽: 프로필 정보 */}
        <div style={{ 
          flex: '0 0 300px',
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#6366f1', marginBottom: '1rem' }}>
            프로필 정보
          </h3>
          <div className="profile-card">
            <div className="profile-avatar" />
            <div className="profile-info">
              <div><strong>이름:</strong> {profileData?.username || user?.name || '미등록'}</div>
              <div><strong>이메일:</strong> {profileData?.email || user?.email || '미등록'}</div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 인터뷰 내역 */}
        <div style={{ 
          flex: '1',
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#6366f1', marginBottom: '1rem' }}>
            내 인터뷰 내역
          </h3>
          {interviewHistory.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
              아직 인터뷰 내역이 없습니다.
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {interviewHistory.map((session, sessionIdx) => (
                <div
                  key={session.session_id}
                  style={{
                    marginBottom: '2rem',
                    background: '#f8f9fa',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  {/* 세션 헤더 */}
                  <div className="session-header">
                    <div className="session-info">
                      <h4>
                        📋 {session.type} 면접 (세션 #{sessionIdx + 1})
                      </h4>
                      <div className="session-details">
                        <span>📅 {
                          session.created_at 
                            ? new Date(session.created_at).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric',
                                timeZone: 'Asia/Seoul'
                              })
                            : '날짜 정보 없음'
                        }</span>
                        <span>📝 총 {session.question_count}개 질문</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(session.session_id)}
                      className="detail-view-btn"
                    >
                      📊 자세히보기
                    </button>
                  </div>

                  {/* 세션의 인터뷰 목록 */}
                  <div>
                    {session.interviews.map((iv, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: '1rem',
                          background: '#fff',
                          borderRadius: '0.8rem',
                          padding: '1rem',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', color: '#6366f1', marginBottom: '0.5rem' }}>
                          <strong>Q{iv.question_order + 1}:</strong> {iv.question}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#333', marginBottom: '0.5rem' }}>
                          <strong>답변:</strong> {iv.useranswer}
                        </div>
                        {iv.analysis && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#666', 
                            marginTop: '0.5rem', 
                            padding: '0.5rem', 
                            background: '#f8f9fa', 
                            borderRadius: '0.5rem',
                            borderLeft: '3px solid #6366f1'
                          }}>
                            <strong>💡 분석:</strong> {iv.analysis}
                          </div>
                        )}
                        {iv.score && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#6366f1', 
                            marginTop: '0.5rem', 
                            textAlign: 'right',
                            fontWeight: 'bold'
                          }}>
                            📊 점수: {iv.score}점
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
