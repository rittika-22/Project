document.addEventListener('DOMContentLoaded', () => {

    // --- Employee Panel Integration (NEW CODE) ---
    // Check localStorage for employee-updated data.
    const updatedItems = localStorage.getItem('customerIceCreamItems');

    let iceCreamProducts;

    if (updatedItems) {
        // Use the data saved by the employee panel
        iceCreamProducts = JSON.parse(updatedItems);
        console.log('Using employee-updated ice cream data.');
    } else {
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
            productCard.className = 'icecream-card bg-white rounded-xl shadow-md overflow-hidden border border-amber-200 text-center';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${product.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-3">Price: Tk ${product.price.toFixed(2)}</p>
                    <p class="text-gray-600 text-sm mb-3">${product.description || 'A delicious and refreshing ice cream flavor.'}</p>
                    <div class="star-rating text-lg">
                        ${generateStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart inline-block px-4 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition-colors mt-4" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-image-src="${product.image}"> 
                        Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        // Re-attach event listeners to the new buttons
        attachAddToCartListeners();
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

    // --- NEW: Function to attach add-to-cart listeners ---
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

    // --- NEW: Initial render of products and search bar functionality ---
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
    let cart = JSON.parse(sessionStorage.getItem('iceCreamCart')) || [];

    const cartCountSpan = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsUl = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const closeButtons = document.querySelectorAll('.close-button');
    const viewCartButton = document.getElementById('view-cart');
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
        sessionStorage.setItem('iceCreamCart', JSON.stringify(cart));
        updateCartCount();
    }

    // Show confirmation modal
    function showConfirmationModal() {
        confirmationModal.classList.remove('hidden');
        confirmationModal.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
        confirmationModal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
    }

    // Hide modals when their specific close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentModal = button.closest('.modal');
            if (parentModal) {
                parentModal.classList.add('hidden');
                parentModal.querySelector('.modal-content').classList.remove('scale-100', 'opacity-100');
                parentModal.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
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

    // Carousel functionality
    const reviewsCarousel = document.getElementById('reviews-carousel');
    const prevReviewButton = document.getElementById('prev-review');
    const nextReviewButton = document.getElementById('next-review');
    const reviewCards = reviewsCarousel ? reviewsCarousel.querySelectorAll('.review-card-item') : [];
    let currentIndex = 0;

    if (reviewsCarousel && prevReviewButton && nextReviewButton && reviewCards.length > 0) {
        const showReview = (index) => {
            reviewsCarousel.style.transform = `translateX(-${index * 100}%)`;
        };

        prevReviewButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviewCards.length - 1;
            showReview(currentIndex);
        });

        nextReviewButton.addEventListener('click', () => {
            currentIndex = (currentIndex < reviewCards.length - 1) ? currentIndex + 1 : 0;
            showReview(currentIndex);
        });

        showReview(currentIndex);
    } else {
        console.warn("Reviews carousel elements not found. Carousel functionality might be disabled.");
    }
});