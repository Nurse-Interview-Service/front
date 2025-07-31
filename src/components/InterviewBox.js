import React from 'react';
import './InterviewBox.css';

function InterviewBox({ item }) {
  const { question, useranswer, 'LLM gen answer': llmAnswer, analysis, score } = item;

  return (
    <div className="interview-box">
      <h2>💬 질문: {question}</h2>
      <p><strong>🙋 유저 답변:</strong> {useranswer}</p>
      <p><strong>🤖 LLM 분석:</strong> {llmAnswer}</p>
      <p><strong>📊 분석 결과:</strong><br />{analysis.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
      <p><strong>⭐ 점수:</strong> {score}점</p>
    </div>
  );
}

export default InterviewBox;
