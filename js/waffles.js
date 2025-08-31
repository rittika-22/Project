document.addEventListener('DOMContentLoaded', () => {
    // --- Employee Panel Integration - Waffle Products ---
    const updatedWaffleItems = localStorage.getItem('customerWaffleItems');
    let waffleProducts;

    if (updatedWaffleItems) {
        waffleProducts = JSON.parse(updatedWaffleItems);
        console.log('Using employee-updated waffle data.');
    } else {
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
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);
                const imageSrc = event.target.dataset.imageSrc;

                addItemToCart(name, price, imageSrc);
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

    let cart = JSON.parse(sessionStorage.getItem('waffleCart')) || [];
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

    function addItemToCart(name, price, imageSrc) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, imageSrc, quantity: 1 });
        }
        saveCart();
    }

    function saveCart() {
        sessionStorage.setItem('waffleCart', JSON.stringify(cart));
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
            window.location.href = 'waffles-cart.html';
        });
    }

    employeeSectorLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginModal.classList.remove('hidden');
    });

    loginCloseBtn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

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
