import React from 'react';
import './InterviewBox.css';

function InterviewBox({ item }) {
  const { question, useranswer, LLM_gen_answer, analysis, score } = item;
  const analysisLines = (analysis || '').split('\n');
  const refinedAnswerLine = analysisLines.find(line => line.includes('수정된 답변')) || '';
  const refinedAnswer = refinedAnswerLine.replace('수정된 답변:', '').trim();
  const otherAnalysis = analysisLines.filter(line => !line.includes('수정된 답변'));

  return (
    <div className="interview-box">
      <div className="row">
        <h3>Q.{question}</h3>
        <div className="divider-line"></div>
      </div>
      <div className="row">
        <h2>유저 답변</h2>
        <p>{useranswer}</p>
      </div>
      <div className="row">
        <h3>AI 권장 답변</h3>
        <p>{LLM_gen_answer}</p>
      </div>
      <div className="row analysis">
        <h3>분석 결과</h3>
        <div className="analysis-content">
          {otherAnalysis.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      </div>
      {refinedAnswer && (
        <div className="row refined-answer">
          <h3>수정된 답변</h3>
          <div className="refined-box highlight">{refinedAnswer}</div>
        </div>
      )}
      <div className="row score">
        <span>⭐ 점수</span>
        <span className="score-value">{score}점</span>
      </div>
    </div>
  );
}

export default InterviewBox;
