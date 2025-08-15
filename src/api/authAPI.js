import { apiPost, apiGet } from './index';

// Login API
export const loginApi = async (email, password) => {
  const response = await apiPost('/api/auth/login', {
    email,
    password
  });

  if (response.result === 'ok') {
    return {
      success: true,
      data: {
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      }
    };
  } else {
    return {
      success: false,
      message: '로그인에 실패했습니다. 이메일과 패스워드를 확인해주세요.'
    };
  }
};

// Kakao Login API
export const kakaoLoginApi = () => {
  window.location.href = '/kakao/login';
};

// User join API
export const signupApi = async (email, password, username) => {
  const response = await apiPost('/api/auth/join', {
    email,
    password,
    username
  });

  if (response.result === 'ok') {
    return {
      success: true,
      data: {
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      }
    };
  } else {
    return {
      success: false,
      message: response.message || '회원가입에 실패했습니다.'
    };
  }
};

// Email Verify API
export const verifyEmailApi = async (email) => {
  const response = await apiPost('/api/auth/verify', {
    email
  });

  if (response.result === 'ok') {
    return {
      success: true,
      exists: response.data.exists
    };
  } else {
    return {
      success: false,
      message: '이메일 확인 중 오류가 발생했습니다.'
    };
  }
};

// User info API (JWT 필요)
export const getUserInfoApi = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          username: response.data.username,
          email: response.data.email
        }
      };
    } else {
      return {
        success: false,
        message: '사용자 정보 조회에 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return {
      success: false,
      message: '사용자 정보 조회 중 오류가 발생했습니다.'
    };
  }
};