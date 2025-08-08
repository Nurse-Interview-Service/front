import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectJob.css';

const JOBS = [
  { id: 'developer', name: '개발자' },
  { id: 'designer', name: '디자이너' },
  { id: 'marketer', name: '마케터' },
  { id: 'planner', name: '기획자' },
  { id: 'etc', name: '기타' }
];

function _SelectJob() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (selected) {
      navigate('/GenerationLoading', { state: { job: selected } });
    }
  };

  return (
    <div className="select-job-container">
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
        disabled={!selected}
        onClick={handleStart}
      >
        인터뷰 시작
      </button>
    </div>
  );
}

export default _SelectJob;
