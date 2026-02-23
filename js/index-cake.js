document.addEventListener("DOMContentLoaded", () => {
    // 1. UI Element References
    const cakeContainer = document.getElementById('cake-section-cards');
    const pastryContainer = document.getElementById('pastry-section-cards');
    const searchInput = document.getElementById('cakeSearchInput');
    const cakeCartCount = document.getElementById('cakeCartCount');
    const cakeCartButton = document.getElementById('cakeCartButton'); // The cart icon button
    
    let items = [];
    // 2. Read from the unified cart key
    let cart = JSON.parse(localStorage.getItem('customerCart')) || [];

    /**
     * FETCH: Load items from your SQL Database
     */
    async function loadItemsFromSQL() {
        try {
            const response = await fetch('http://localhost:3000/api/cakeandpastry');
            if (!response.ok) throw new Error("Backend unreachable");
            
            items = await response.json();
            displayDesserts(items); 
        } catch (error) {
            console.error("Error fetching from SQL:", error);
            const errorMsg = '<p class="text-danger text-center w-100">Unable to load data. Please check your server.</p>';
            if(cakeContainer) cakeContainer.innerHTML = errorMsg;
        }
    }

    /**
     * RENDER: Logic to split items into Cake and Pastry sections
     */
    function displayDesserts(desserts) {
        cakeContainer.innerHTML = '';
        pastryContainer.innerHTML = '';

        // Filter and Render Cakes
        const cakes = desserts.filter(item => item.category.toLowerCase() === 'cake');
        if (cakes.length === 0) {
            cakeContainer.innerHTML = '<p class="text-muted text-center w-100">No cakes found.</p>';
        } else {
            cakes.forEach(item => cakeContainer.insertAdjacentHTML('beforeend', createCardHtml(item)));
        }

        // Filter and Render Pastries
        const pastries = desserts.filter(item => item.category.toLowerCase() === 'pastry');
        if (pastries.length === 0) {
            pastryContainer.innerHTML = '<p class="text-muted text-center w-100">No pastries found.</p>';
        } else {
            pastries.forEach(item => pastryContainer.insertAdjacentHTML('beforeend', createCardHtml(item)));
        }

        // Re-attach listeners to "Order" buttons
        document.querySelectorAll('.order-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.itemId);
                addToCart(itemId);
            });
        });
    }

    /**
     * HELPER: Generates the Card HTML (No category badge, Red button)
     */
    function createCardHtml(item) {
        return `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 item-card card-custom-border shadow-sm">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
                        <p class="card-text text-muted mb-1">Price: ${Number(item.price).toFixed(2)} Tk</p>
                        <div class="mb-3">
                            ${getStarRatingHtml(item.rating)}
                        </div>
                        <button class="btn btn-danger mt-auto order-btn w-100" data-item-id="${item.id}">Order</button>
                    </div>
                </div>
            </div>`;
    }

    function getStarRatingHtml(rating) {
        let stars = '';
        const numRating = Number(rating) || 0;
        for (let i = 1; i <= 5; i++) {
            if (numRating >= i) stars += '<i class="fas fa-star"></i>';
            else if (numRating >= i - 0.5) stars += '<i class="fas fa-star-half-alt"></i>';
            else stars += '<i class="far fa-star"></i>';
        }
        return `<div class="star-rating">${stars} (${numRating.toFixed(1)})</div>`;
    }

    function addToCart(itemId) {
        const itemToAdd = items.find(item => item.id === itemId);
        if (!itemToAdd) return;
        
        // Refresh cart from storage to stay in sync
        cart = JSON.parse(localStorage.getItem('customerCart')) || [];
        
        const existing = cart.find(i => i.id === itemId);
        if (existing) existing.quantity++;
        else cart.push({ ...itemToAdd, quantity: 1 });
        
        localStorage.setItem('customerCart', JSON.stringify(cart));
        updateCartCount();
        alert(`${itemToAdd.name} added to cart!`);
    }

    function updateCartCount() {
        const count = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
        if(cakeCartCount) {
            cakeCartCount.textContent = count;
            cakeCartCount.style.display = count > 0 ? "inline" : "none";
        }
    }

    // 3. CART BUTTON REDIRECTION FIX
    if (cakeCartButton) {
        cakeCartButton.addEventListener('click', () => {
            // Change this to the exact name of your checkout file
            window.location.href = "order.html"; 
        });
    }

    // Search logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = items.filter(item => item.name.toLowerCase().includes(term));
        displayDesserts(filtered);
    });

    loadItemsFromSQL();
    updateCartCount();
});