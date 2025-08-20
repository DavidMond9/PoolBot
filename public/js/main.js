// public/js/main.js

let isAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    const userInfo = getUserInfoFromToken();
    isAdmin = userInfo.isAdmin;
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navLogout').style.display = 'block';
    initializeSocket();
  } else {
    localStorage.removeItem('token');
    document.getElementById('navLogin').style.display = 'block';
    document.getElementById('navLogout').style.display = 'none';
  }
  showHome(); // Always show the Home page on load
});

// Functions to show different sections
function showSection(sectionId) {
  const sections = ['homeSection', 'loginForm', 'registerForm', 'queueInterface', 'profileSection', 'tournamentsSection'];
  sections.forEach(id => {
    document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
  });

  // Update active nav item
  const navItems = ['navHome', 'navQueue', 'navProfile', 'navTournaments'];
  navItems.forEach(navId => {
    document.getElementById(navId).classList.remove('active');
  });

  switch (sectionId) {
    case 'homeSection':
      document.getElementById('navHome').classList.add('active');
      break;
    case 'loginForm':
    case 'registerForm':
      // Optionally handle active state for Login/Register if desired
      break;
    case 'queueInterface':
      document.getElementById('navQueue').classList.add('active');
      break;
    case 'tournamentsSection':
      document.getElementById('navTournaments').classList.add('active');
      break;
    case 'profileSection':
      document.getElementById('navProfile').classList.add('active');
      break;
  }
}

function showHome() {
  showSection('homeSection');
}

function showLoginForm() {
  showSection('loginForm');
  document.getElementById('navLogin').style.display = 'block';
  document.getElementById('navLogout').style.display = 'none';
}

function showRegisterForm() {
  showSection('registerForm');
}

function showQueueInterface() {
    if (isAuthenticated()) {
      showSection('queueInterface');
      document.getElementById('navLogin').style.display = 'none';
      document.getElementById('navLogout').style.display = 'block';
      initializeSocket(); // Initialize Socket.IO connection
      fetchQueue(); // Fetch and display the queue
    } else {
      alert('Please log in to access the queue.');
      showLoginForm();
    }
  }

function showTournaments() {
  showSection('tournamentsSection');
  initTournamentsPage();
}

function showProfile() {
  if (!isAuthenticated()) {
    alert('Please log in to view your profile.');
    showLoginForm();
    return;
  }
  showSection('profileSection');
  const userInfo = getUserInfoFromToken();
  document.getElementById('profileUsername').innerText = userInfo.username;
  fetchUserTournaments();
}