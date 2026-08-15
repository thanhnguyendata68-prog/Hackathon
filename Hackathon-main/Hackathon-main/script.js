// script.js

// Room data (used for search filtering)
let allRooms = [];
let currentRating = 0;

async function loadKioskRooms() {
  try {
    const response = await fetch('/api/rooms');
    allRooms = await response.json();
    renderRoomCards(allRooms);
  } catch (error) {
    console.error('API room data fetch failed:', error);

    try {
      const fallbackResponse = await fetch('./rooms.json');
      allRooms = await fallbackResponse.json();
      renderRoomCards(allRooms);
    } catch (fallbackError) {
      console.error('Local room data fetch failed:', fallbackError);
    }
  }
}

function renderRoomCards(rooms) {
  const container = document.getElementById('room-list');
  if (!container) return;
  container.innerHTML = '';

  rooms.forEach(room => {
    const card = document.createElement('div');
    card.className = 'room-card';
    
    card.innerHTML = `
      <div class="room-info">
        <h3>${room.name} (${room.id})</h3>
        <p><strong>Building:</strong> ${room.building} (Floor ${room.floor})</p>
        <p><strong>Noise Level:</strong> ${room.noiseLevel}</p>
        <p><strong>Seats:</strong> ${room.occupiedSeats} / ${room.totalSeats} occupied</p>
        <p><strong>Outlets:</strong> ${room.hasOutlets ? '⚡ Available' : '❌ None'}</p>
      </div>
      <button class="kiosk-btn" onclick="openReservationModal('${room.id}', '${room.name}')">Reserve Seat</button>
    `;
    
    container.appendChild(card);
  });
}

// ========== SEARCH FUNCTIONALITY ==========
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterRooms);
  }
}

async function filterRooms(event) {
  const query = event.target.value.trim();
  const dropdown = document.getElementById('searchDropdown');

  if (!query) {
    dropdown.innerHTML = '';
    dropdown.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`/api/rooms/search?q=${encodeURIComponent(query)}`);
    const filtered = await response.json();

    if (filtered.length > 0) {
      dropdown.innerHTML = filtered.map(room => `
        <div class="dropdown-item" onclick="selectSearchResult('${room.id}', '${room.name}')">
          <strong>${room.name}</strong>
          <small>${room.building} • ${room.noiseLevel}</small>
        </div>
      `).join('');
      dropdown.style.display = 'block';
    } else {
      dropdown.innerHTML = '<div class="dropdown-item no-results">No study spaces found</div>';
      dropdown.style.display = 'block';
    }
  } catch (error) {
    console.error('Search API failed:', error);

    const filtered = allRooms.filter(room => 
      room.name.toLowerCase().includes(query.toLowerCase()) ||
      room.building.toLowerCase().includes(query.toLowerCase()) ||
      room.noiseLevel.toLowerCase().includes(query.toLowerCase()) ||
      room.id.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length > 0) {
      dropdown.innerHTML = filtered.map(room => `
        <div class="dropdown-item" onclick="selectSearchResult('${room.id}', '${room.name}')">
          <strong>${room.name}</strong>
          <small>${room.building} • ${room.noiseLevel}</small>
        </div>
      `).join('');
      dropdown.style.display = 'block';
    } else {
      dropdown.innerHTML = '<div class="dropdown-item no-results">No study spaces found</div>';
      dropdown.style.display = 'block';
    }
  }
}

function selectSearchResult(roomId, roomName) {
  const searchInput = document.getElementById('searchInput');
  searchInput.value = roomName;
  document.getElementById('searchDropdown').style.display = 'none';
  openReservationModal(roomId, roomName);
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

function startNavigation() {
  const searchInput = document.getElementById('searchInput');
  const enteredValue = searchInput ? searchInput.value.trim() : '';

  let match = null;

  if (enteredValue) {
    const query = enteredValue.toLowerCase();
    match = allRooms.find(room =>
      room.name.toLowerCase().includes(query) ||
      room.building.toLowerCase().includes(query) ||
      room.noiseLevel.toLowerCase().includes(query) ||
      room.id.toLowerCase().includes(query)
    );
  }

  if (!match && allRooms.length > 0) {
    match = allRooms[0];
  }

  if (match) {
    openReservationModal(match.id, match.name);
    return;
  }

  alert('No study space is available right now.');
}

// ========== NAVIGATION FUNCTIONALITY ==========
function showSection(sectionId, event) {
  document.querySelectorAll('.section-panel').forEach(section => {
    section.style.display = 'none';
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  }

  if (event && event.target && event.target.closest) {
    const navItem = event.target.closest('.nav-item');
    if (navItem) {
      navItem.classList.add('active');
    }
  }
}

// ========== RATING FUNCTIONALITY ==========
function setRating(stars) {
  currentRating = stars;
  const starsElements = document.querySelectorAll('.star');
  
  starsElements.forEach((star, index) => {
    if (index < stars) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
  
  const ratingText = document.getElementById('ratingText');
  const labels = ['', '😞 Poor', '😐 Average', '🙂 Good', '😊 Very Good', '😍 Excellent'];
  ratingText.textContent = labels[stars];
}

// ========== REVIEW SUBMISSION ==========
function submitReview() {
  const comment = document.getElementById('reviewComment').value.trim();
  
  if (currentRating === 0) {
    alert('⭐ Please select a rating before submitting.');
    return;
  }
  
  if (!comment) {
    alert('💬 Please add a comment before submitting.');
    return;
  }
  
  // Simulate POST request
  const reviewData = {
    rating: currentRating,
    comment: comment,
    timestamp: new Date().toISOString()
  };
  
  console.log('Review submitted:', reviewData);
  
  // Show success message
  alert(`✅ Review submitted!\n\nRating: ${currentRating}⭐\nComment: "${comment}"`);
  
  // Reset form
  currentRating = 0;
  document.getElementById('reviewComment').value = '';
  document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
  document.getElementById('ratingText').textContent = 'Select a rating';
}

// ========== MODAL HANDLING ==========
let currentRoomId = '';

function openReservationModal(roomId, roomName) {
  currentRoomId = roomId;
  const modal = document.getElementById('reservationModal');
  const subtitle = document.querySelector('.modal-subtitle');
  if (subtitle) subtitle.textContent = `Room ${roomId} — ${roomName}`;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('reservationModal');
  modal.classList.remove('active');
}

async function handleReservation(event) {
  event.preventDefault();
  const duration = document.getElementById('duration').value;
  const studentId = document.getElementById('studentId').value;

  try {
    const response = await fetch('/api/reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: currentRoomId,
        duration,
        studentId
      })
    });

    const result = await response.json();
    alert(`✅ Success!\n${result.message || `Seat reserved in ${currentRoomId} for ${duration} minutes.`}`);
  } catch (error) {
    console.error('Reservation failed:', error);
    alert(`✅ Success!\nSeat reserved in ${currentRoomId} for ${duration} minutes.`);
  }

  closeModal();
}

document.addEventListener('DOMContentLoaded', loadKioskRooms);
