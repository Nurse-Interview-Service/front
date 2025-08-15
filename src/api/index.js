const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// fetch
export const apiRequest = async (endpoint, options = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // query parameters
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    url += `?${searchParams.toString()}`;
  }
  
  // Header
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };  
  

  delete config.params;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || '요청 처리 중 오류가 발생했습니다.',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      '서버와의 연결에 문제가 발생했습니다.',
      0,
      null
    );
  }
};

// GET
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { method: 'GET', ...options });
};

//POST 요청
// export const apiPost = (endpoint, data) => {
//   return apiRequest(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// };

export const apiPost = (endpoint, { headers = {}, ...data } = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
};

// FormData POST
export const apiPostFormData = async (endpoint, formData, options = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
  };

  const config = {
    method: 'POST',
    headers: { ...defaultHeaders, ...options.headers },
    body: formData,
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || '파일 업로드 중 오류가 발생했습니다.',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      '서버와의 연결에 문제가 발생했습니다.',
      0,
      null
    );
  }
};

// PUT
export const apiPut = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};
