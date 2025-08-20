// Fetch and display leaderboard
async function fetchLeaderboard() {
  try {
    const users = await getLeaderboard();
    displayLeaderboard(users);
  } catch (error) {
    showError('Failed to load leaderboard: ' + error.message);
  }
}

// Display leaderboard in UI
function displayLeaderboard(users) {
  const leaderboardTable = document.getElementById('leaderboardTable');
  if (!leaderboardTable) return;
  
  leaderboardTable.innerHTML = '';

  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.wins || 0}</td>
      <td>${user.losses || 0}</td>
      <td>${user.winRatio ? (user.winRatio * 100).toFixed(2) + '%' : '0%'}</td>
    `;
    leaderboardTable.appendChild(row);
  });
}

// Fetch and display user profile
async function fetchProfile() {
  try {
    const user = await getUserProfile();
    displayProfile(user);
  } catch (error) {
    showError('Failed to load profile: ' + error.message);
  }
}

// Display user profile in UI
function displayProfile(user) {
  const profileWins = document.getElementById('profileWins');
  const profileLosses = document.getElementById('profileLosses');
  const profileWinRatio = document.getElementById('profileWinRatio');
  
  if (profileWins) profileWins.innerText = user.wins || 0;
  if (profileLosses) profileLosses.innerText = user.losses || 0;
  if (profileWinRatio) {
    profileWinRatio.innerText = user.winRatio
      ? (user.winRatio * 100).toFixed(2) + '%'
      : '0%';
  }
}

// Show Report Game section
function showReportGameSection(topPlayers) {
  const reportGameSection = document.getElementById('reportGameSection');
  if (!reportGameSection) return;
  
  reportGameSection.style.display = 'block';

  const winnerSelect = document.getElementById('winnerSelect');
  const loserSelect = document.getElementById('loserSelect');

  if (!winnerSelect || !loserSelect) return;

  // Clear existing options
  winnerSelect.innerHTML = '';
  loserSelect.innerHTML = '';

  // Populate options with top two players
  topPlayers.forEach(player => {
    const winnerOption = document.createElement('option');
    winnerOption.value = player;
    winnerOption.text = player;
    winnerSelect.appendChild(winnerOption);

    const loserOption = document.createElement('option');
    loserOption.value = player;
    loserOption.text = player;
    loserSelect.appendChild(loserOption);
  });
}

// Hide Report Game section
function hideReportGameSection() {
  const reportGameSection = document.getElementById('reportGameSection');
  if (reportGameSection) {
    reportGameSection.style.display = 'none';
  }
}

// Report game result
async function reportGame() {
  const winnerSelect = document.getElementById('winnerSelect');
  const loserSelect = document.getElementById('loserSelect');
  
  if (!winnerSelect || !loserSelect) return;
  
  const winner = winnerSelect.value;
  const loser = loserSelect.value;

  if (winner === loser) {
    showError('Winner and loser cannot be the same person.');
    return;
  }

  try {
    const result = await reportGame(winner, loser);
    showSuccess(result.message);
    fetchQueue(); // Refresh the queue
  } catch (error) {
    showError(error.message || 'Failed to report game.');
  }
}

// Initialize game-related functionality
function initGameFeatures() {
  // Set up any game-related event listeners or initialization
  console.log('Game features initialized');
}
