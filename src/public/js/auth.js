// Authentication state
let token = localStorage.getItem('token');
let isAdmin = false;

// Get user info from JWT token
function getUserInfoFromToken() {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (err) {
    console.error('Error parsing token:', err);
    return null;
  }
}

// Check if user is logged in
function isLoggedIn() {
  return token && getUserInfoFromToken();
}

// Set authentication state
function setAuthState(newToken) {
  token = newToken;
  localStorage.setItem('token', newToken);
  
  const userInfo = getUserInfoFromToken();
  isAdmin = userInfo && userInfo.isAdmin;
  
  updateUIForAuth();
}

// Update UI based on authentication state
function updateUIForAuth() {
  if (isLoggedIn()) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
    
    if (isAdmin) {
      document.querySelector('.admin-controls').style.display = 'block';
    }
    
    // Load initial data
    fetchQueue();
    fetchProfile();
    fetchLeaderboard();
  } else {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainSection').style.display = 'none';
    document.querySelector('.admin-controls').style.display = 'none';
  }
}

// Logout function
function logout() {
  token = null;
  isAdmin = false;
  localStorage.removeItem('token');
  updateUIForAuth();
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}

// Show success message
function showSuccess(message) {
  alert(message); // Simple alert for now, could be enhanced
}
