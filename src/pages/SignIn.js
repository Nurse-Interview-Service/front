import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { loginApi, kakaoLoginApi } from '../api/authAPI';
import './Auth.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(UserContext);
  const navigate = useNavigate();

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
        // 로그인 성공
        const { username, email: userEmail, token } = result.data;
        
        // 토큰을 localStorage에 저장
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', userEmail);
        
        // Context에 사용자 정보 저장
        signIn(userEmail, username);
        
        alert(`로그인 성공! 환영합니다, ${username}님!`);
        navigate('/');
      } else {
        // 로그인 실패
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
    kakaoLoginApi(); // 백엔드로 바로 리다이렉트
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>
      
      {/* 이메일/패스워드 로그인 폼 */}
      <form className="auth-form" onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="패스워드"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {/* 구분선 */}
      <div className="auth-divider">
        <span>또는</span>
      </div>

      {/* 카카오 로그인 */}
      <button type="button" className="kakao-btn" onClick={handleKakaoLogin}>
        <img 
          src="https://developers.kakao.com/assets/img/about/logos/kakaologin/logo/kakaolink_btn_medium.png"
          /*src="kakao_login_medium.png"*/
          alt="Kakao Login" 
          style={{height:'24px', marginRight:'8px', verticalAlign:'middle'}} 
        />
        카카오로 로그인
      </button>
    </div>
  );
}

export default SignIn;
