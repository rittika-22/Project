document.addEventListener('DOMContentLoaded', () => {
    // --- Employee Panel Integration - Waffle Products ---
    // Check localStorage for employee-updated waffle data.
    const updatedWaffleItems = localStorage.getItem('customerWaffleItems');

    let waffleProducts;

    if (updatedWaffleItems) {
        // Use the data saved by the employee panel
        waffleProducts = JSON.parse(updatedWaffleItems);
        console.log('Using employee-updated waffle data.');
    } else {
        // Fallback to a default hardcoded list if no employee updates exist
        waffleProducts = [
            { "id": 1, "name": "Classic Waffle", "price": 350.00, "rating": 4.7, "image": "./images/classicwaffle.jpg" },
            { "id": 2, "name": "Chocolate Chip Waffle", "price": 400.00, "rating": 4.8, "image": "./images/waffle-chocolate.jpg" },
            { "id": 3, "name": "Blueberry Waffle", "price": 380.00, "rating": 4.5, "image": "./images/waffle-blueberry.jpg" },
            { "id": 4, "name": "Strawberry Waffle", "price": 390.00, "rating": 4.6, "image": "./images/waffle-strawberry.jpg" },
            { "id": 5, "name": "Red Velvet Waffle", "price": 420.00, "rating": 4.9, "image": "./images/waffle-redvelvet.jpg" },
            { "id": 6, "name": "Cinnamon Roll Waffle", "price": 410.00, "rating": 4.7, "image": "./images/waffle-cinnamon.jpg" }
        ];
        console.log('Using default hardcoded waffle data.');
    }
    // --- END OF EMPLOYEE CODE ---

    const waffleProductsContainer = document.getElementById('waffle-products-container');
    const searchInput = document.getElementById('waffle-search');
    const searchButton = document.getElementById('search-button');

    // Function to render waffle products
    function renderWaffleProducts(products) {
        if (!waffleProductsContainer) return;

        waffleProductsContainer.innerHTML = ''; // Clear existing products

        products.forEach(product => {
            const starRatingHtml = Array(5).fill().map((_, i) => 
                i < Math.floor(product.rating) ? '<i class="fas fa-star"></i>' : 
                (i < product.rating && i === Math.floor(product.rating)) ? '<i class="fas fa-star-half-alt"></i>' : 
                '<i class="far fa-star"></i>'
            ).join('');

            const productCard = `
                <div class="waffle-card bg-white rounded-xl shadow-md overflow-hidden border border-amber-200 text-center">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-amber-900 mb-2">${product.name}</h3>
                        <p class="text-gray-700 text-md font-medium mb-3">Price: Tk ${product.price.toFixed(2)}</p>
                        <div class="star-rating text-lg">
                            ${starRatingHtml} (${product.rating.toFixed(1)})
                        </div>
                        <button class="add-to-cart inline-block px-4 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition-colors mt-4" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-image-src="${product.image}"> 
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            waffleProductsContainer.innerHTML += productCard;
        });

        // Re-attach event listeners for 'Add to Cart' buttons after rendering
        attachAddToCartListeners();
    }

    // --- NEW: Function to handle search ---
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = waffleProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderWaffleProducts(filteredProducts);
    }
    
    // --- NEW: Add event listeners for search ---
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                performSearch();
            }
        });
    }

    // Cart functionality
    let cart = JSON.parse(sessionStorage.getItem('waffleCart')) || []; // Changed to 'waffleCart'

    const cartCountSpan = document.getElementById('cart-count');
    const confirmationModal = document.getElementById('confirmation-modal');
    const goToCartButton = confirmationModal.querySelector('.go-to-cart-button');

    // Login Modal Elements
    const employeeSectorLink = document.getElementById('employeeSectorLink');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const employeeIdInput = document.getElementById('employeeId');
    const passwordInput = document.getElementById('password');
    const loginCloseBtn = loginModal.querySelector('.close-btn');

    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    // Save cart to session storage
    function saveCart() {
        sessionStorage.setItem('waffleCart', JSON.stringify(cart)); // Changed to 'waffleCart'
        updateCartCount();
    }

    // Attach 'Add to Cart' event listeners
    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);
                const imageSrc = event.target.dataset.imageSrc;

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ name, price, imageSrc, quantity: 1 });
                }
                saveCart();
                showConfirmationModal();
            });
        });
    }

    // Show confirmation modal
    function showConfirmationModal() {
        confirmationModal.classList.remove('hidden');
        confirmationModal.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
        confirmationModal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
    }

    // Hide modals when their specific close button is clicked
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            const parentModal = button.closest('.modal');
            if (parentModal) {
                parentModal.classList.add('hidden');
                parentModal.querySelector('.modal-content').classList.remove('scale-100', 'opacity-100');
                parentModal.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
            }
        });
    });
    // For the login modal's specific close button
    loginCloseBtn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        loginModal.querySelector('.modal-content').classList.remove('scale-100', 'opacity-100');
        loginModal.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
    });


    // Go to cart button in confirmation modal
    if (goToCartButton) {
        goToCartButton.addEventListener('click', () => {
            window.location.href = 'waffles-cart.html'; // Redirect to waffles-cart.html
        });
    }

    // --- Employee Sector Login: This is the ONLY part that handles the login modal ---
    employeeSectorLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginModal.classList.remove('hidden');
        loginModal.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
        loginModal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const employeeId = employeeIdInput.value;
        const password = passwordInput.value;

        if (employeeId === 'admin' && password === 'admin') {
            localStorage.setItem('isWaffleLoggedIn', 'true'); // Changed for waffles
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'waffles-emp.html'; // Redirect to the waffle employee panel
            }, 1000);
        } else {
            loginMessage.textContent = 'Invalid ID or password.';
            loginMessage.style.color = 'red';
        }
    });

    // Initial cart count update and product render
    updateCartCount();
    renderWaffleProducts(waffleProducts); // Pass the full list to render on initial load

    // Carousel functionality (copied and fixed from ice cream)
    const reviewsCarousel = document.getElementById('reviews-carousel');
    const prevReviewButton = document.getElementById('prev-review');
    const nextReviewButton = document.getElementById('next-review');
    const reviewCards = document.querySelectorAll('.review-card-item');
    let currentIndex = 0;

    if (reviewsCarousel && prevReviewButton && nextReviewButton && reviewCards.length > 0) {
        const showReview = (index) => {
            // Adjust for multiple items visible at once (e.g., 3 cards)
            const containerWidth = reviewsCarousel.closest('.overflow-hidden').offsetWidth;
            const cardWidth = containerWidth / 3; // Assuming 3 cards are visible at a time
            reviewsCarousel.style.transform = `translateX(-${index * cardWidth}px)`;
        };

        prevReviewButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviewCards.length - 1;
            showReview(currentIndex);
        });

        nextReviewButton.addEventListener('click', () => {
            currentIndex = (currentIndex < reviewCards.length - 1) ? currentIndex + 1 : 0;
            showReview(currentIndex);
        });

        // Initialize carousel display
        showReview(currentIndex);

        // Adjust carousel on resize to maintain correct positioning
        window.addEventListener('resize', () => {
            showReview(currentIndex);
        });

    } else {
        console.warn("Reviews carousel elements not found. Carousel functionality might be disabled.");
    }
});
