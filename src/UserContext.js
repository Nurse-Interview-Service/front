import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email }
  const [interviews, setInterviews] = useState([]); // [{ job, answers, date }]

  // 페이지 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const savedInterviews = localStorage.getItem('interviews');
    
    if (token && username && email) {
      console.log('저장된 사용자 정보 복원:', { username, email });
      setUser({
        name: username,
        email: email
      });
    }
    
    // 면접 내역 복원
    if (savedInterviews) {
      try {
        const parsedInterviews = JSON.parse(savedInterviews);
        setInterviews(parsedInterviews);
        console.log('저장된 면접 내역 복원:', parsedInterviews);
      } catch (error) {
        console.error('면접 내역 복원 실패:', error);
      }
    }
  }, []);

  const signUp = (name, email) => {
    setUser({ name, email });
  };

  const signIn = (email, username) => {
    // 사용자 정보 설정
    const userData = { 
      name: username || user?.name || '홍길동', 
      email 
    };
    setUser(userData);
    
    // localStorage에 사용자 정보 저장 (새로고침 시 유지되도록)
    localStorage.setItem('username', userData.name);
    localStorage.setItem('email', userData.email);
    
    console.log('사용자 로그인:', userData);
  };

  const signOut = () => {
    // 로그아웃 - localStorage와 state 정리
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('interviews');
    
    setUser(null);
    setInterviews([]);
    
    console.log('사용자 로그아웃');
  };

  const addInterview = (job, answers) => {
    const newInterview = { job, answers, date: new Date().toISOString().slice(0, 10) };
    const updatedInterviews = [...interviews, newInterview];
    
    setInterviews(updatedInterviews);
    
    // localStorage에 면접 내역 저장 (새로고침 시 유지되도록)
    localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    
    console.log('면접 내역 추가:', newInterview);
  };

  return (
    <UserContext.Provider value={{ user, signUp, signIn, signOut, interviews, addInterview }}>
      {children}
    </UserContext.Provider>
  );
}
