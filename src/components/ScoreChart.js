import React from 'react';
import './ScoreChart.css';

function ScoreChart({ scores }) {
  const { 구체성 = 0, 논리성 = 0, 적합성 = 0 } = scores;

  const getBarStyle = (value) => ({
    width: `${value}%`,
    backgroundColor:
      value >= 80 ? '#4caf50' :
      value >= 60 ? '#ffb74d' :
      '#f44336'
  });

  return (
    <div className="score-chart">
      <h3>면접 요소별 평가</h3>
      <div className="score-item">
        <span>구체성</span>
        <div className="bar">
          <div className="bar-fill" style={getBarStyle(구체성)} />
        </div>
      </div>
      <div className="score-item">
        <span>논리성</span>
        <div className="bar">
          <div className="bar-fill" style={getBarStyle(논리성)} />
        </div>
      </div>
      <div className="score-item">
        <span>직무 적합성</span>
        <div className="bar">
          <div className="bar-fill" style={getBarStyle(적합성)} />
        </div>
      </div>
    </div>
  );
}

export default ScoreChart;
