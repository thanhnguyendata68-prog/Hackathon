// script.js
async function loadKioskRooms() {
  try {
    // Read directly from your local rooms.json file
    const response = await fetch('./rooms.json'); 
    const rooms = await response.json();
    renderRoomCards(rooms);
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

// Modal handling
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