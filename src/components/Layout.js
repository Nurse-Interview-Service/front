import React from 'react';
import Header from '../components/Header';
import { useKakaoLogin } from '../hooks/useKakaoLogin';

function Layout({ children }) {
  useKakaoLogin();
  return (
    <>
      <Header />
      <div className="App">
        {children}
      </div>
    </>
  );
}

export default Layout;
