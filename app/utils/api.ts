const API_BASE_URL = 'http://localhost:5000/api';

export const register = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const saveSkills = async (skills: string[]) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ skills }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to save skills');
  }
  return data;
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'x-auth-token': token,
    },
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to get profile');
  return data;
};

export const updateProfile = async (updates: { email?: string; password?: string }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

export const getCourses = async (skill: string) => {
  const response = await fetch(`${API_BASE_URL}/courses/${skill}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch courses');
  return data;
}; 