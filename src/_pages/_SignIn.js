import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
import './_SignIn.css';

function SignIn() {
  const { signIn } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => setIsRevealed(true);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 패스워드를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginApi(email, password);

      if (result.success) {
        const { username, email: userEmail, token } = result.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userInfo', JSON.stringify({ username, email: userEmail }));

        signIn(userEmail);

        alert(`로그인 성공! 환영합니다, ${username}님!`);
        navigate('/');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert(error.message || '서버와의 연결에 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleEmailLogin} className="auth-form">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <button type="submit" className="sub-btn" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
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
