document.addEventListener('DOMContentLoaded', async () => {
    const waffleGrid = document.getElementById('waffle-grid');
    const searchInput = document.getElementById('waffle-search');
    const searchButton = document.getElementById('search-button');
    
    let waffleProducts = []; // ডাটাবেস থেকে আসা ডেটা এখানে থাকবে

    // --- ১. ডাটাবেস থেকে ডেটা লোড করার ফাংশন ---
    async function fetchWaffleData() {
        try {
            const response = await fetch('http://localhost:3000/api/waffles');
            waffleProducts = await response.json();
            renderWaffleProducts(waffleProducts);
        } catch (err) {
            console.error('Error fetching waffles:', err);
            if (waffleGrid) {
                waffleGrid.innerHTML = '<p class="text-center text-red-500 col-span-full">Failed to load waffles from database.</p>';
            }
        }
    }

    // --- ২. ওয়াফল কার্ড রেন্ডার করার ফাংশন ---
    function renderWaffleProducts(products) {
        if (!waffleGrid) return;

        waffleGrid.innerHTML = '';

        products.forEach(product => {
            const starRatingHtml = Array(5).fill().map((_, i) =>
                i < Math.floor(product.rating) ? '<i class="fas fa-star"></i>' :
                (i < product.rating && i === Math.floor(product.rating)) ? '<i class="fas fa-star-half-alt"></i>' :
                '<i class="far fa-star"></i>'
            ).join('');

            // ইমেজ পাথ ঠিক করা (যদি images/ ফোল্ডারে থাকে)
            const imagePath = product.image.startsWith('http') || product.image.startsWith('./') || product.image.startsWith('images/') 
                                ? product.image 
                                : `images/${product.image}`;

            const productCard = document.createElement('div');
            productCard.className = "waffle-card bg-white rounded-xl shadow-md overflow-hidden border border-amber-200 text-center";
            productCard.innerHTML = `
                <img src="${imagePath}" onerror="this.onerror=null;this.src='https://placehold.co/400x300?text=Waffle';" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-amber-900 mb-2">${product.name}</h3>
                    <p class="text-gray-700 text-md font-medium mb-3">Price: Tk ${parseFloat(product.price).toFixed(2)}</p>
                    <div class="star-rating text-lg">
                        ${starRatingHtml} (${parseFloat(product.rating).toFixed(1)})
                    </div>
                    <button class="add-to-cart-btn inline-block px-4 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition-colors mt-4"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image-src="${imagePath}">
                        Add to Cart
                    </button>
                </div>
            `;
            waffleGrid.appendChild(productCard);
        });
    }

    // --- ৩. সার্চ ফাংশন ---
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = waffleProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderWaffleProducts(filteredProducts);
    }

    // --- ৪. কার্ট লজিক (LocalStorage-এ সেভ হবে) ---
    let cart = JSON.parse(localStorage.getItem('customerCart')) || [];
    const confirmationModal = document.getElementById('confirmation-modal');

    function addItemToCart(id, name, price, imageSrc) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, imageSrc, quantity: 1 });
        }
        localStorage.setItem('customerCart', JSON.stringify(cart));
    }

    // --- ৫. ইভেন্ট লিসেনারস ---
    if (waffleGrid) {
        waffleGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const btn = event.target;
                addItemToCart(
                    parseInt(btn.dataset.id),
                    btn.dataset.name,
                    parseFloat(btn.dataset.price),
                    btn.dataset.imageSrc
                );
                if (confirmationModal) confirmationModal.classList.remove('hidden');
            }
        });
    }

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', (e) => { e.preventDefault(); performSearch(); });
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
    }

    // ক্লোজ বাটন এবং কার্ট নেভিগেশন
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal')?.classList.add('hidden'));
    });

    const goToCartButton = document.querySelector('.go-to-cart-button');
    if (goToCartButton) {
        goToCartButton.addEventListener('click', () => window.location.href = 'order.html');
    }

    // লগইন ফর্ম লজিক
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const employeeId = document.getElementById('employeeId').value;
            const password = document.getElementById('password').value;
            const loginMessage = document.getElementById('loginMessage');

            if (employeeId === 'admin' && password === 'admin') {
                localStorage.setItem('isWaffleLoggedIn', 'true');
                window.location.href = 'waffles-emp.html';
            } else {
                loginMessage.textContent = 'Invalid ID or password.';
                loginMessage.style.color = 'red';
            }
        });
    }

    // সবার শেষে ডেটা লোড শুরু করা
    fetchWaffleData();
});
