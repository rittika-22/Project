document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    try {
        const storedCart = localStorage.getItem('customerCart'); 
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error("Failed to parse cart data from localStorage", e);
    }

    let iceCreamProducts = []; 
    const API_URL = 'http://localhost:3000/api/icecreams';

    // --- ডাটাবেস থেকে আইসক্রিম ডেটা নিয়ে আসা ---
    async function fetchIceCreamProducts() {
        try {
            const response = await fetch(API_URL);
            iceCreamProducts = await response.json();
            renderProducts(iceCreamProducts);
        } catch (err) {
            console.error('Error fetching ice creams:', err);
            const productGrid = document.getElementById('ice-cream-grid');
            if (productGrid) {
                productGrid.innerHTML = '<p class="text-danger text-center w-full">Failed to load ice creams from database.</p>';
            }
        }
    }

    // --- প্রোডাক্ট কার্ড রেন্ডার করা ---
    function renderProducts(products) {
        const productGrid = document.getElementById('ice-cream-grid');
        if (!productGrid) return;

        productGrid.innerHTML = ''; 

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'icecream-card d-flex flex-column justify-content-center align-items-center bg-white rounded shadow-md overflow-hidden card-custom-border text-center h-full';
            
            // ইমেজের পাথ চেক করা
            const imagePath = product.image.startsWith('http') || product.image.startsWith('./') 
                              ? product.image 
                              : `./images/${product.image}`;

            productCard.innerHTML = `
                <img src="${imagePath}" alt="${product.name}" class="w-full h-40 object-cover" onerror="this.src='https://placehold.co/400x250?text=Ice+Cream';">
                <div class="p-3">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${product.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-3">Price: Tk ${parseFloat(product.price).toFixed(2)}</p>
                    <div class="star-rating text-lg">
                        ${generateStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart-btn inline-block px-4 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition-colors mt-4" 
                                 data-name="${product.name}" 
                                 data-price="${product.price}" 
                                 data-image-src="${imagePath}"> 
                        Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // স্টার রেটিং জেনারেটর
    function generateStarRating(rating) {
        let stars = '';
        const numericRating = parseFloat(rating);
        const fullStars = Math.floor(numericRating);
        const hasHalfStar = numericRating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        const emptyStars = 5 - Math.ceil(numericRating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-warning"></i>';
        }
        return `${stars} (${numericRating.toFixed(1)})`;
    }

    // কার্ডে ক্লিক করে কার্টে অ্যাড করা
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

    // সার্চ ফাংশনালিটি
    function performSearch() {
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = iceCreamProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }

    const searchInput = document.getElementById('ice-cream-search');
    const searchButton = document.getElementById('search-button');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', (e) => { e.preventDefault(); performSearch(); });
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(); } });
    }

    // --- কার্ট ফাংশনালিটি ---
    const cartCountSpan = document.getElementById('cart-count');
    const confirmationModal = document.getElementById('confirmation-modal');
    const goToCartButton = confirmationModal?.querySelector('.go-to-cart-button');

    function addItemToCart(name, price, imageSrc) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, imageSrc, quantity: 1 });
        }
        saveCart();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) cartCountSpan.textContent = totalItems;
    }

    function saveCart() {
        localStorage.setItem('customerCart', JSON.stringify(cart));
        updateCartCount();
    }

    function showConfirmationModal() {
        if (confirmationModal) confirmationModal.classList.remove('hidden');
    }

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal')?.classList.add('hidden');
        });
    });

    if (goToCartButton) {
        goToCartButton.addEventListener('click', () => { window.location.href = 'order.html'; });
    }

    // --- এমপ্লয়ী সেক্টর লগইন (নিরাপদভাবে চেক করা হয়েছে) ---
    const employeeSectorLink = document.getElementById('employeeSectorLink');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');

    if (employeeSectorLink && loginModal) {
        employeeSectorLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('employeeId')?.value;
            const pass = document.getElementById('password')?.value;

            if (id === 'admin' && pass === 'admin') {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'icecream-emp.html';
            } else {
                const msg = document.getElementById('loginMessage');
                if (msg) msg.textContent = 'Invalid ID or password.';
            }
        });
    }

    // শুরুতে ডেটা লোড করা
    fetchIceCreamProducts();
    updateCartCount();
});