import { apiGet, apiPostFormData } from './index';

// Interview API (JWT 필요)
export const startInterviewApi = async (jobType) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/interview/start', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { job: jobType }
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          questionList: response.data.questionList,
          session_id: response.data.session_id
        }
      };
    } else {
      return {
        success: false,
        message: '면접 질문을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('면접 시작 API 오류:', error);
    return {
      success: false,
      message: '면접 시작 중 오류가 발생했습니다.'
    };
  }
};

// Answer API (JWT 필요)
export const postAnswer = async (question, useranswer, videoBlob, type, sessionId = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('postAnswer: 토큰이 없습니다.');
    return { success: false, message: '로그인이 필요합니다.' };
  }

  const formData = new FormData();
  formData.append('question', question);
  formData.append('useranswer', useranswer);
  formData.append('type', type);
  
  if (sessionId) {
    formData.append('session_id', sessionId);
  }
  
  if (videoBlob && videoBlob.size > 0) {
    formData.append('video', videoBlob, `interview_video_${Date.now()}.webm`);
  }

  try {
    const response = await apiPostFormData('/api/interview/answer', formData, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });

    if (response.result === 'ok') {
      return { success: true };
    } else {
      return { success: false, message: response.message || '전송 오류' };
    }

  } catch (err) {
    console.error('postAnswer error:', err);
    return { success: false, message: err.message || '요청 처리 실패' };
  }
};


// Analysis API (JWT 필요)
export const getAnalysisInfoApi = async (sessionId = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const params = {};
    if (sessionId) {
      params.session_id = sessionId;
    }

    const response = await apiGet('/api/analysis/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: params
    });

    if (response.result === 'ok') {
        return {
            success: true,
            data: {
              InterviewList: response.data.InterviewList,
              summary: response.data.summary,

            }
          };

    } else {
      return {
        success: false,
        message: '분석 내용을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('분석 API 오류:', error);
    return {
      success: false,
      message: '분석 중 오류가 발생했습니다.'
    };
  }
};

// All Interview History API (JWT 필요)
export const getGroupedInterviewHistoryApi = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/interview/sessions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          sessions: response.data.sessions || [],
        }
      };
    } else {
      return {
        success: false,
        message: '분석 내용을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('분석 API 오류:', error);
    return {
      success: false,
      message: '분석 중 오류가 발생했습니다.'
    };
  }
};

// Interview History API (JWT 필요)
export const getInterviewHistoryApi = async (sessionId = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const params = {};
    if (sessionId) {
      params.session_id = sessionId;
    }

    const response = await apiGet('/api/interview/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: params
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          InterviewList: response.data.InterviewList,
          summary: response.data.summary,
          video: response.data.video,
          session_id: response.data.session_id
        }
      };
    } else {
      return {
        success: false,
        message: '분석 내용을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('분석 API 오류:', error);
    return {
      success: false,
      message: '분석 중 오류가 발생했습니다.'
    };
  }
};