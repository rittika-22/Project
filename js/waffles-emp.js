document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isWaffleLoggedIn');

    if (!isLoggedIn) {
        window.location.href = 'index.html'; 
        return;
    }

    const waffleListContainer = document.getElementById('waffleList');
    const searchBar = document.getElementById('search-bar');
    const goToCustomerViewBtn = document.getElementById('go-to-customer-view-btn');
    const addItemBtn = document.getElementById('add-item-btn');
    const logoutButton = document.getElementById('logoutButton');

    const noWafflesMessage = document.getElementById('no-waffles-message');
    const noSearchResultsMessage = document.getElementById('no-search-results-message');

    // Add/Edit Waffle Modal Elements
    const waffleManageModal = document.getElementById('waffle-manage-modal');
    const modalFormTitle = document.getElementById('modal-form-title');
    const waffleForm = document.getElementById('waffleForm');
    const waffleNameInput = document.getElementById('waffleName');
    const wafflePriceInput = document.getElementById('wafflePrice');
    const waffleRatingInput = document.getElementById('waffleRating');
    const waffleImageInput = document.getElementById('waffleImage');
    const modalSubmitButton = document.getElementById('modalSubmitButton');
    const modalCancelButton = document.getElementById('modalCancelButton');
    const modalCloseButtons = waffleManageModal.querySelectorAll('.close-button');

    // Logout Confirmation Modal Elements
    const logoutConfirmationModal = document.getElementById('logout-confirmation-modal');
    const confirmLogoutButton = document.getElementById('confirmLogoutButton');
    const logoutModalCloseButtons = logoutConfirmationModal.querySelectorAll('.close-button');

    let editingWaffleId = null; 
    let currentWaffles = []; 

    // --- API base URL ---
    const API_URL = 'http://localhost:3000/api/waffles';

    // --- ডাটাবেস থেকে ওয়াফল লোড করা (Read) ---
    async function fetchWaffles() {
        try {
            const response = await fetch(API_URL);
            currentWaffles = await response.json();
            renderWaffles();
        } catch (err) {
            console.error('Error fetching waffles:', err);
            alert('Failed to load data from database.');
        }
    }

    // --- রেন্ডারিং ওয়াফল কার্ডস ---
    function renderWaffles(filterText = '') {
        waffleListContainer.innerHTML = ''; 
        let filteredWaffles = currentWaffles;

        if (filterText) {
            const lowerCaseFilter = filterText.toLowerCase();
            filteredWaffles = currentWaffles.filter(waffle =>
                waffle.name.toLowerCase().includes(lowerCaseFilter)
            );
        }

        // মেসেজ হ্যান্ডলিং
        if (currentWaffles.length === 0) {
            noWafflesMessage.classList.remove('hidden');
            return;
        } else {
            noWafflesMessage.classList.add('hidden');
        }

        if (filterText && filteredWaffles.length === 0) {
            noSearchResultsMessage.classList.remove('hidden');
        } else {
            noSearchResultsMessage.classList.add('hidden');
        }

        filteredWaffles.forEach(waffle => {
            const starRatingHtml = Array(5).fill().map((_, i) =>
                i < Math.floor(waffle.rating) ? '<i class="fas fa-star"></i>' :
                (i < waffle.rating && i === Math.floor(waffle.rating)) ? '<i class="fas fa-star-half-alt"></i>' :
                '<i class="far fa-star"></i>'
            ).join('');

            // ইমেজ পাথ চেক: যদি পাথে images/ না থাকে তবে যোগ করে দেবে
            const imagePath = waffle.image.startsWith('http') || waffle.image.startsWith('./') || waffle.image.startsWith('images/') 
                                ? waffle.image 
                                : `images/${waffle.image}`;

            const waffleCard = `
                <div class="waffle-card bg-white rounded-xl shadow-md overflow-hidden border border-amber-200 text-center p-4 relative">
                    <img src="${imagePath}" onerror="this.onerror=null;this.src='https://placehold.co/150x150?text=No+Image';" alt="${waffle.name}" class="w-full h-32 object-cover mb-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${waffle.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-1">Price: Tk ${parseFloat(waffle.price).toFixed(2)}</p>
                    <div class="star-rating text-lg mb-4">
                        ${starRatingHtml} (${parseFloat(waffle.rating).toFixed(1)})
                    </div>
                    <div class="flex justify-center space-x-2">
                        <button onclick="editWaffle(${waffle.id})" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm">Edit</button>
                        <button onclick="deleteWaffle(${waffle.id})" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full text-sm">Delete</button>
                    </div>
                </div>
            `;
            waffleListContainer.insertAdjacentHTML('beforeend', waffleCard);
        });
    }

    // --- ওয়াফল ডিলিট করা ---
    window.deleteWaffle = async (id) => {
        if (confirm('Are you sure you want to delete this waffle from database?')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchWaffles(); // লিস্ট রিফ্রেশ করা
                }
            } catch (err) {
                console.error('Error deleting waffle:', err);
            }
        }
    };

    // --- ওয়াফল এডিট মুড ওপেন করা ---
    window.editWaffle = (id) => {
        const waffleToEdit = currentWaffles.find(w => w.id == id);
        if (waffleToEdit) {
            waffleNameInput.value = waffleToEdit.name;
            wafflePriceInput.value = waffleToEdit.price;
            waffleRatingInput.value = waffleToEdit.rating;
            waffleImageInput.value = waffleToEdit.image;
            editingWaffleId = id;

            modalFormTitle.textContent = `Edit Waffle: ${waffleToEdit.name}`;
            modalSubmitButton.textContent = 'Update Waffle';
            waffleManageModal.classList.remove('hidden');
        }
    };

    // --- ফর্ম সাবমিট (Add or Update) ---
    waffleForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const waffleData = {
            name: waffleNameInput.value,
            price: parseFloat(wafflePriceInput.value),
            rating: parseFloat(waffleRatingInput.value),
            image: waffleImageInput.value
        };

        try {
            let response;
            if (editingWaffleId) {
                // Update existing waffle
                response = await fetch(`${API_URL}/${editingWaffleId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(waffleData)
                });
            } else {
                // Add new waffle
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(waffleData)
                });
            }

            if (response.ok) {
                waffleManageModal.classList.add('hidden');
                waffleForm.reset();
                fetchWaffles(); // ডাটাবেস থেকে নতুন লিস্ট আনা
            }
        } catch (err) {
            console.error('Error saving waffle:', err);
        }
    });

    // --- Modals and UI Buttons ---
    addItemBtn.addEventListener('click', () => {
        editingWaffleId = null;
        waffleForm.reset();
        modalFormTitle.textContent = 'Add New Waffle';
        modalSubmitButton.textContent = 'Add Waffle';
        waffleManageModal.classList.remove('hidden');
    });

    modalCancelButton.addEventListener('click', () => waffleManageModal.classList.add('hidden'));
    modalCloseButtons.forEach(btn => btn.addEventListener('click', () => waffleManageModal.classList.add('hidden')));

    searchBar.addEventListener('input', (e) => renderWaffles(e.target.value));

    logoutButton.addEventListener('click', () => logoutConfirmationModal.classList.remove('hidden'));
    confirmLogoutButton.addEventListener('click', () => {
        localStorage.removeItem('isWaffleLoggedIn');
        window.location.href = 'index.html';
    });

    logoutModalCloseButtons.forEach(btn => btn.addEventListener('click', () => logoutConfirmationModal.classList.add('hidden')));

    goToCustomerViewBtn.addEventListener('click', () => {
        window.location.href = 'waffles.html';
    });

    // ইনিশিয়াল লোড
    fetchWaffles();
});