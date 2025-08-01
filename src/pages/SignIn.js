import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import './SignIn.css';

function SignIn() {
  const { signIn } = useContext(UserContext);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => setIsRevealed(true);

  const handleKakaoLogin = () => {
    alert('카카오 로그인 시도! (실제 서비스는 카카오 SDK 연동 필요)');
    signIn('kakao_user@email.com');
  };

  const gridSize = 10;
  const center = (gridSize - 1) / 2;

  return (
    <div className="login-scene">
      <div className="login-container" 
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}>
        <div className="grid-overlay">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const delay = Math.abs(center - row) + Math.abs(center - col);
            return (
              <div
                key={index}
                className={`grid-tile ${isRevealed ? 'revealed' : ''}`}
                style={{ '--i': delay }}
              ></div>
            );
          })}
        </div>

        <div className={`center ${isRevealed ? 'fade-in' : ''}`}>
          <h2>Sign In</h2>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <div className="divider">or</div>
          <div className="kakao-btn-wrapper">
            <button className="kakao-circle-btn" onClick={handleKakaoLogin}>
              <span className="kakao-k">K</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
