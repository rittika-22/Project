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
            { "id": 1, "name": "Chocolate Fudge", "price": 500.00, "rating": 4.8, "image": "./images/chocolate-fudge.png" },
            { "id": 2, "name": "Mint Chocolate Chip", "price": 475.00, "rating": 4.5, "image": "./images/mint-chocolate-chip.png" },
            { "id": 3, "name": "Strawberry Delight", "price": 450.00, "rating": 4.2, "image": "./images/strawberry.png" },
            { "id": 4, "name": "Vanilla Bean", "price": 420.00, "rating": 4.0, "image": "./images/vanilla.png" },
            { "id": 5, "name": "Cookie Dough", "price": 520.00, "rating": 4.7, "image": "./images/cookie-dough.png" },
            { "id": 6, "name": "Pistachio Dream", "price": 550.00, "rating": 4.6, "image": "./images/pistachio.png" },
            { "id": 7, "name": "Butter Pecan", "price": 490.00, "rating": 4.3, "image": "./images/butter-pecan.png" },
            { "id": 8, "name": "Rocky Road", "price": 530.00, "rating": 4.4, "image": "./images/rocky-road.png" }
        ];
        console.log('Using default hardcoded ice cream data.');
    }
    // --- END OF NEW CODE ---


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

    // This part now ONLY handles adding items to the cart and showing the confirmation modal
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

    // Carousel functionality (existing from your original code)
    if (reviewsCarousel && prevReviewButton && nextReviewButton && reviewCards.length > 0) {
    // This entire function was the problem. You correctly commented it out.
    // function adjustButtonPositioning() {
    //    ... (code you commented out) ...
    // }

    // These event listeners were calling the problematic function. You correctly commented them out.
    // window.addEventListener('load', adjustButtonPositioning);
    // window.addEventListener('resize', adjustButtonPositioning);

    // This is the code that makes the carousel slide. I have uncommented it.
    const showReview = (index) => {
        reviewsCarousel.style.transform = `translateX(-${index * 100}%)`;
    };

    // These event listeners are what make the arrows clickable. I have uncommented them.
    prevReviewButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviewCards.length - 1;
        showReview(currentIndex);
    });

    nextReviewButton.addEventListener('click', () => {
        currentIndex = (currentIndex < reviewCards.length - 1) ? currentIndex + 1 : 0;
        showReview(currentIndex);
    });

    // This line ensures the carousel starts at the first review.
    showReview(currentIndex);
} else {
    console.warn("Reviews carousel elements not found. Carousel functionality might be disabled.");
}
});