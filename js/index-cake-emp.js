document.addEventListener('DOMContentLoaded', () => {
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

    // Load items from localStorage or use a default list
    let items = JSON.parse(localStorage.getItem('employeeCakeItems')) || [
            { id: 1, name: "Chocolate Cake", price: 800, rating: 4.4, image: "./images/chocolate-cake.jpg", category: "cake" },
    { id: 2, name: "Red Velvet Cake", price: 950, rating: 4.7, image: "./images/red-velbat-kitkat-cake.jpg", category: "cake" },
    { id: 3, name: "Black Forest Cake", price: 1000, rating: 4.5, image: "./images/black-forest-cake.JPG", category: "cake" },
    { id: 4, name: "Mango Cake", price: 1050, rating: 4.5, image: "./images/mango-cake.jpg", category: "cake" },
    { id: 5, name: "Chocolate Pastry", price: 350, rating: 3.9, image: "./images/choco-pastry.jpeg", category: "pastry" },
    { id: 6, name: "Strawberry Shortcake", price: 500, rating: 4.8, image: "./images/strawberry.jpg", category: "pastry" },
    { id: 7, name: "Fruit Tart", price: 600, rating: 4.1, image: "./images/fruit-tart.jpg", category: "pastry" },
    { id: 8, name: "Vanilla Cake", price: 750, rating: 4.3, image: "./images/vanilla-cake.webp", category: "cake" },
    { id: 9, name: "Blueberry Cheese Cake", price: 1300, rating: 4.0, image: "./images/chesse-cake.jpg", category: "cake" },
    { id: 10, name: "Coffee Cake", price: 1100, rating: 4.3, image: "./images/coffee.jpeg", category: "cake" },
    { id: 11, name: "Cinnamon rolls", price: 650, rating: 4.3, image: "./images/cinnamon-roll.jpg", category: "pastry" },
    { id: 12, name: "Puff Pastry", price: 300, rating: 4.3, image: "./images/puff-pastry.jpg", category: "pastry" },
    { id: 13, name: "Croissant", price: 200, rating: 4.3, image: "./images/croissant.webp", category: "pastry" },
    { id: 14, name: "Donuts", price: 100, rating: 4.3, image: "./images/donuts.jpg", category: "pastry" },
    { id: 15, name: "Lemon meringue tart", price: 400, rating: 4.3, image: "./images/tart.jpg", category: "pastry" },
    { id: 16, name: "Butterscotch Cake", price: 1200, rating: 4.3, image: "./images/butterscotch.jpg",category:"cake"}
    ];
     
    /**
     * Renders the star rating HTML based on a given rating value.
     * @param {number} rating - The rating value (e.g., 4.0).
     * @returns {string} HTML string for star icons.
     */
    function getStarRatingHtml(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
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
     * Renders the dessert cards on the employee main page with edit/delete buttons.
     * @param {Array} desserts - An array of items to display.
     */
    function displayDesserts(desserts) {
        itemCardsContainer.innerHTML = ''; // Clear previous cards
        if (desserts.length === 0) {
            itemCardsContainer.innerHTML = '<p class="text-muted text-center w-100">No desserts found.</p>';
            return;
        }
        desserts.forEach(item => {
            const cardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 item-card card-custom-border">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x250/cccccc/333333?text=Image+Not+Found';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
                            <p class="card-text text-muted">Price: ${item.price.toFixed(2)} Tk</p>
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
                localStorage.setItem('employeeCakeItems', JSON.stringify(items)); // Save updated items
                console.log('Item deleted successfully from employee view!');
                displayDesserts(items); // Re-render the list
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

        localStorage.setItem('employeeCakeItems', JSON.stringify(items)); // Save updated items for employee view
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
        localStorage.setItem('customerCakeItems', JSON.stringify(items));
        // Replaced alert with a custom toast-like message for better UX
        const toast = document.createElement('div');
        toast.className = 'toast show align-items-center text-white bg-success border-0';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '1050';
        toast.innerHTML = `
          <div class="d-flex">
            <div class="toast-body">Changes applied! Customers will see the updated items.</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
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
            displayDesserts(items); // Re-render main page on return
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
        const filteredDesserts = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
        );
        displayDesserts(filteredDesserts);
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

    // Initial display of desserts when the page loads
    displayDesserts(items);
});
