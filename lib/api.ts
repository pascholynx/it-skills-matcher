const API_BASE_URL = 'https://it-skills-matcher-api.onrender.com/api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Registration failed');
  }
  return responseData;
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

  // Store the selected skills in localStorage if they exist
  if (data.selectedSkills) {
    localStorage.setItem('selectedSkills', JSON.stringify(data.selectedSkills));
  }

  return {
    token: data.token,
    hasSelectedSkills: data.hasSelectedSkills
  };
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

export const updateProfile = async (updates: { email?: string; password?: string; username?: string }) => {
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
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    console.log('Making request for skill:', skill); // Debug log

    const response = await fetch(`${API_BASE_URL}/courses/${skill}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });
    
    const data = await response.json();
    console.log('Response data:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch courses for ${skill}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCourses:', error);
    throw error;
  }
}; 