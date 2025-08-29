document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isWaffleLoggedIn');

    if (!isLoggedIn) {
        window.location.href = 'index.html'; // Redirect to main page if not logged in
        return;
    }

    const waffleListContainer = document.getElementById('waffleList');
    const searchBar = document.getElementById('search-bar');
    const goToCustomerViewBtn = document.getElementById('go-to-customer-view-btn');
    const applyChangesBtn = document.getElementById('apply-changes-btn');
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
    const modalCloseButtons = waffleManageModal.querySelectorAll('.close-button'); // Close buttons for add/edit modal

    // Logout Confirmation Modal Elements
    const logoutConfirmationModal = document.getElementById('logout-confirmation-modal');
    const confirmLogoutButton = document.getElementById('confirmLogoutButton');
    const logoutModalCloseButtons = logoutConfirmationModal.querySelectorAll('.close-button'); // Close buttons for logout modal


    let editingWaffleId = null; // To keep track of the waffle being edited
    let currentWaffles = []; // Holds the current state of waffles for the employee panel

    // --- Data Loading and Saving ---
    function loadWafflesFromStorage(key) {
        const storedItems = localStorage.getItem(key);
        return storedItems ? JSON.parse(storedItems) : [];
    }

    function saveWafflesToStorage(key, waffles) {
        localStorage.setItem(key, JSON.stringify(waffles));
    }

    // --- Rendering Waffles ---
    function renderWaffles(filterText = '') {
        waffleListContainer.innerHTML = ''; // Clear current list
        let filteredWaffles = currentWaffles;

        // Apply search filter
        if (filterText) {
            const lowerCaseFilter = filterText.toLowerCase();
            filteredWaffles = currentWaffles.filter(waffle =>
                waffle.name.toLowerCase().includes(lowerCaseFilter)
            );
        }

        // Show messages based on filter and waffle count
        if (currentWaffles.length === 0) {
            noWafflesMessage.classList.remove('hidden');
            noSearchResultsMessage.classList.add('hidden');
            return;
        } else {
            noWafflesMessage.classList.add('hidden');
        }

        if (filterText && filteredWaffles.length === 0) {
            noSearchResultsMessage.classList.remove('hidden');
        } else {
            noSearchResultsMessage.classList.add('hidden');
        }

        if (filteredWaffles.length === 0 && currentWaffles.length > 0) {
            noSearchResultsMessage.classList.remove('hidden');
            noWafflesMessage.classList.add('hidden');
            return;
        }


        filteredWaffles.forEach(waffle => {
            const starRatingHtml = Array(5).fill().map((_, i) =>
                i < Math.floor(waffle.rating) ? '<i class="fas fa-star"></i>' :
                (i < waffle.rating && i === Math.floor(waffle.rating)) ? '<i class="fas fa-star-half-alt"></i>' :
                '<i class="far fa-star"></i>'
            ).join('');

            const waffleCard = `
                <div class="waffle-card bg-white rounded-xl shadow-md overflow-hidden border border-amber-200 text-center p-4 relative">
                    <img src="${waffle.image}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/FFF/000?text=Waffle+Img';" alt="${waffle.name}" class="w-full h-32 object-cover mb-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${waffle.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-1">Price: Tk ${waffle.price.toFixed(2)}</p>
                    <div class="star-rating text-lg mb-4">
                        ${starRatingHtml} (${waffle.rating.toFixed(1)})
                    </div>
                    <div class="flex justify-center space-x-2">
                        <button data-id="${waffle.id}" class="edit-waffle-btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm">Edit</button>
                        <button data-id="${waffle.id}" class="delete-waffle-btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full text-sm">Delete</button>
                    </div>
                </div>
            `;
            waffleListContainer.innerHTML += waffleCard;
        });

        attachWaffleActionListeners();
    }

    // Attach event listeners for edit and delete buttons
    function attachWaffleActionListeners() {
        document.querySelectorAll('.edit-waffle-btn').forEach(button => {
            button.addEventListener('click', (event) => editWaffle(event.target.dataset.id));
        });
        document.querySelectorAll('.delete-waffle-btn').forEach(button => {
            button.addEventListener('click', (event) => deleteWaffle(event.target.dataset.id));
        });
    }

    // --- Modal Form Handling (Add/Edit) ---
    addItemBtn.addEventListener('click', () => {
        editingWaffleId = null;
        waffleForm.reset();
        modalFormTitle.textContent = 'Add New Waffle';
        modalSubmitButton.textContent = 'Add Waffle';
        waffleManageModal.classList.remove('hidden');
    });

    modalCancelButton.addEventListener('click', () => {
        waffleManageModal.classList.add('hidden');
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            waffleManageModal.classList.add('hidden');
        });
    });

    waffleForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = waffleNameInput.value;
        const price = parseFloat(wafflePriceInput.value);
        const rating = parseFloat(waffleRatingInput.value);
        const image = waffleImageInput.value;

        if (!name || isNaN(price) || isNaN(rating) || !image) {
            alert('Please fill in all fields correctly.'); // Replace with a custom modal
            return;
        }
        if (rating < 1 || rating > 5) {
            alert('Rating must be between 1 and 5.'); // Replace with a custom modal
            return;
        }

        if (editingWaffleId) {
            currentWaffles = currentWaffles.map(waffle =>
                waffle.id == editingWaffleId ? { ...waffle, name, price, rating, image } : waffle
            );
        } else {
            const newId = currentWaffles.length > 0 ? Math.max(...currentWaffles.map(w => w.id)) + 1 : 1;
            currentWaffles.push({ id: newId, name, price, rating, image });
        }

        saveWafflesToStorage('employeeWaffleItems', currentWaffles); // Save to employee's working copy
        waffleForm.reset();
        waffleManageModal.classList.add('hidden');
        renderWaffles();
    });

    function editWaffle(id) {
        const waffleToEdit = currentWaffles.find(waffle => waffle.id == id);
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
    }

    function deleteWaffle(id) {
        currentWaffles = currentWaffles.filter(waffle => waffle.id != id);
        saveWafflesToStorage('employeeWaffleItems', currentWaffles);
        renderWaffles();
    }

    // --- Header Button Functionality ---
    goToCustomerViewBtn.addEventListener('click', () => {
        window.location.href = 'waffles.html'; // Navigate to the customer-facing waffle page
    });

    applyChangesBtn.addEventListener('click', () => {
        saveWafflesToStorage('customerWaffleItems', currentWaffles); // Overwrite customer view with employee's changes
        alert('Changes applied to customer view successfully!'); // Replace with a custom modal in a real app
    });

    // --- Search Bar Functionality ---
    searchBar.addEventListener('input', (event) => {
        renderWaffles(event.target.value);
    });

    // --- Logout Functionality ---
    logoutButton.addEventListener('click', () => {
        logoutConfirmationModal.classList.remove('hidden');
    });

    confirmLogoutButton.addEventListener('click', () => {
        localStorage.removeItem('isWaffleLoggedIn');
        window.location.href = 'index.html'; // Redirect to home page after logout
    });

    logoutModalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            logoutConfirmationModal.classList.add('hidden');
        });
    });

    // --- Initial Load ---
    function initializeEmployeePanel() {
        // Load employee's working copy, or if none, load from customer view as a starting point
        currentWaffles = loadWafflesFromStorage('employeeWaffleItems');
        if (currentWaffles.length === 0) {
            // Fallback to default if no employee items and no customer items
            const defaultWaffles = [
                { "id": 1, "name": "Classic Waffle", "price": 350.00, "rating": 4.7, "image": "./images/classicwaffle.jpg" },
                { "id": 2, "name": "Chocolate Chip Waffle", "price": 400.00, "rating": 4.8, "image": "./images/waffle-chocolate.jpg" },
                { "id": 3, "name": "Blueberry Waffle", "price": 380.00, "rating": 4.5, "image": "./images/waffle-blueberry.jpg" },
                { "id": 4, "name": "Strawberry Waffle", "price": 390.00, "rating": 4.6, "image": "./images/waffle-strawberry.jpg" },
                { "id": 5, "name": "Red Velvet Waffle", "price": 420.00, "rating": 4.9, "image": "./images/waffle-redvelvet.jpg" },
                { "id": 6, "name": "Cinnamon Roll Waffle", "price": 410.00, "rating": 4.7, "image": "./images/waffle-cinnamon.jpg" }
            ];
            currentWaffles = loadWafflesFromStorage('customerWaffleItems');
            if (currentWaffles.length === 0) { // If customer items are also empty, use the hardcoded defaults
                currentWaffles = defaultWaffles;
            }
            saveWafflesToStorage('employeeWaffleItems', currentWaffles); // Create a working copy
        }
        renderWaffles();
    }

    initializeEmployeePanel();
});