document.addEventListener('DOMContentLoaded', () => {
    const itemCardsContainer = document.getElementById('itemCardsContainer');
    const searchInput = document.getElementById('searchInput');
    const profileIcon = document.getElementById('profileIcon');
    const shopPage = document.getElementById('shop-page');
    const orderPage = document.getElementById('order-page');
    const backToShopBtn = document.getElementById('backToShopBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const totalBillSpan = document.getElementById('totalBill');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Dessert data (moved from data.json)
    // const defaultItems = [
    //     { "id": 1, "name": "Besan Laddu", "price": 300.00, "rating": 4.4, "image": "./images/besan-laddu.png" },
    //     { "id": 2, "name": "Chomchom", "price": 400.00, "rating": 4.6, "image": "./images/chomchom.png" },
    //     { "id": 3, "name": "Dhokla", "price": 300.50, "rating": 4.1, "image": "./images/dhokla.png" },
    //     { "id": 4, "name": "Doi", "price": 200.50, "rating": 4.3, "image": "./images/doi.png" },
    //     { "id": 5, "name": "Jilebi", "price": 300.00, "rating": 4.7, "image": "./images/jilebi.png" },
    //     { "id": 6, "name": "Kaju Barfi", "price": 500.00, "rating": 4.8, "image": "./images/kaju-barfi.png" },
    //     { "id": 7, "name": "Mithai Pastry", "price": 400.20, "rating": 4.0, "image": "./images/mithai-pastry.png" },
    //     { "id": 8, "name": "Motichur Laddu", "price": 300.80, "rating": 4.5, "image": "./images/laddu.png" },
    //     { "id": 9, "name": "Nolen Sondesh", "price": 400.60, "rating": 4.9, "image": "./images/nolen-sondesh.png" },
    //     { "id": 10, "name": "Roshmalai", "price": 500.50, "rating": 4.9, "image": "./images/roshmalai.png" },
    //     { "id": 11, "name": "Sondesh", "price": 400.00, "rating": 4.2, "image": "./images/sondexh.png" }

    // ];

    // // 2. Load items from localStorage using the 'customerItems' key
    // //    If no published data exists, it will use the defaultItems.
    // let items = defaultItems; // Start with default items
    // if (localStorage.getItem('customerItems')) {
    //     try {
    //         const storedItems = JSON.parse(localStorage.getItem('customerItems'));
    //         if (Array.isArray(storedItems)) { // Basic validation to ensure it's an array
    //             items = storedItems;
    //         }
    //     } catch (e) {
    //         console.error("Error parsing customerItems from localStorage:", e);
    //         // Fallback to defaultItems if parsing fails
    //     }
    // }

    // --- END OF CHANGES ---
    // Replace the old hardcoded 'items' array and localStorage check with this:
    let items = [];

    async function loadItemsFromSQL() {
        try {
            const response = await fetch('http://localhost:3000/api/sweet_desserts');
            items = await response.json();
            displayDesserts(items);
        } catch (error) {
            console.error("Error fetching from SQL:", error);
        }
    }

    // Call this at the end of DOMContentLoaded instead of displayDesserts(items)
    loadItemsFromSQL();


    let cart = JSON.parse(localStorage.getItem('customerCart')) || [];// Load cart from localStorage or initialize empty // Load cart from localStorage or initialize empty

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
     * Renders the dessert cards on the shop page.
     * @param {Array} desserts - An array of items to display.
     */
    function displayDesserts(desserts) {
        itemCardsContainer.innerHTML = ''; // Clear previous cards
        if (desserts.length === 0) {
            itemCardsContainer.innerHTML = '<p class="text-muted text-center w-100">No desserts found matching your search.</p>';
            return;
        }
        desserts.forEach(item => {
            const cardHtml = `
                        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                            <div class="card h-100 item-card card-custom-border">
                                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
                                    <p class="card-text text-muted">Price (per kg) : ${Number(item.price).toFixed(2)} Tk</p>
                                    ${getStarRatingHtml(Number(item.rating))}
                                    <button class="btn btn-custom-mid-brown mt-auto order-btn" data-item-id="${item.id}">Order</button>
                                </div>
                            </div>
                        </div>
                    `;
            itemCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Attach event listeners to new "Order" buttons
        document.querySelectorAll('.order-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.itemId);
                addToCart(itemId);
            });
        });
    }

    /**
     * Adds an item to the cart or increments its quantity.
     * @param {number} itemId - The ID of the item to add.
     */
    // function addToCart(itemId) {
    //     const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    //     if (existingItemIndex > -1) {
    //         cart[existingItemIndex].quantity++;
    //     } else {
    //         const itemToAdd = items.find(item => item.id === itemId);
    //         if (itemToAdd) {
    //             cart.push({ ...itemToAdd, quantity: 1 });
    //         }
    //     }
    //     localStorage.setItem('customerCart', JSON.stringify(cart)); // Save cart to localStorage
    //     alert(`${items.find(item => item.id === itemId).name} added to cart!`); // Simple confirmation
    //     console.log('Cart:', cart);
    // }

    function addToCart(itemId) {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        const itemToAdd = items.find(item => item.id === itemId);
        if (itemToAdd) {
            cart.push({ ...itemToAdd, quantity: 1 });
        }
    }
    // Save the unified cart to localStorage.
    localStorage.setItem('customerCart', JSON.stringify(cart));
    
    alert(`${items.find(item => item.id === itemId).name} added to cart!`);
    
    // Log the unified cart from localStorage to confirm it's working.
    console.log('Cart:', JSON.parse(localStorage.getItem('customerCart')));
}

    /**
     * Updates the quantity of an item in the cart.
     * @param {number} itemId - The ID of the item to update.
     * @param {number} change - The amount to change the quantity by (+1 or -1).
     */
    // function updateQuantity(itemId, change) {
    //     const itemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    //     if (itemIndex > -1) {
    //         cart[itemIndex].quantity += change;
    //         if (cart[itemIndex].quantity <= 0) {
    //             cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
    //         }
    //         localStorage.setItem('cart', JSON.stringify(cart));
    //         renderOrderPage(); // Re-render order page to reflect changes
    //     }
    // }

    function updateQuantity(itemId, change) {
    const idx = cart.findIndex(i => i.id === itemId);
    if (idx > -1) {
        cart[idx].quantity = (cart[idx].quantity || 1) + change;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        
        // **CHANGE:** We now save to the unified cart key.
        localStorage.setItem("customerCart", JSON.stringify(cart));
        
        renderOrderPage();
    }
}

    /**
     * Calculates and displays the total bill.
     */
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalBillSpan.textContent = total.toFixed(2);
    }

    /**
     * Renders the order details page with cart items.
     */
    function renderOrderPage() {
        cartItemsContainer.innerHTML = ''; // Clear existing cart items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted mt-5">Your cart is empty.</p>';
            checkoutBtn.classList.add('d-none'); // Hide checkout button if cart is empty
        } else {
            checkoutBtn.classList.remove('d-none'); // Show checkout button
            cart.forEach(item => {
                const cartItemHtml = `
                            <div class="col-12 mb-3">
                                <div class="card order-page-card d-flex flex-row align-items-center p-3">
                                    <img src="${item.image}" class="img-fluid rounded me-3" style="width: 80px; height: 80px; object-fit: cover;" alt="${item.name}">
                                    <div class="flex-grow-1">
                                        <h5 class="mb-0 card-title-custom fw-bold">${item.name}</h5>
                                        <p class="mb-0 text-muted">Tk(per kg) ${item.price.toFixed(2)}</p>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <button class="btn btn-sm btn-outline-secondary me-2 quantity-btn" data-item-id="${item.id}" data-change="-1">-</button>
                                        <span class="fs-5 fw-bold me-2">${item.quantity}</span>
                                        <button class="btn btn-sm btn-outline-secondary quantity-btn" data-item-id="${item.id}" data-change="1">+</button>
                                    </div>
                                    <div class="ms-4">
                                        <span class="fs-5 fw-bold">Tk${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
            });

            // Attach event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const itemId = parseInt(event.target.dataset.itemId);
                    const change = parseInt(event.target.dataset.change);
                    updateQuantity(itemId, change);
                });
            });
        }
        calculateTotal();
    }

    /**
     * Switches between the shop page and the order page.
     * @param {string} pageId - The ID of the page to show ('shop-page' or 'order-page').
     */
    function showPage(pageId) {
        if (pageId === 'shop-page') {
            shopPage.classList.remove('hidden-page');
            shopPage.classList.add('active-page');
            orderPage.classList.remove('active-page');
            orderPage.classList.add('hidden-page');
            displayDesserts(items); // Re-render shop page on return
        } else if (pageId === 'order-page') {
            orderPage.classList.remove('hidden-page');
            orderPage.classList.add('active-page');
            shopPage.classList.remove('active-page');
            shopPage.classList.add('hidden-page');
            renderOrderPage(); // Render order page when navigating to it
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

    // Profile icon click to go to order page
    profileIcon.addEventListener('click', () => {
        // showPage('order.html');
        window.location.href = "order.html";
    });

    // Back to shop button click
    backToShopBtn.addEventListener('click', () => {
        showPage('shop-page');
    });

    // Checkout button (for demonstration, just logs cart)
    // checkoutBtn.addEventListener('click', () => {
    //     if (cart.length > 0) {
    //         alert('Proceeding to checkout! Your order has been placed.');
    //         console.log('Final Order:', cart);
    //         cart = []; // Clear cart after checkout
    //         localStorage.removeItem('customerCart'); // Clear localStorage
    //         renderOrderPage(); // Update UI
    //         showPage('shop-page'); // Go back to shop page
    //     } else {
    //         alert('Your cart is empty. Please add items before checking out.');
    //     }
    // });

    document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length > 0) {
        alert('Proceeding to checkout! Your order has been placed.');
        console.log('Final Order:', cart);
        cart = []; // Clear cart after checkout
        localStorage.removeItem('customerCart'); // Clear localStorage
        renderOrderPage(); // Update UI
        window.location.href = "cake-card.html"; // Go back to shop page
    } else {
        alert('Your cart is empty. Please add items before checking out.');
    }
});

    // Initial display of desserts when the page loads
    loadItemsFromSQL();
});