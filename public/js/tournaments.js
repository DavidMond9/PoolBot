// public/js/tournaments.js

// Check if user is an admin and display admin controls
function checkAdminForTournaments() {
    if (isAuthenticated()) {
      const userInfo = getUserInfoFromToken();
      if (userInfo.isAdmin) {
        document.getElementById('tournamentAdminControls').style.display = 'block';
      } else {
        document.getElementById('tournamentAdminControls').style.display = 'none';
      }
    } else {
      document.getElementById('tournamentAdminControls').style.display = 'none';
    }
  }
  
  async function fetchTournaments() {
    try {
      document.getElementById('tournamentsLoading').style.display = 'block';
      const response = await fetch('/tournaments');
      const tournaments = await response.json();
  
      displayTournaments(tournaments);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      document.getElementById('tournamentsLoading').style.display = 'none';
    }
  }
  
  async function displayTournaments(tournaments) {
    const tournamentsList = document.getElementById('tournamentsList');
    tournamentsList.innerHTML = '';
  
    if (tournaments.length === 0) {
      tournamentsList.innerHTML = '<p>No tournaments available at the moment.</p>';
      return;
    }
  
    const isAdminUser = isAuthenticated() && getUserInfoFromToken().isAdmin;
  
    // Create a row for the grid layout
    tournamentsList.innerHTML = '<div class="row"></div>';
    const rowDiv = tournamentsList.querySelector('.row');
  
    for (const tournament of tournaments) {
      const response = await fetch(`/tournaments/${tournament._id}`);
      const tournamentDetails = await response.json();
  
      const colDiv = document.createElement('div');
      colDiv.className = 'col-md-6';
  
      const participants = tournamentDetails.participants.map(username => `<span class="badge badge-secondary mr-1">${username}</span>`).join(' ');
  
      colDiv.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
            <h5 class="card-title">${tournament.name}</h5>
            <p class="card-text">${tournament.description || 'No description provided.'}</p>
            <p class="card-text"><small class="text-muted">Date: ${new Date(tournament.date).toLocaleDateString()}</small></p>
            <p class="card-text">Participants: ${participants || 'No participants yet.'}</p>
            <button class="btn btn-primary" onclick="registerForTournament('${tournament._id}', '${tournament.name}')">Sign Up</button>
            ${isAdminUser ? `
                <button class="btn btn-warning" onclick="showEditTournamentForm('${tournament._id}', decodeURIComponent('${encodeURIComponent(tournament.name)}'), decodeURIComponent('${encodeURIComponent(tournament.description)}'), '${tournament.date}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteTournament('${tournament._id}')">Delete</button>
            ` : ''}
            </div>
        </div>
        `;
      rowDiv.appendChild(colDiv);
    }
  }
  
  function registerForTournament(tournamentId, tournamentName) {
    if (!isAuthenticated()) {
      alert('Please log in to sign up for tournaments.');
      showLoginForm();
      return;
    }
  
    const confirmSignUp = confirm(`Are you sure you would like to sign up for the ${tournamentName}?`);
    if (confirmSignUp) {
      fetch(`/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          fetchTournaments(); // Refresh the tournaments list
          fetchUserTournaments(); // Update user's tournaments in profile
        })
        .catch(err => {
          console.error('Error registering for tournament:', err);
          alert('Error registering for tournament');
        });
    }
  }
  
  // Admin Functions
  function showCreateTournamentForm() {
    document.getElementById('createTournamentForm').style.display = 'block';
  }
  
  function hideCreateTournamentForm() {
    document.getElementById('createTournamentForm').style.display = 'none';
  }
  
  function createTournament() {
    const name = document.getElementById('tournamentName').value.trim();
    const description = document.getElementById('tournamentDescription').value.trim();
    const date = document.getElementById('tournamentDate').value;
  
    if (!name || !date) {
      alert('Name and date are required.');
      return;
    }
  
    fetch('/tournaments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, date }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
          hideCreateTournamentForm();
          fetchTournaments();
        } else {
          alert('Error creating tournament.');
        }
      })
      .catch(err => {
        console.error('Error creating tournament:', err);
        alert('Error creating tournament.');
      });
  }
  
  function deleteTournament(tournamentId) {
    if (!confirm('Are you sure you want to delete this tournament?')) return;
  
    fetch(`/tournaments/${tournamentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        fetchTournaments();
      })
      .catch(err => {
        console.error('Error deleting tournament:', err);
        alert('Error deleting tournament.');
      });
  }
  
  // Fetch user's tournaments for profile
  function fetchUserTournaments() {
    if (!isAuthenticated()) return;
  
    fetch('/tournaments/user/registrations', {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(response => response.json())
      .then(tournaments => {
        displayUserTournaments(tournaments);
      })
      .catch(err => {
        console.error('Error fetching user tournaments:', err);
      });
  }
  
  function displayUserTournaments(tournaments) {
    const userTournamentsList = document.getElementById('userTournamentsList');
    userTournamentsList.innerHTML = '';
  
    if (tournaments.length === 0) {
      userTournamentsList.innerHTML = '<p>You have not signed up for any tournaments yet.</p>';
      return;
    }
  
    tournaments.forEach(tournament => {
      const tournamentDiv = document.createElement('div');
      tournamentDiv.className = 'card mb-3';
      tournamentDiv.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${tournament.name}</h5>
          <p class="card-text">${tournament.description || 'No description provided.'}</p>
          <p class="card-text"><small class="text-muted">Date: ${new Date(tournament.date).toLocaleDateString()}</small></p>
        </div>
      `;
      userTournamentsList.appendChild(tournamentDiv);
    });
  }
  
  // Initialize tournaments page
  function initTournamentsPage() {
    checkAdminForTournaments();
    fetchTournaments();
  }  

  let currentEditingTournamentId = null;

function showEditTournamentForm(tournamentId, name, description, date) {
  currentEditingTournamentId = tournamentId;
  document.getElementById('editTournamentName').value = name;
  document.getElementById('editTournamentDescription').value = description;
  document.getElementById('editTournamentDate').value = date.slice(0, 10); // Format date for input[type="date"]
  document.getElementById('editTournamentForm').style.display = 'block';
}

function hideEditTournamentForm() {
  document.getElementById('editTournamentForm').style.display = 'none';
  currentEditingTournamentId = null;
}

function updateTournament() {
  const name = document.getElementById('editTournamentName').value.trim();
  const description = document.getElementById('editTournamentDescription').value.trim();
  const date = document.getElementById('editTournamentDate').value;

  if (!name || !date) {
    alert('Name and date are required.');
    return;
  }

  fetch(`/tournaments/${currentEditingTournamentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, date }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
        hideEditTournamentForm();
        fetchTournaments();
      } else {
        alert('Error updating tournament.');
      }
    })
    .catch((err) => {
      console.error('Error updating tournament:', err);
      alert('Error updating tournament.');
    });
}