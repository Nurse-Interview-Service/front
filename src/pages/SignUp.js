import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { signupApi, verifyEmailApi } from '../api/authAPI';
import './Auth.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const { signUp } = useContext(UserContext);
  const navigate = useNavigate();

  // 이메일 중복확인 함수
  const handleEmailCheck = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const result = await verifyEmailApi(email);

      if (result.success) {
        if (result.exists) {
          alert('이미 사용 중인 이메일입니다.');
          setEmailAvailable(false);
        } else {
          alert('사용 가능한 이메일입니다.');
          setEmailAvailable(true);
        }
        setEmailChecked(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('이메일 확인 오류:', error);
      alert(error.message || '이메일 확인 중 문제가 발생했습니다.');
    }
  };

  // 이메일 변경 시 중복확인 상태 초기화
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailChecked(false);
    setEmailAvailable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!emailChecked || !emailAvailable) {
      alert('이메일 중복확인을 해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signupApi(email, password, name);

      if (result.success) {
        // 회원가입 성공
        const { username, email: userEmail, token } = result.data;
        
        // 토큰을 localStorage에 저장
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify({ username, email: userEmail }));
        
        // Context에 사용자 정보 저장
        signUp(username, userEmail);
        
        alert(`${username}님 환영합니다! 회원가입이 완료되었습니다.`);
        navigate('/'); // 메인 페이지로 이동
      } else {
        // 회원가입 실패
        alert(result.message);
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert(error.message || '서버와의 연결에 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="auth-input"
        />
        <div className="email-input-container">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
            required
            className="auth-input email-input-with-btn"
          />
          <button
            type="button"
            onClick={handleEmailCheck}
            className="email-check-btn-inline"
            disabled={!email || isLoading}
          >
            {isLoading ? '확인중' : '중복확인'}
          </button>
        </div>
        {emailChecked && (
          <div className={`email-check-result ${emailAvailable ? 'available' : 'unavailable'}`}>
            {emailAvailable ? '✓ 사용 가능한 이메일입니다.' : '✗ 이미 사용 중인 이메일입니다.'}
          </div>
        )}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
