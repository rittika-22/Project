document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error("Failed to parse cart data from localStorage", e);
    }

    const updatedItems = localStorage.getItem('customerIceCreamItems');

    let iceCreamProducts;

    if (updatedItems) {
        // Use the data saved by the employee panel
        iceCreamProducts = JSON.parse(updatedItems);
        console.log('Using employee-updated ice cream data.');
    }


    // let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // //

    // const updatedItems = localStorage.getItem('customerIceCreamItems');

    // let iceCreamProducts;

    // if (updatedItems) {
    //     // Use the data saved by the employee panel
    //     iceCreamProducts = JSON.parse(updatedItems);
    //     console.log('Using employee-updated ice cream data.');
    else {
        // Fallback to a default hardcoded list if no employee updates exist
        iceCreamProducts = [
            { "id": 1, "name": "Rainbow Icecream", "price": 450.00, "rating": 4.0, "image": "./images/icecream.png" },
            { "id": 2, "name": "Chocolate Fudge", "price": 500.00, "rating": 4.5, "image": "./images/chocolate-fudge.jpg" },
            { "id": 3, "name": "Mint Chocolate Chip", "price": 475.00, "rating": 5.0, "image": "./images/mint-chip.jpg" },
            { "id": 4, "name": "Strawberry Swirl", "price": 425.00, "rating": 3.5, "image": "./images/strawberry.jpg" },
            { "id": 5, "name": "Vanilla Bean", "price": 380.00, "rating": 4.5, "image": "./images/vanilla.jpg" },
            { "id": 6, "name": "Cookie Dough", "price": 530.00, "rating": 5.0, "image": "./images/cookie-dough.jpg" },
        ];
        console.log('Using default hardcoded ice cream data.');
    }
    // --- END OF NEW CODE ---

    // --- NEW: Function to render product cards ---
    function renderProducts(products) {
        const productGrid = document.getElementById('ice-cream-grid');
        if (!productGrid) {
            console.error('Ice cream grid container not found.');
            return;
        }

        productGrid.innerHTML = ''; // Clear existing products

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'icecream-card d-flex flex-column justify-content-center align-items-center bg-white rounded shadow-md overflow-hidden border border-amber-200 text-center h-full';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover">
                <div class="p-3">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${product.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-3">Price: Tk ${product.price.toFixed(2)}</p>
                    <div class="star-rating text-lg">
                        ${generateStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart-btn inline-block px-4 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition-colors mt-4" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-image-src="${product.image}"> 
                        Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Helper function to generate star rating HTML
    function generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        return `${stars} (${rating.toFixed(1)})`;
    }


    // --- Event Delegation for Add to Cart Buttons ---
    const productGrid = document.getElementById('ice-cream-grid');
    if (productGrid) {
        productGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);
                const imageSrc = event.target.dataset.imageSrc;

                addItemToCart(name, price, imageSrc);
                showConfirmationModal();
            }
        });
    }

    // --- Initial render of products and search bar functionality ---
    renderProducts(iceCreamProducts);

    const searchInput = document.getElementById('ice-cream-search');
    const searchButton = document.getElementById('search-button');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            performSearch();
        });

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                performSearch();
            }
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = iceCreamProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }


    // Cart functionality
    // let cart = JSON.parse(sessionStorage.getItem('iceCreamCart')) || [];

    const cartCountSpan = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsUl = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const closeButtons = document.querySelectorAll('.close-button');
    const viewCartButton = document.getElementById('view-cart');
    const confirmationModal = document.getElementById('confirmation-modal');
    const goToCartButton = confirmationModal.querySelector('.go-to-cart-button');

    // Add item to cart function
    function addItemToCart(name, price, imageSrc) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, imageSrc, quantity: 1 });
        }
        saveCart();
    }

    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
        }
    }

    // Save cart to session storage
    function saveCart() {
        sessionStorage.setItem('iceCreamCart', JSON.stringify(cart));
        updateCartCount();
    }

    // Show confirmation modal
    function showConfirmationModal() {
        if (confirmationModal) {
            confirmationModal.classList.remove('hidden');
        }
    }

    // Hide modals when their specific close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentModal = button.closest('.modal');
            if (parentModal) {
                parentModal.classList.add('hidden');
            }
        });
    });

    // Go to cart button in confirmation modal
    if (goToCartButton) {
        goToCartButton.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // --- Employee Sector Login: This is the ONLY part that handles the login modal ---
    const employeeSectorLink = document.getElementById('employeeSectorLink');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const employeeIdInput = document.getElementById('employeeId');
    const passwordInput = document.getElementById('password');
    const loginCloseBtn = loginModal.querySelector('.close-btn');

    employeeSectorLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginModal.classList.remove('hidden');
    });

    // Close login modal with its close button
    loginCloseBtn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const employeeId = employeeIdInput.value;
        const password = passwordInput.value;

        if (employeeId === 'admin' && password === 'admin') {
            localStorage.setItem('isLoggedIn', 'true');
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'icecream-emp.html'; // Redirect to the ice cream employee panel
            }, 1000);
        } else {
            loginMessage.textContent = 'Invalid ID or password.';
            loginMessage.style.color = 'red';
        }
    });

    // Initial cart count update
    updateCartCount();

});