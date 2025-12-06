// Passenger Management

// Load all passengers
async function loadPassengers() {
    showLoading('passengersContainer');

    try {
        const response = await fetch(`${API_BASE_URL}/api/passengers`);
        const passengers = await response.json();

        if (passengers.length === 0) {
            showEmptyState('passengersContainer', 'Нет пассажиров', '👥');
            return;
        }

        const container = document.getElementById('passengersContainer');
        container.innerHTML = passengers.map(passenger => createPassengerCard(passenger)).join('');
    } catch (error) {
        console.error('Error loading passengers:', error);
        showEmptyState('passengersContainer', 'Ошибка загрузки данных', '⚠️');
    }
}

// Create passenger card HTML
function createPassengerCard(passenger) {
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${passenger.name}</h3>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">Телефон:</span>
                        <span class="info-value">${passenger.phone}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${passenger.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Рейтинг:</span>
                        <span class="info-value">⭐ ${passenger.rating.toFixed(1)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Регистрация:</span>
                        <span class="info-value">${formatDate(passenger.created_at)}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="viewPassengerTrips(${passenger.id})">
                    📋 История
                </button>
                <button class="btn btn-danger" onclick="deletePassenger(${passenger.id})">
                    🗑️ Удалить
                </button>
            </div>
        </div>
    `;
}

// Show passenger form
function showPassengerForm() {
    document.getElementById('passengerFormContainer').style.display = 'block';
    document.getElementById('passengerForm').reset();
}

// Hide passenger form
function hidePassengerForm() {
    document.getElementById('passengerFormContainer').style.display = 'none';
}

// Handle passenger form submission
document.getElementById('passengerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passengerData = {
        name: document.getElementById('passengerName').value,
        phone: document.getElementById('passengerPhone').value,
        email: document.getElementById('passengerEmail').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/passengers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passengerData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Ошибка регистрации пассажира');
        }

        hidePassengerForm();
        loadPassengers();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
});

// View passenger trips
async function viewPassengerTrips(passengerId) {
    switchSection('trips');
    // Filter trips by passenger
    setTimeout(() => {
        loadTrips(passengerId);
    }, 100);
}

// Delete passenger
async function deletePassenger(passengerId) {
    if (!confirm('Вы уверены, что хотите удалить этого пассажира?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/passengers/${passengerId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Ошибка удаления пассажира');
        }

        loadPassengers();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
}
