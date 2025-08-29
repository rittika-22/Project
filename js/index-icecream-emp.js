document.addEventListener('DOMContentLoaded', () => {

    // Login Check: Redirect to the main page if the user is not logged in.
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return; // Stop execution if not logged in
    }

    const itemCardsContainer = document.getElementById('itemCardsContainer');
    const searchInput = document.getElementById('searchInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const applyChangesBtn = document.getElementById('applyChangesBtn');
    const employeeMainPage = document.getElementById('employee-main-page');
    const addItemPage = document.getElementById('add-item-page');
    const backToEmployeeMainBtn = document.getElementById('backToEmployeeMainBtn');
    const addItemForm = document.getElementById('addItemForm');
    const cancelAddItemBtn = document.getElementById('cancelAddItemBtn');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const addItemPageTitle = document.getElementById('addItemPageTitle');
    const itemIdToEditInput = document.getElementById('itemIdToEdit');

    // Modal elements
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let itemIdToDelete = null;

    // Ice Cream data (initial data for employees to manage)
    // This initial data will only be used if 'iceCreamItems' in localStorage is empty
    let items = [
        { "id": 1, "name": "Rainbow Icecream", "price": 450.00, "rating": 4.0, "image": "./images/icecream.png" },
        { "id": 2, "name": "Chocolate Fudge", "price": 500.00, "rating": 4.8, "image": "./images/chocolate-fudge.jpg" },
        { "id": 3, "name": "Mint Chocolate Chip", "price": 475.00, "rating": 4.5, "image": "./images/mint-chip.jpg" },
        { "id": 4, "name": "Strawberry Delight", "price": 450.00, "rating": 4.2, "image": "./images/strawberry.jpg" },
        { "id": 5, "name": "Vanilla Bean", "price": 420.00, "rating": 4.0, "image": "./images/vanilla.jpg" },
        { "id": 6, "name": "Cookie Dough", "price": 520.00, "rating": 4.7, "image": "./images/cookie-dough.jpg" },
    ];

    // Load items from localStorage if available (for persistence across sessions)
    if (localStorage.getItem('iceCreamItems')) {
        items = JSON.parse(localStorage.getItem('iceCreamItems'));
    }

    /**
     * Renders the star rating HTML based on a given rating value.
     * @param {number} rating - The rating value (e.g., 4.0).
     * @returns {string} HTML string for star icons.
     */
    function getStarRatingHtml(rating) {
        let stars = '';
        for (let i = 1; i <= 6; i++) {
            if (rating >= i) {
                stars += '<i class="fas fa-star"></i>'; // Full star
            } else if (rating >= i - 0.5) {
                stars += '<i class="fas fa-star-half-alt"></i>'; // Half star
            } else {
                stars += '<i class="far fa-star"></i>'; // Empty star
            }
        }
        return `<div class="star-rating text-lg">${stars} (${rating.toFixed(1)})</div>`;
    }

    /**
     * Renders the ice cream cards on the employee main page with edit/delete buttons.
     * @param {Array} iceCreams - An array of items to display.
     */
    function displayIceCreams(iceCreams) {
        itemCardsContainer.innerHTML = ''; // Clear previous cards
        if (iceCreams.length === 0) {
            itemCardsContainer.innerHTML = '<p class="text-muted text-center w-100">No ice creams found.</p>';
            return;
        }
        iceCreams.forEach(item => {
            const cardHtml = `
                        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                            <div class="card h-100 item-card card-custom-border">
                                <img src="${item.image}" class="card-img-top" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x250/cccccc/333333?text=Image+Not+Found';">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
                                    <p class="card-text text-muted">Price : ${item.price.toFixed(2)} Tk</p>
                                    ${getStarRatingHtml(item.rating)}
                                    <div class="mt-auto d-flex justify-content-between">
                                        <button class="btn btn-sm btn-info edit-btn" data-item-id="${item.id}">Edit</button>
                                        <button class="btn btn-sm btn-danger delete-btn" data-item-id="${item.id}">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            itemCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Attach event listeners to new "Edit" and "Delete" buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.itemId);
                editItem(itemId);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.itemId);
                showDeleteConfirmModal(itemId); // Show custom modal
            });
        });
    }

    /**
     * Shows the delete confirmation modal.
     * @param {number} id - The ID of the item to be deleted.
     */
    function showDeleteConfirmModal(id) {
        itemIdToDelete = id; // Store the ID
        deleteConfirmModal.show();
    }

    /**
     * Handles the actual deletion after confirmation.
     */
    confirmDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.hide(); // Hide modal first
        if (itemIdToDelete !== null) {
            const initialLength = items.length;
            items = items.filter(item => item.id !== itemIdToDelete);
            if (items.length < initialLength) {
                localStorage.setItem('iceCreamItems', JSON.stringify(items)); // Save updated items
                console.log('Item deleted successfully from employee view!');
                displayIceCreams(items); // Re-render the list
            } else {
                console.log('Item not found for deletion.');
            }
            itemIdToDelete = null; // Reset
        }
    });


    /**
     * Populates the form for editing an item and switches to the add/edit page.
     * @param {number} itemId - The ID of the item to edit.
     */
    function editItem(itemId) {
        const itemToEdit = items.find(item => item.id === itemId);
        if (itemToEdit) {
            document.getElementById('itemName').value = itemToEdit.name;
            document.getElementById('itemPrice').value = itemToEdit.price;
            document.getElementById('itemRating').value = itemToEdit.rating;
            document.getElementById('itemImage').value = itemToEdit.image;
            itemIdToEditInput.value = itemToEdit.id; // Store ID in hidden input
            formSubmitBtn.textContent = 'Update Item'; // Change button text
            addItemPageTitle.textContent = 'Edit Item'; // Change page title
            showPage('add-item-page'); // Switch to the add/edit form page
        } else {
            console.error('Item not found for editing:', itemId);
        }
    }

    /**
     * Handles adding a new item or updating an existing item from the form.
     * @param {Event} event - The form submission event.
     */
    function handleAddItemForm(event) {
        event.preventDefault(); // Prevent default form submission

        const itemName = document.getElementById('itemName').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemRating = parseFloat(document.getElementById('itemRating').value);
        const itemImage = document.getElementById('itemImage').value;
        const currentItemId = itemIdToEditInput.value ? parseInt(itemIdToEditInput.value) : null;

        if (!itemName || isNaN(itemPrice) || isNaN(itemRating) || !itemImage) {
            console.error('Please fill in all fields with valid data.');
            return;
        }

        if (currentItemId) {
            // Update existing item
            const itemIndex = items.findIndex(item => item.id === currentItemId);
            if (itemIndex > -1) {
                items[itemIndex] = {
                    id: currentItemId,
                    name: itemName,
                    price: itemPrice,
                    rating: itemRating,
                    image: itemImage
                };
                console.log(`${itemName} updated successfully in employee view!`);
            } else {
                console.error('Item not found for update:', currentItemId);
            }
        } else {
            // Add new item
            const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
            const newItem = {
                id: newId,
                name: itemName,
                price: itemPrice,
                rating: itemRating,
                image: itemImage
            };
            items.push(newItem);
            console.log(`${newItem.name} added successfully to employee view!`);
        }

        localStorage.setItem('iceCreamItems', JSON.stringify(items)); // Save updated items for employee view
        addItemForm.reset();
        itemIdToEditInput.value = '';
        formSubmitBtn.textContent = 'Add Item';
        addItemPageTitle.textContent = 'Add New Item';
        showPage('employee-main-page');
    }

    /**
     * Saves the current employee items to the customer-facing localStorage.
     */
    function applyChangesToCustomerView() {
        localStorage.setItem('customerIceCreamItems', JSON.stringify(items));
        alert('Changes applied to Customer View! Please refresh the customer page to see updates.');
        console.log('Items published to customer view (localStorage key: customerIceCreamItems)');
    }

    /**
     * Switches between the main employee page and the add item page.
     * @param {string} pageId - The ID of the page to show ('employee-main-page' or 'add-item-page').
     */
    function showPage(pageId) {
        if (pageId === 'employee-main-page') {
            employeeMainPage.classList.remove('hidden-page');
            employeeMainPage.classList.add('active-page');
            addItemPage.classList.remove('active-page');
            addItemPage.classList.add('hidden-page');
            displayIceCreams(items); // Re-render main page on return
        } else if (pageId === 'add-item-page') {
            addItemPage.classList.remove('hidden-page');
            addItemPage.classList.add('active-page');
            employeeMainPage.classList.remove('active-page');
            employeeMainPage.classList.add('hidden-page');
            if (!itemIdToEditInput.value) {
                addItemForm.reset();
                formSubmitBtn.textContent = 'Add Item';
                addItemPageTitle.textContent = 'Add New Item';
            }
        }
    }

    // --- Event Listeners ---

    // Search functionality
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
        );
        displayIceCreams(filteredItems);
    });

    // "Add Item" button click to go to add item page
    addItemBtn.addEventListener('click', () => {
        itemIdToEditInput.value = ''; // Ensure we're in "add" mode
        showPage('add-item-page');
    });

    // "Apply Changes" button click
    applyChangesBtn.addEventListener('click', applyChangesToCustomerView);

    // "Back to Employee Panel" button click
    backToEmployeeMainBtn.addEventListener('click', () => {
        showPage('employee-main-page');
    });

    // Form submission for adding/updating new item
    addItemForm.addEventListener('submit', handleAddItemForm);

    // Cancel button on add item form
    cancelAddItemBtn.addEventListener('click', () => {
        showPage('employee-main-page');
    });

    // Initial display of ice creams when the page loads
    displayIceCreams(items);
});