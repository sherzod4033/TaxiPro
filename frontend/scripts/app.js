// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Navigation
function switchSection(sectionId) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Load data for the section
    switch (sectionId) {
        case 'home':
            loadStats();
            break;
        case 'drivers':
            loadDrivers();
            break;
        case 'passengers':
            loadPassengers();
            break;
        case 'trips':
            loadTrips();
            break;
    }
}

// Event listeners for navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.dataset.section);
        });
    });

    // Load initial stats
    loadStats();
});

// Load statistics for home page
async function loadStats() {
    try {
        const [drivers, passengers, trips] = await Promise.all([
            fetch(`${API_BASE_URL}/api/drivers`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/passengers`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/trips`).then(r => r.json())
        ]);

        document.getElementById('totalDrivers').textContent = drivers.length;
        document.getElementById('availableDrivers').textContent =
            drivers.filter(d => d.status === 'available').length;
        document.getElementById('totalPassengers').textContent = passengers.length;
        document.getElementById('totalTrips').textContent = trips.length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Utility function to show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Загрузка...</p>
        </div>
    `;
}

// Utility function to show empty state
function showEmptyState(containerId, message, icon = '📭') {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <p>${message}</p>
        </div>
    `;
}

// Utility function to show error
function showError(message) {
    alert(message);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Status translations
const statusTranslations = {
    available: 'Доступен',
    busy: 'Занят',
    offline: 'Не в сети',
    pending: 'Ожидание',
    accepted: 'Принята',
    in_progress: 'В пути',
    completed: 'Завершена',
    cancelled: 'Отменена'
};

function translateStatus(status) {
    return statusTranslations[status] || status;
}
