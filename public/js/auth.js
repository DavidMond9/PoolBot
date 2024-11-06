// public/js/auth.js

let token = localStorage.getItem('token');

function isAuthenticated() {
  if (!token) {
    token = localStorage.getItem('token');
  }
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;
    if (Date.now() >= expiration) {
      // Token expired
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

function getUserInfoFromToken() {
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { username: payload.username, isAdmin: payload.isAdmin || false };
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
        token = data.token;
        localStorage.setItem('token', token);
        const userInfo = getUserInfoFromToken();
        isAdmin = userInfo.isAdmin;

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
  token = null;
  localStorage.removeItem('token');
  isAdmin = false;
  disconnectSocket(); // Disconnect the socket on logout
  document.getElementById('navLogin').style.display = 'block';
  document.getElementById('navLogout').style.display = 'none';
  showHome();
}
