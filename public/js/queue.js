// public/js/queue.js
let socket; // Declare socket variable

function initializeSocket() {
  if (!isAuthenticated()) {
    return; // Do not initialize socket if not authenticated
  }

  socket = io({
    auth: {
      token: token
    }
  });

  // Set up event listeners
  socket.on('queueUpdated', (queue) => {
    updateQueueDisplay(queue);
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    if (err.message === 'Authentication error') {
      alert('Authentication error. Please log in again.');
      logout();
    } else {
      alert('Connection error: ' + err.message);
    }
  });
}   

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

async function fetchQueue() {
    const response = await fetch('/queue', {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });
  
    if (response.status === 401 || response.status === 403) {
      alert('Session expired. Please log in again.');
      logout();
      return;
    }
  
    const queue = await response.json();
    updateQueueDisplay(queue);
  }

  function updateQueueDisplay(queue) {
    console.log("Queue data:", queue);
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';
  
    queue.forEach((name, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = `${index + 1}. ${name}`;
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
  
    // Display admin controls if user is admin
    if (isAdmin) {
      document.querySelector('.admin-controls').style.display = 'block';
      fetchAllUsers(); // Fetch all users for autocomplete
    } else {
      document.querySelector('.admin-controls').style.display = 'none';
    }
  }
  
  
  
  async function addToQueue() {
    try {
      const response = await fetch('/queue/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          alert(errorData.message || 'You are already in the queue.');
          return;
        }
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      fetchQueue();
      if (!isAdmin) disableButtons();
  
    } catch (error) {
      console.error('Error adding to queue:', error);
      alert(error.message);
    }
  }
  
  function disableButtons() {
    document.getElementById('addButton').style.display = 'none';
    document.getElementById('leaveButton').style.display = 'block';
    userAdded = true;
  }
  
  function enableButtons() {
    document.getElementById('addButton').style.display = 'block';
    document.getElementById('leaveButton').style.display = 'none';
    document.getElementById('userMessage').style.display = 'none';
    userAdded = false;
  }

  async function removeFromQueue() {
    try {
      const response = await fetch('/queue/remove', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Failed to leave queue');
      } else {
        alert(data.message);
        fetchQueue(); // Refresh queue display
      }
    } catch (error) {
      console.error('Error leaving queue:', error);
      alert('An error occurred while leaving the queue.');
    }
  }
  