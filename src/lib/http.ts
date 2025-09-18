const BASEURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
  credentials: 'include';
}

const makeRequest = async (url: string, options: RequestOptions) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Request failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
};

export const get = async (url: string, headers: Record<string, string> = {}) => {
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };
  
  return makeRequest(url, options);
};

export const post = async (url: string, body: any = {}, headers: Record<string, string> = {}) => {
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: 'include',
  };
  
  return makeRequest(url, options);
};

export const put = async (url: string, body: any = {}, headers: Record<string, string> = {}) => {
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: 'include',
  };
  
  return makeRequest(url, options);
};

export const del = async (url: string, headers: Record<string, string> = {}) => {
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };
  
  return makeRequest(url, options);
};

export { BASEURL };
