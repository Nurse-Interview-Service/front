import { useEffect, useContext, useRef } from 'react';
import { UserContext } from '../UserContext';

export const useKakaoLogin = () => {
  const { signIn } = useContext(UserContext);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const kakaoLogin = urlParams.get('kakao_login');
    
    if (kakaoLogin === 'success') {
      const token = urlParams.get('token');
      const username = urlParams.get('username');
      const email = urlParams.get('email');
      
      if (token && username && email) {
        processedRef.current = true;
        
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        
        signIn(email, username);
        
        window.history.replaceState({}, document.title, window.location.pathname);
        
        alert(`카카오 로그인이 완료되었습니다! 환영합니다, ${username}님!`);
      }
    } else if (kakaoLogin === 'error') {
      const message = urlParams.get('message') || '알 수 없는 오류가 발생했습니다.';
      
      processedRef.current = true;
      
      window.history.replaceState({}, document.title, window.location.pathname);
      
      alert(`카카오 로그인 실패: ${decodeURIComponent(message)}`);
    }
  }, []);
};
