import React, { useEffect, useState } from 'react';
import './Typing.css';

const endings = [
  "행복한 하루 보내세요 (˶ᵔ ᵕ ᵔ˶)",
  "즐거운 하루 되세요 (۶•̀ᴗ•́)۶",
  "좋은 결과 있기를 바랍니다 ദ്ദി（• ˕ •)"
];

const typingSpeed = 120; 
const deletingSpeed = 60;
const holdDuration = 1500;

function TypingMent({ name = "지원자" }) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  const current = endings[index % endings.length];

  useEffect(() => {
    const delay = isDeleting ? deletingSpeed : typingSpeed;

    const timer = setTimeout(() => {

      if (!isDeleting && charIdx < current.length) {
        setText(current.substring(0, charIdx + 1));
        setCharIdx((prev) => prev + 1);

      } else if (isDeleting && charIdx > 0) {
        setText(current.substring(0, charIdx - 1));
        setCharIdx((prev) => prev - 1);

      } else if (!isDeleting && charIdx === current.length) {
        setTimeout(() => setIsDeleting(true), holdDuration);

      } else if (isDeleting && charIdx === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % endings.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, index, current]);

  return (
    <div className="typing-wrapper">
      <h1 className="fixed-ment">기다려주셔서 감사합니다.</h1>
      <h1 className="fixed-ment">{name}님의 면접 분석 결과입니다.</h1>
      <h1 className="typing-footer">{text}</h1>
    </div>
  );
}

export default TypingMent;
