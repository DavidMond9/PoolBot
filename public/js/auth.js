// public/js/auth.js

function isAuthenticated() {
  const token = localStorage.getItem('token'); // Retrieve the token each time
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000; // Convert to milliseconds
    if (Date.now() >= expiration) {
      // Token expired
      logout();
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error decoding token:', e);
    return false;
  }
}

function getUserInfoFromToken() {
  const token = localStorage.getItem('token'); // Retrieve the token each time
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.username, isAdmin: payload.isAdmin || false };
    } catch (e) {
      console.error('Error decoding token:', e);
      return { username: null, isAdmin: false };
    }
  }
  return { username: null, isAdmin: false };
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token); // Store token directly in localStorage
        const userInfo = getUserInfoFromToken();
        
        // Show appropriate navigation options based on authentication
        document.getElementById('navLogin').style.display = 'none';
        document.getElementById('navLogout').style.display = 'block';

        initializeSocket(); // Initialize Socket.IO connection after login
        showHome();
      } else {
        alert(data.message || 'Login failed');
      }
    })
    .catch(err => {
      console.error('Error logging in:', err);
      alert('An error occurred during login.');
    });
}

function logout() {
  localStorage.removeItem('token'); // Clear token from storage
  disconnectSocket(); // Disconnect the socket on logout

  // Update UI based on logout
  document.getElementById('navLogin').style.display = 'block';
  document.getElementById('navLogout').style.display = 'none';
  showHome();
}

function register() {
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value;

  fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'User registered successfully.') {
        alert('Registration successful! Please log in.');
        showLoginForm();
      } else {
        alert(data.message || 'Registration failed');
      }
    })
    .catch(err => {
      console.error('Error registering:', err);
      alert('An error occurred during registration.');
    });
}
