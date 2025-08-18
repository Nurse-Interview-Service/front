import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Header.css';

function Header() {
  const { user, signOut } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    signOut();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        {/* <Link to="/" className="navbar-brand">
        <img 
      src="logo_img.png" 
      // alt="EchoView 로고" 
      className="navbar-logo" 
    /> */}
    {/* <img 
      src="logo_character.png" 
      // alt="EchoView 로고" 
      className="navbar-logo" 
    /> */}
        <Link to="/" className="navbar-brand">
          EchoView : AI 면접 서비스
        </Link>
          
        {/* </Link> */}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">
              {user.name}님
            </span>
            <Link to="/profile" className="navbar-menu">
              Profile
            </Link>
            <button className="navbar-menu navbar-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="navbar-menu">
              Sign In
            </Link>
            <Link to="/signup" className="navbar-menu">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
