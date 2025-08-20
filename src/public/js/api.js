// API base URL
const API_BASE = '/api';

// API request helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Authentication API calls
async function registerUser(username, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function loginUser(username, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

// Queue API calls
async function getQueue() {
  return apiRequest('/queue');
}

async function addToQueue() {
  return apiRequest('/queue/add', {
    method: 'POST'
  });
}

async function removeFromQueue(username) {
  return apiRequest('/queue/admin/remove', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
}

async function removeTopPlayer() {
  return apiRequest('/queue/admin/remove-top', {
    method: 'POST'
  });
}

async function addAtPosition(username, position) {
  return apiRequest('/queue/admin/add-at-position', {
    method: 'POST',
    body: JSON.stringify({ username, position: parseInt(position) })
  });
}

async function clearQueue() {
  return apiRequest('/queue/admin/clear', {
    method: 'POST'
  });
}

// Game API calls
async function reportGame(winner, loser) {
  return apiRequest('/game/report-game', {
    method: 'POST',
    body: JSON.stringify({ winner, loser })
  });
}

async function getLeaderboard() {
  return apiRequest('/game/leaderboard');
}

async function getUserProfile() {
  return apiRequest('/game/profile');
}

async function getAllUsers() {
  return apiRequest('/game/admin/users');
}
