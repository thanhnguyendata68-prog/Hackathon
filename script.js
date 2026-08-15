// Fetch rooms from Member 1's backend and render them
async function loadKioskRooms() {
  try {
    const response = await fetch('http://localhost:8080/api/rooms'); // Member 1's endpoint
    const rooms = await response.json();
    renderRoomCards(rooms);
  } catch (error) {
    console.error('Error fetching room data:', error);
  }
}

// Function to dynamically build the UI cards
function renderRoomCards(rooms) {
  const container = document.getElementById('room-list');
  container.innerHTML = '';

  rooms.forEach(room => {
    const card = document.createElement('div');
    card.className = `room-card ${room.status.toLowerCase()}`; // Adds color styling
    
    card.innerHTML = `
      <h3>${room.name} (${room.building})</h3>
      <p>Noise Level: ${room.noiseLevel}</p>
      <p>Outlets Available: ${room.outlets ? 'Yes' : 'No'}</p>
      <button onclick="openReservationModal('${room.id}')">Reserve Seat</button>
    `;
    
    container.appendChild(card);
  });
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadKioskRooms);