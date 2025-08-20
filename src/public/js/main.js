// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Pool Queue Application Initializing...');
  
  // Initialize authentication state
  updateUIForAuth();
  
  // Set up form event listeners
  setupFormListeners();
  
  // Initialize features
  initGameFeatures();
  
  console.log('Pool Queue Application Initialized');
});

// Set up form event listeners
function setupFormListeners() {
  // Registration form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Add to queue button
  const addButton = document.getElementById('addButton');
  if (addButton) {
    addButton.addEventListener('click', addToQueue);
  }

  // Admin form for adding user at position
  const adminForm = document.getElementById('adminForm');
  if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addUserAtPosition();
    });
  }
}

// Handle user registration
async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }

  try {
    await registerUser(username, password);
    showSuccess('Registration successful! Please log in.');
    
    // Clear form
    document.getElementById('registerForm').reset();
    
    // Switch to login tab
    showLogin();
  } catch (error) {
    showError(error.message);
  }
}

// Handle user login
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await loginUser(username, password);
    setAuthState(result.token);
    showSuccess('Login successful!');
    
    // Clear form
    document.getElementById('loginForm').reset();
  } catch (error) {
    showError(error.message);
  }
}

// Tab switching functions
function showRegister() {
  document.getElementById('loginTab').classList.remove('active');
  document.getElementById('registerTab').classList.add('active');
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerTab').classList.remove('active');
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

// Navigation functions
function showHome() {
  showSection('homeSection');
  fetchQueue();
}

function showProfile() {
  showSection('profileSection');
  fetchProfile();
}

function showLeaderboard() {
  showSection('leaderboardSection');
  fetchLeaderboard();
}

function showSection(sectionId) {
  // Hide all sections
  const sections = ['homeSection', 'profileSection', 'leaderboardSection'];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.style.display = 'none';
  });
  
  // Show requested section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.style.display = 'block';
  
  // Update navigation active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');
}

// Utility functions
function refreshData() {
  fetchQueue();
  fetchProfile();
  fetchLeaderboard();
}

// Auto-refresh queue every 30 seconds
setInterval(() => {
  if (isLoggedIn()) {
    fetchQueue();
  }
}, 30000);
