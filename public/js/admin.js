// public/js/admin.js

async function removeSpecificUser() {
  const username = prompt("Enter username to remove:");
  if (!username) return;
  
  const response = await fetch('/admin/remove', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();

  if (!response.ok) {
    alert(data.message || 'Failed to remove user');
  } else {
    alert(data.message);
    fetchQueue(); // Refresh queue
  }
}

async function clearQueue() {
  const response = await fetch('/admin/clear', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    alert(data.message || 'Failed to clear queue');
  } else {
    alert(data.message);
    fetchQueue(); // Refresh queue
  }
}

async function removeTopPlayer() {
  const response = await fetch('/admin/remove-top', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    alert(data.message || 'Failed to remove top player');
  } else {
    alert(data.message);
    fetchQueue(); // Refresh the queue
  }
}

async function addPlayerAtPosition() {
  const username = document.getElementById('searchPlayer').value;
  const position = parseInt(document.getElementById('positionInput').value, 10);

  const response = await fetch('/admin/add-at-position', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, position }),
  });
  const data = await response.json();

  if (response.ok) {
    alert(data.message);
    fetchQueue(); // Refresh queue display
  } else {
    alert(data.message || 'Failed to add player at specified position');
  }
}

let allUsers = [];

async function fetchAllUsers() {
  const response = await fetch('/admin/users', {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  });
  allUsers = await response.json();
  setupAutocomplete(document.getElementById('searchPlayer'), allUsers);
}

function setupAutocomplete(input, arr) {
  let currentFocus;

  input.addEventListener("input", function() {
    let val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;

    const listContainer = document.createElement("div");
    listContainer.setAttribute("id", this.id + "autocomplete-list");
    listContainer.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(listContainer);

    arr.forEach(user => {
      if (user.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        const item = document.createElement("div");
        item.innerHTML = "<strong>" + user.substr(0, val.length) + "</strong>";
        item.innerHTML += user.substr(val.length);
        item.innerHTML += "<input type='hidden' value='" + user + "'>";
        item.addEventListener("click", function() {
          input.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        listContainer.appendChild(item);
      }
    });
  });

  input.addEventListener("keydown", function(e) {
    let items = document.getElementById(this.id + "autocomplete-list");
    if (items) items = items.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(items);
    } else if (e.keyCode === 38) { 
      currentFocus--;
      addActive(items);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (items) items[currentFocus].click();
      }
    }
  });

  function addActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(items) {
    for (const item of items) item.classList.remove("autocomplete-active");
  }

  function closeAllLists(element) {
    const items = document.getElementsByClassName("autocomplete-items");
    for (const item of items) {
      if (element != item && element != input) {
        item.parentNode.removeChild(item);
      }
    }
  }

  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
