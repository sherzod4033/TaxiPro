// Driver Management

// Load all drivers
async function loadDrivers() {
    showLoading('driversContainer');

    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers`);
        const drivers = await response.json();

        if (drivers.length === 0) {
            showEmptyState('driversContainer', 'Нет водителей', '🚗');
            return;
        }

        const container = document.getElementById('driversContainer');
        container.innerHTML = drivers.map(driver => createDriverCard(driver)).join('');
    } catch (error) {
        console.error('Error loading drivers:', error);
        showEmptyState('driversContainer', 'Ошибка загрузки данных', '⚠️');
    }
}

// Create driver card HTML
function createDriverCard(driver) {
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${driver.name}</h3>
                <span class="status-badge status-${driver.status}">
                    ${translateStatus(driver.status)}
                </span>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">Телефон:</span>
                        <span class="info-value">${driver.phone}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Лицензия:</span>
                        <span class="info-value">${driver.license_number}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Автомобиль:</span>
                        <span class="info-value">${driver.car_model}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Номер:</span>
                        <span class="info-value">${driver.car_number}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Рейтинг:</span>
                        <span class="info-value">⭐ ${driver.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary" onclick="toggleDriverStatus(${driver.id}, '${driver.status}')">
                    ${driver.status === 'available' ? '🔴 Оффлайн' : '🟢 Онлайн'}
                </button>
                <button class="btn btn-danger" onclick="deleteDriver(${driver.id})">
                    🗑️ Удалить
                </button>
            </div>
        </div>
    `;
}

// Show driver form
function showDriverForm() {
    document.getElementById('driverFormContainer').style.display = 'block';
    document.getElementById('driverForm').reset();
}

// Hide driver form
function hideDriverForm() {
    document.getElementById('driverFormContainer').style.display = 'none';
}

// Handle driver form submission
document.getElementById('driverForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const driverData = {
        name: document.getElementById('driverName').value,
        phone: document.getElementById('driverPhone').value,
        license_number: document.getElementById('driverLicense').value,
        car_model: document.getElementById('driverCarModel').value,
        car_number: document.getElementById('driverCarNumber').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driverData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Ошибка создания водителя');
        }

        hideDriverForm();
        loadDrivers();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
});

// Toggle driver status
async function toggleDriverStatus(driverId, currentStatus) {
    const newStatus = currentStatus === 'available' ? 'offline' : 'available';

    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers/${driverId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Ошибка обновления статуса');
        }

        loadDrivers();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
}

// Delete driver
async function deleteDriver(driverId) {
    if (!confirm('Вы уверены, что хотите удалить этого водителя?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers/${driverId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Ошибка удаления водителя');
        }

        loadDrivers();
        loadStats();
    } catch (error) {
        showError(error.message);
    }
}
