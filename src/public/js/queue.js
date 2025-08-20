// Queue state
let userAdded = false;

// Fetch and display queue
async function fetchQueue() {
  try {
    const queue = await getQueue();
    displayQueue(queue);
  } catch (error) {
    showError('Failed to load queue: ' + error.message);
  }
}

// Display queue in UI
function displayQueue(queue) {
  const queueList = document.getElementById('queueList');
  queueList.innerHTML = '';

  queue.forEach((username, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.innerHTML = `
      <span>${index + 1}. ${username}</span>
      ${isAdmin ? `<button class="btn btn-sm btn-danger" onclick="removeSpecificUser('${username}')">Remove</button>` : ''}
    `;

    // Highlight top two players
    if (index < 2) {
      listItem.classList.add('on-table');
    }

    queueList.appendChild(listItem);
  });

  // Check if the user's name is already in the queue
  const username = getUserInfoFromToken().username;
  if (queue.includes(username) && !isAdmin) {
    disableButtons();
    document.getElementById('userMessage').innerText = `You are in the queue at position ${queue.indexOf(username) + 1}.`;
    document.getElementById('userMessage').style.display = 'block';
  } else {
    enableButtons();
  }

  // Show Report Game section if user is one of the top two players
  if (queue.slice(0, 2).includes(username)) {
    showReportGameSection(queue.slice(0, 2));
  } else {
    hideReportGameSection();
  }

  // Display admin controls if user is admin
  if (isAdmin) {
    document.querySelector('.admin-controls').style.display = 'block';
    fetchAllUsers(); // Fetch all users for autocomplete
  } else {
    document.querySelector('.admin-controls').style.display = 'none';
  }
}

// Add to queue function
async function addToQueue() {
  try {
    await addToQueue();
    showSuccess('Added to queue successfully!');
    fetchQueue();
    if (!isAdmin) disableButtons();
  } catch (error) {
    showError(error.message);
  }
}

// Remove specific user (admin only)
async function removeSpecificUser(username) {
  try {
    const result = await removeFromQueue(username);
    showSuccess(result.message);
    fetchQueue();
  } catch (error) {
    showError(error.message);
  }
}

// Remove top player (admin only)
async function removeTopPlayer() {
  try {
    const result = await removeTopPlayer();
    showSuccess(result.message);
    fetchQueue();
  } catch (error) {
    showError(error.message);
  }
}

// Add user at specific position (admin only)
async function addUserAtPosition() {
  const username = document.getElementById('usernameInput').value;
  const position = document.getElementById('positionInput').value;

  if (!username || !position) {
    showError('Please enter both username and position');
    return;
  }

  try {
    const result = await addAtPosition(username, position);
    showSuccess(result.message);
    fetchQueue();
    
    // Clear inputs
    document.getElementById('usernameInput').value = '';
    document.getElementById('positionInput').value = '';
  } catch (error) {
    showError(error.message);
  }
}

// Clear queue (admin only)
async function clearQueue() {
  if (confirm('Are you sure you want to clear the entire queue?')) {
    try {
      const result = await clearQueue();
      showSuccess(result.message);
      fetchQueue();
    } catch (error) {
      showError(error.message);
    }
  }
}

// UI helper functions
function disableButtons() {
  document.getElementById('addButton').style.display = 'none';
  userAdded = true;
}

function enableButtons() {
  document.getElementById('addButton').style.display = 'block';
  document.getElementById('userMessage').style.display = 'none';
  userAdded = false;
}

// Autocomplete functionality for admin
let allUsers = [];

async function fetchAllUsers() {
  try {
    allUsers = await getAllUsers();
    setupAutocomplete();
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

function setupAutocomplete() {
  const usernameInput = document.getElementById('usernameInput');
  if (!usernameInput) return;

  usernameInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    const suggestions = allUsers.filter(user => 
      user.toLowerCase().includes(value)
    );

    // Simple autocomplete - could be enhanced with dropdown
    if (suggestions.length > 0 && value.length > 0) {
      this.setAttribute('placeholder', `Suggestions: ${suggestions.slice(0, 3).join(', ')}`);
    } else {
      this.setAttribute('placeholder', 'Enter username');
    }
  });
}
