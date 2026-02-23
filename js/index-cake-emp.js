document.addEventListener('DOMContentLoaded', () => {
    // --- UI Element References ---
    const itemCardsContainer = document.getElementById('itemCardsContainer');
    const searchInput = document.getElementById('searchInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const employeeMainPage = document.getElementById('employee-main-page');
    const addItemPage = document.getElementById('add-item-page');
    const addItemForm = document.getElementById('addItemForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const addItemPageTitle = document.getElementById('addItemPageTitle');
    const itemIdToEditInput = document.getElementById('itemIdToEdit');

    // Modal elements
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let itemIdToDelete = null;

    let items = [];

    /**
     * FETCH: Load all cakes and pastries from SQL
     */
    async function loadItemsFromSQL() {
        try {
            const response = await fetch('http://localhost:3000/api/cakeandpastry');
            items = await response.json();
            displayDesserts(items);
        } catch (error) {
            console.error("Error fetching from SQL:", error);
            itemCardsContainer.innerHTML = '<p class="text-danger text-center w-100">Server Error: Could not load data.</p>';
        }
    }

    /**
     * RENDER: Display cards with Edit/Delete buttons
     */
    function displayDesserts(desserts) {
        itemCardsContainer.innerHTML = '';
        if (desserts.length === 0) {
            itemCardsContainer.innerHTML = '<p class="text-muted text-center w-100">No items found.</p>';
            return;
        }

        desserts.forEach(item => {
            const cardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 item-card card-custom-border">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}" 
                             onerror="this.src='https://placehold.co/400x250?text=No+Image';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
                            <p class="card-text text-muted mb-1">Price: ${Number(item.price).toFixed(2)} Tk</p>
                            <div class="mt-auto d-flex justify-content-between">
                                <button class="btn btn-sm btn-info edit-btn" data-item-id="${item.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-item-id="${item.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            itemCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Button Listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editItem(parseInt(btn.dataset.itemId)));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                itemIdToDelete = parseInt(btn.dataset.itemId);
                deleteConfirmModal.show();
            });
        });
    }

    /**
     * DELETE: Remove item from Database
     */
    confirmDeleteBtn.addEventListener('click', async () => {
        if (itemIdToDelete) {
            try {
                const response = await fetch(`http://localhost:3000/api/cakeandpastry/${itemIdToDelete}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    deleteConfirmModal.hide();
                    loadItemsFromSQL(); // Refresh UI
                }
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    });

    /**
     * EDIT: Populate form
     */
    function editItem(itemId) {
        const item = items.find(i => i.id === itemId);
        if (item) {
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemRating').value = item.rating;
            document.getElementById('itemImage').value = item.image;
            // Handle Category dropdown if you have one, else text input
            const categoryField = document.getElementById('itemCategory');
            if(categoryField) categoryField.value = item.category;

            itemIdToEditInput.value = item.id;
            formSubmitBtn.textContent = 'Update Item';
            addItemPageTitle.textContent = 'Edit Cake/Pastry';
            showPage('add-item-page');
        }
    }

    /**
     * CREATE / UPDATE: Submit form to SQL
     */
    addItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const currentId = itemIdToEditInput.value;
        const itemData = {
            name: document.getElementById('itemName').value,
            price: parseFloat(document.getElementById('itemPrice').value),
            rating: parseFloat(document.getElementById('itemRating').value),
            image: document.getElementById('itemImage').value,
            category: document.getElementById('itemCategory').value.toLowerCase() // Ensure lowercase for ENUM
        };

        try {
            const url = currentId 
                ? `http://localhost:3000/api/cakeandpastry/${currentId}` 
                : 'http://localhost:3000/api/cakeandpastry';
            
            const method = currentId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });

            if (response.ok) {
                addItemForm.reset();
                itemIdToEditInput.value = '';
                showPage('employee-main-page');
                loadItemsFromSQL();
            }
        } catch (error) {
            console.error("Save failed:", error);
        }
    });

    /**
     * NAVIGATION
     */
    function showPage(pageId) {
        if (pageId === 'employee-main-page') {
            employeeMainPage.classList.replace('hidden-page', 'active-page');
            addItemPage.classList.replace('active-page', 'hidden-page');
        } else {
            addItemPage.classList.replace('hidden-page', 'active-page');
            employeeMainPage.classList.replace('active-page', 'hidden-page');
        }
    }

    // --- Search & Simple Listeners ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = items.filter(i => i.name.toLowerCase().includes(term));
        displayDesserts(filtered);
    });

    addItemBtn.addEventListener('click', () => {
        itemIdToEditInput.value = '';
        addItemForm.reset();
        formSubmitBtn.textContent = 'Add Item';
        addItemPageTitle.textContent = 'Add New Cake/Pastry';
        showPage('add-item-page');
    });

    document.getElementById('backToEmployeeMainBtn').addEventListener('click', () => showPage('employee-main-page'));
    document.getElementById('cancelAddItemBtn').addEventListener('click', () => showPage('employee-main-page'));

    // Start
    loadItemsFromSQL();
});