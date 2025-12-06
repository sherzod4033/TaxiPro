// Trip Management

// Load all trips
async function loadTrips(passengerId = null) {
    showLoading('tripsContainer');

    try {
        let url = `${API_BASE_URL}/api/trips`;
        if (passengerId) {
            url += `?passenger_id=${passengerId}`;
        }

        const response = await fetch(url);
        const trips = await response.json();

        if (trips.length === 0) {
            showEmptyState('tripsContainer', 'Нет поездок', '🚖');
            return;
        }

        const container = document.getElementById('tripsContainer');
        container.innerHTML = trips.map(trip => createTripCard(trip)).join('');
    } catch (error) {
        console.error('Error loading trips:', error);
        showEmptyState('tripsContainer', 'Ошибка загрузки данных', '⚠️');
    }
}

// Create trip card HTML
function createTripCard(trip) {
    const actions = getTripActions(trip);

    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Поездка #${trip.id}</h3>
                <span class="status-badge status-${trip.status}">
                    ${translateStatus(trip.status)}
                </span>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">Откуда:</span>
                        <span class="info-value">📍 ${trip.pickup_location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Куда:</span>
                        <span class="info-value">🎯 ${trip.dropoff_location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Пассажир ID:</span>
                        <span class="info-value">#${trip.passenger_id}</span>
                    </div>
                    ${trip.driver_id ? `
                    <div class="info-row">
                        <span class="info-label">Водитель ID:</span>
                        <span class="info-value">#${trip.driver_id}</span>
                    </div>
                    ` : ''}
                    ${trip.price ? `
                    <div class="info-row">
                        <span class="info-label">Цена:</span>
                        <span class="info-value">💰 ${trip.price} ₽</span>
                    </div>
                    ` : ''}
                    ${trip.distance ? `
                    <div class="info-row">
                        <span class="info-label">Расстояние:</span>
                        <span class="info-value">📏 ${trip.distance} км</span>
                    </div>
                    ` : ''}
                    <div class="info-row">
                        <span class="info-label">Создано:</span>
                        <span class="info-value">${formatDate(trip.created_at)}</span>
                    </div>
                    ${trip.completed_at ? `
                    <div class="info-row">
                        <span class="info-label">Завершено:</span>
                        <span class="info-value">${formatDate(trip.completed_at)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            ${actions ? `<div class="card-actions">${actions}</div>` : ''}
        </div>
    `;
}

// Get trip actions based on status
function getTripActions(trip) {
    switch (trip.status) {
        case 'pending':
            return `
                <button class="btn btn-success" onclick="assignDriver(${trip.id})">
                    ✅ Назначить водителя
                </button>
                <button class="btn btn-danger" onclick="cancelTrip(${trip.id})">
                    ❌ Отменить
                </button>
            `;
        case 'accepted':
            return `
                <button class="btn btn-primary" onclick="startTrip(${trip.id})">
                    🚀 Начать поездку
                </button>
                <button class="btn btn-danger" onclick="cancelTrip(${trip.id})">
                    ❌ Отменить
                </button>
            `;
        case 'in_progress':
            return `
                <button class="btn btn-success" onclick="completeTrip(${trip.id})">
                    ✅ Завершить
                </button>
            `;
        default:
            return '';
    }
}

// Show trip form
async function showTripForm() {
    document.getElementById('tripFormContainer').style.display = 'block';
    document.getElementById('tripForm').reset();

    // Load passengers for dropdown
    try {
        const response = await fetch(`${API_BASE_URL}/api/passengers`);
        const passengers = await response.json();

        const select = document.getElementById('tripPassenger');
        select.innerHTML = '<option value="">Выберите пассажира</option>' +
            passengers.map(p => `<option value="${p.id}">${p.name} (${p.phone})</option>`).join('');
    } catch (error) {
        console.error('Error loading passengers:', error);
    }
}

// Hide trip form
function hideTripForm() {
    document.getElementById('tripFormContainer').style.display = 'none';
}

// Handle trip form submission
document.getElementById('tripForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tripData = {
        passenger_id: parseInt(document.getElementById('tripPassenger').value),
        pickup_location: document.getElementById('tripPickup').value,
        dropoff_location: document.getElementById('tripDropoff').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/trips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Ошибка создания поездки');
        }

        hideTripForm();
        loadTrips();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
});

// Assign driver to trip
async function assignDriver(tripId) {
    try {
        // Get available drivers
        const response = await fetch(`${API_BASE_URL}/api/drivers?status=available`);
        const drivers = await response.json();

        if (drivers.length === 0) {
            showError('Нет доступных водителей');
            return;
        }

        // For simplicity, assign the first available driver
        const driverId = drivers[0].id;

        const acceptResponse = await fetch(`${API_BASE_URL}/api/trips/${tripId}/accept?driver_id=${driverId}`, {
            method: 'PATCH'
        });

        if (!acceptResponse.ok) {
            throw new Error('Ошибка назначения водителя');
        }

        loadTrips();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
}

// Start trip
async function startTrip(tripId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/start`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error('Ошибка начала поездки');
        }

        loadTrips();
    } catch (error) {
        showError(error.message);
    }
}

// Complete trip
async function completeTrip(tripId) {
    const distance = prompt('Введите расстояние (км):');
    if (!distance || isNaN(distance)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/complete?distance=${distance}`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error('Ошибка завершения поездки');
        }

        loadTrips();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
}

// Cancel trip
async function cancelTrip(tripId) {
    if (!confirm('Вы уверены, что хотите отменить эту поездку?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/cancel`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error('Ошибка отмены поездки');
        }

        loadTrips();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
}
