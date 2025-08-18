import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterviewApi } from '../api/InterviewAPI';
import './SelectJob.css';

const JOBS = [
  { id: 'nurse', name: '간호사' },
  { id: 'developer', name: '개발자' },
  { id: 'doctor', name: '의사' },
  { id: 'planner', name: '기획자' },
  { id: 'etc', name: '인성질문' }
];

function SelectJob() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!selected) return;
    
    setLoading(true);
    
    try {
      const result = await startInterviewApi(selected);
      
      console.log('API 결과:', result); // 디버깅용
      
      if (result.success) {
        console.log('질문 목록:', result.data.questionList); // 디버깅용
        console.log('세션 ID:', result.data.session_id); // 디버깅용

        // API에서 받은 질문 목록 저장
        setQuestionData({
          job: selected,
          questions: result.data.questionList,
          session_id: result.data.session_id
        });
      } else {
        console.warn('API 실패, 기본 질문으로 진행:', result.message);
        // API 실패 시 기본 질문으로 진행
        setQuestionData({
          job: selected
        });
      }
    } catch (error) {
      console.error('면접 시작 오류:', error);
      console.warn('API 오류로 기본 질문으로 진행');
      
      // API 오류 시에도 기본 질문으로 면접 진행
      setQuestionData({
        job: selected
      });
    }
  };

  // 질문 생성 완료 후 3초 뒤 인터뷰 페이지로 이동
  useEffect(() => {
    if (!loading || !questionData) return;
    const id = setTimeout(() => {
      navigate('/interview', { 
        state: questionData,
        replace: true 
      });
      setLoading(false);
    }, 3000); // 3초 뒤
    return () => clearTimeout(id);
  }, [loading, questionData, navigate]);

  return (
    <div className="select-job-container">
      {loading ? (
        <div className="analyzing-overlay">
          <div className="analyzing-card">
            <div className="analyzing-spinner"></div>
            <div className="analyzing-text">인터뷰 질문을 생성하고 있습니다...</div>
            <div className="analyzing-subtext">잠시만 기다려주세요</div>
          </div>
        </div>
      ) : (
        <>
          <h2>어떤 분야/직업의 면접을 진행할까요?</h2>
          <ul className="job-list">
            {JOBS.map(job => (
              <li key={job.id}>
                <label>
                  <input
                    type="radio"
                    name="job"
                    value={job.id}
                    checked={selected === job.id}
                    onChange={() => setSelected(job.id)}
                  />
                  {job.name}
                </label>
              </li>
            ))}
          </ul>
          <button
            className="start-btn"
            disabled={!selected || loading}
            onClick={handleStart}
          >
            {loading ? '질문을 불러오는 중...' : '인터뷰 시작'}
          </button>
        </>
      )}
    </div>
  );
}

export default SelectJob;
