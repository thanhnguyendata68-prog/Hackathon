// script.js

// Room data (used for search filtering)
let allRooms = [];
let currentRating = 0;

async function loadKioskRooms() {
  try {
    // Read directly from your local rooms.json file
    const response = await fetch('./rooms.json'); 
    allRooms = await response.json();
    renderRoomCards(allRooms);
  } catch (error) {
    console.error('Error fetching room data:', error);
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

function filterRooms(event) {
  const query = event.target.value.toLowerCase().trim();
  const dropdown = document.getElementById('searchDropdown');
  
  if (!query) {
    dropdown.innerHTML = '';
    dropdown.style.display = 'none';
    return;
  }

  // Filter rooms based on query
  const filtered = allRooms.filter(room => 
    room.name.toLowerCase().includes(query) ||
    room.building.toLowerCase().includes(query) ||
    room.noiseLevel.toLowerCase().includes(query) ||
    room.id.toLowerCase().includes(query)
  );

  // Render dropdown results
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

function selectSearchResult(roomId, roomName) {
  const searchInput = document.getElementById('searchInput');
  searchInput.value = roomName;
  document.getElementById('searchDropdown').style.display = 'none';
  openReservationModal(roomId, roomName);
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.value = '';
  document.getElementById('searchDropdown').style.display = 'none';
}

// ========== NAVIGATION FUNCTIONALITY ==========
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section-panel').forEach(section => {
    section.style.display = 'none';
  });
  
  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  }
  
  // Add active class to clicked nav item
  event.target.closest('.nav-item').classList.add('active');
  
  // Move map section content if needed
  if (sectionId === 'map-section') {
    const mainContent = document.querySelector('.eco-main');
    if (mainContent && !document.getElementById('map-section').contains(mainContent)) {
      // Content is already in place from original HTML
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

function handleReservation(event) {
  event.preventDefault();
  const duration = document.getElementById('duration').value;
  const studentId = document.getElementById('studentId').value;

  alert(`✅ Success!\nSeat reserved in ${currentRoomId} for ${duration} minutes.`);
  closeModal();
}

document.addEventListener('DOMContentLoaded', loadKioskRooms);
