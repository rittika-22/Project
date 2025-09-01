document.addEventListener('DOMContentLoaded', () => {
    // --- Employee Panel Integration - Waffle Products ---
    const updatedWaffleItems = localStorage.getItem('customerWaffleItems');
    let waffleProducts;

    if (updatedWaffleItems) {
        waffleProducts = JSON.parse(updatedWaffleItems);
        console.log('Using employee-updated waffle data.');
    } else {
        // Added unique IDs for consistency with other products
        waffleProducts = [
            { "id": 1, "name": "Classic Waffle", "price": 350.00, "rating": 4.7, "image": "./images/classicwaffle.jpg" },
            { "id": 2, "name": "Chocolate Chip Waffle", "price": 400.00, "rating": 4.8, "image": "./images/waffle-chocolate.jpg" },
            { "id": 3, "name": "Blueberry Waffle", "price": 380.00, "rating": 4.5, "image": "./images/waffle-blueberry.jpg" },
            { "id": 4, "name": "Strawberry Waffle", "price": 390.00, "rating": 4.6, "image": "./images/waffle-strawberry.jpg" },
            { "id": 5, "name": "Red Velvet Waffle", "price": 420.00, "rating": 4.9, "image": "./images/waffle-redvelvet.jpg" },
            { "id": 6, "name": "Cinnamon Roll Waffle", "price": 410.00, "rating": 4.7, "image": "./images/waffle-cinnamon.jpg" },
            { "id": 7, "name": "Banana Nut Waffle", "price": 370.00, "rating": 4.5, "image": "./images/waffle-banana.jpg" },
            { "id": 8, "name": "Pumpkin Spice Waffle", "price": 380.00, "rating": 4.3, "image": "./images/waffle-pumpkin.webp" },
            { "id": 9, "name": "Lemon Berry Waffle", "price": 390.00, "rating": 4.6, "image": "./images/waffle-lemon.jpeg" },
            { "id": 10, "name": "Caramel Drizzle Waffle", "price": 400.00, "rating": 4.8, "image": "./images/waffle-caramel.jpeg" },
            { "id": 11, "name": "S'mores Waffle", "price": 430.00, "rating": 4.9, "image": "./images/waffle-smores.webp" },
            { "id": 12, "name": "Apple Pie Waffle", "price": 380.00, "rating": 4.5, "image": "./images/waffle-apple.jpg" }
        ];
        console.log('Using default hardcoded waffle data.');
    }

    const waffleGrid = document.getElementById('waffle-grid');
    const searchInput = document.getElementById('waffle-search');
    const searchButton = document.getElementById('search-button');

    function renderWaffleProducts(products) {
        if (!waffleGrid) {
            console.error('Waffle grid container not found.');
            return;
        }

        waffleGrid.innerHTML = '';

        products.forEach(product => {
            const starRatingHtml = Array(5).fill().map((_, i) =>
                i < Math.floor(product.rating) ? '<i class="fas fa-star"></i>' :
                (i < product.rating && i === Math.floor(product.rating)) ? '<i class="fas fa-star-half-alt"></i>' :
                '<i class="far fa-star"></i>'
            ).join('');

            const productCard = document.createElement('div');
            productCard.className = "waffle-card bg-white rounded-xl shadow-md overflow-hidden border border-amber-200 text-center";
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${product.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-3">Price: Tk ${product.price.toFixed(2)}</p>
                    <div class="star-rating text-lg">
                        ${starRatingHtml} (${product.rating.toFixed(1)})
                    </div>
                    <button class="add-to-cart-btn inline-block px-4 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition-colors mt-4"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image-src="${product.image}">
                        Add to Cart
                    </button>
                </div>
            `;
            waffleGrid.appendChild(productCard);
        });
    }

    if (waffleGrid) {
        waffleGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const id = parseInt(event.target.dataset.id);
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);
                const imageSrc = event.target.dataset.imageSrc;

                addItemToCart(id, name, price, imageSrc);
                showConfirmationModal();
            }
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = waffleProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderWaffleProducts(filteredProducts);
    }

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

    // Now uses the unified 'customerCart' key in localStorage
    let cart = JSON.parse(localStorage.getItem('customerCart')) || [];
    const confirmationModal = document.getElementById('confirmation-modal');
    const goToCartButton = confirmationModal.querySelector('.go-to-cart-button');
    const closeButtons = document.querySelectorAll('.close-button');

    const employeeSectorLink = document.getElementById('employeeSectorLink');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const employeeIdInput = document.getElementById('employeeId');
    const passwordInput = document.getElementById('password');
    const loginCloseBtn = loginModal.querySelector('.close-btn');

    // Function updated to use item id for consistency
    function addItemToCart(id, name, price, imageSrc) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, imageSrc, quantity: 1 });
        }
        saveCart();
    }

    // Now saves to the unified 'customerCart' in localStorage
    function saveCart() {
        localStorage.setItem('customerCart', JSON.stringify(cart));
    }

    function showConfirmationModal() {
        confirmationModal.classList.remove('hidden');
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentModal = button.closest('.modal');
            if (parentModal) {
                parentModal.classList.add('hidden');
            }
        });
    });

    if (goToCartButton) {
        goToCartButton.addEventListener('click', () => {
            window.location.href = 'order.html';
        });
    }

    // employeeSectorLink.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     loginModal.classList.remove('hidden');
    // });

    // loginCloseBtn.addEventListener('click', () => {
    //     loginModal.classList.add('hidden');
    // });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const employeeId = employeeIdInput.value;
        const password = passwordInput.value;

        if (employeeId === 'admin' && password === 'admin') {
            localStorage.setItem('isWaffleLoggedIn', 'true');
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'waffles-emp.html';
            }, 1000);
        } else {
            loginMessage.textContent = 'Invalid ID or password.';
            loginMessage.style.color = 'red';
        }
    });

    renderWaffleProducts(waffleProducts);
});
