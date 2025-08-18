import React, { useState } from 'react';
import './SignUp.css';


function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${name}님 환영합니다!`);
  };

  const handleFocus = (index) => {
    setActiveIndex(index);
  };

  return (

  <div className="su-container">
    <div className="su-box">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onFocus={() => handleFocus(0)}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onFocus={() => handleFocus(1)}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onFocus={() => handleFocus(2)}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="sub-btn">회원가입</button>
      </form>
    </div>
  </div>
  );
}

export default SignUp;
