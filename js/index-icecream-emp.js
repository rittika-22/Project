document.addEventListener('DOMContentLoaded', () => {
    const itemCardsContainer = document.getElementById('itemCardsContainer');
    const searchInput = document.getElementById('searchInput');
    const addItemBtn = document.getElementById('addItemBtn');
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

    let items = []; 
    const API_URL = 'http://localhost:3000/api/icecreams';

    // --- ১. ডাটাবেস থেকে আইসক্রিম লোড করা ---
    async function fetchIceCreams() {
        try {
            const response = await fetch(API_URL);
            items = await response.json();
            displayIceCreams(items);
        } catch (err) {
            console.error('Error fetching ice creams:', err);
            itemCardsContainer.innerHTML = '<p class="text-danger text-center w-100">Failed to load data from database.</p>';
        }
    }

    function getStarRatingHtml(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else if (rating >= i - 0.5) {
                stars += '<i class="fas fa-star-half-alt text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-warning"></i>';
            }
        }
        return `<div class="star-rating text-lg">${stars} (${parseFloat(rating).toFixed(1)})</div>`;
    }

    // --- ২. কার্ড রেন্ডার করা ---
    function displayIceCreams(iceCreams) {
        itemCardsContainer.innerHTML = ''; 
        if (iceCreams.length === 0) {
            itemCardsContainer.innerHTML = '<p class="text-muted text-center w-100">No ice creams found.</p>';
            return;
        }

        iceCreams.forEach(item => {
            const imagePath = item.image.startsWith('http') || item.image.startsWith('./') || item.image.startsWith('images/') 
                                ? item.image 
                                : `images/${item.image}`;

            const cardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 item-card card-custom-border shadow-sm">
                        <img src="${imagePath}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x250?text=Ice+Cream';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
                            <p class="card-text text-muted">Price : ${parseFloat(item.price).toFixed(2)} Tk</p>
                            ${getStarRatingHtml(item.rating)}
                            <div class="mt-auto d-flex justify-content-between pt-3">
                                <button class="btn btn-sm btn-info edit-btn" data-item-id="${item.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-item-id="${item.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            itemCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

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

    // --- ৩. আইসক্রিম ডিলিট করা ---
    confirmDeleteBtn.addEventListener('click', async () => {
        if (itemIdToDelete) {
            try {
                const response = await fetch(`${API_URL}/${itemIdToDelete}`, { method: 'DELETE' });
                if (response.ok) {
                    deleteConfirmModal.hide();
                    fetchIceCreams();
                }
            } catch (err) {
                console.error('Error deleting:', err);
            }
        }
    });

    // --- ৪. এডিট মুড ওপেন করা ---
    function editItem(id) {
        const item = items.find(i => i.id === id);
        if (item) {
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemRating').value = item.rating;
            document.getElementById('itemImage').value = item.image;
            itemIdToEditInput.value = item.id;
            
            formSubmitBtn.textContent = 'Update Item';
            addItemPageTitle.textContent = 'Edit Ice Cream';
            showPage('add-item-page');
        }
    }

    // --- ৫. ফর্ম সাবমিট (Add/Update) ---
    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemData = {
            name: document.getElementById('itemName').value,
            price: parseFloat(document.getElementById('itemPrice').value),
            rating: parseFloat(document.getElementById('itemRating').value),
            image: document.getElementById('itemImage').value
        };

        const currentId = itemIdToEditInput.value;

        try {
            let response;
            if (currentId) {
                response = await fetch(`${API_URL}/${currentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
            }

            if (response.ok) {
                addItemForm.reset();
                showPage('employee-main-page');
                fetchIceCreams();
            }
        } catch (err) {
            console.error('Error saving data:', err);
        }
    });

    // --- UI Navigation (Sweet/Waffle স্টাইলে পেজ সুইচিং) ---
    function showPage(pageId) {
        if (pageId === 'employee-main-page') {
            // মেইন প্যানেল দেখাবে, ফর্ম হাইড হবে
            employeeMainPage.style.display = 'block';
            addItemPage.style.display = 'none';
            
            employeeMainPage.classList.remove('hidden-page');
            addItemPage.classList.add('hidden-page');
        } else {
            // কার্ডগুলো সব হাইড হয়ে যাবে, শুধু ফর্মটি আসবে (আপনার বন্ধুর মতো)
            employeeMainPage.style.display = 'none';
            addItemPage.style.display = 'block';
            
            employeeMainPage.classList.add('hidden-page');
            addItemPage.classList.remove('hidden-page');
            
            window.scrollTo(0, 0); // ফর্ম ওপেন হলে পেজের শুরুতে নিয়ে যাবে
        }
    }

    // বাটন ক্লিক ইভেন্টগুলো (নিশ্চিত করুন এগুলো যেন showPage ফাংশনের বাইরে থাকে)
    addItemBtn.addEventListener('click', () => {
        itemIdToEditInput.value = '';
        addItemForm.reset();
        formSubmitBtn.textContent = 'Add Item';
        addItemPageTitle.textContent = 'Add New Ice Cream';
        showPage('add-item-page'); //
    });

    cancelAddItemBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('employee-main-page');
    });

    backToEmployeeMainBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('employee-main-page');
    });

    addItemBtn.addEventListener('click', () => {
        itemIdToEditInput.value = '';
        addItemForm.reset();
        formSubmitBtn.textContent = 'Add Item';
        addItemPageTitle.textContent = 'Add New Ice Cream';
        showPage('add-item-page');
    });

    cancelAddItemBtn.addEventListener('click', () => showPage('employee-main-page'));
    backToEmployeeMainBtn.addEventListener('click', () => showPage('employee-main-page'));

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = items.filter(i => i.name.toLowerCase().includes(term));
        displayIceCreams(filtered);
    });

    fetchIceCreams();
});