document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if the link is for a section on the page
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Carousel for Client Reviews
const reviewsCarousel = document.getElementById('reviews-carousel');
const prevReviewBtn = document.getElementById('prev-review');
const nextReviewBtn = document.getElementById('next-review');
const reviewDotsContainer = document.getElementById('review-dots');
const reviewCards = Array.from(reviewsCarousel.querySelectorAll('.review-card-item'));
const totalReviewCards = reviewCards.length;
let currentReviewIndex = 0;
let cardsPerView = 1;

// Function to update cards per view based on screen size
const updateCardsPerView = () => {
    if (window.innerWidth >= 1280) { // xl breakpoint
        cardsPerView = 4;
    } else if (window.innerWidth >= 1024) { // lg breakpoint
        cardsPerView = 3;
    } else if (window.innerWidth >= 640) { // sm breakpoint
        cardsPerView = 2;
    } else {
        cardsPerView = 1;
    }
};

const renderDots = () => {
    // Clear existing dots
    reviewDotsContainer.innerHTML = '';
    const numDots = Math.ceil(totalReviewCards / cardsPerView);
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('span');
        dot.classList.add('w-3', 'h-3', 'bg-gray-400', 'rounded-full', 'cursor-pointer', 'transition-colors', 'duration-300');
        dot.dataset.index = i * cardsPerView;
        dot.addEventListener('click', () => {
            currentReviewIndex = parseInt(dot.dataset.index);
            updateCarousel();
            updateDots();
        });
        reviewDotsContainer.appendChild(dot);
    }
};

const updateDots = () => {
    const dots = reviewDotsContainer.querySelectorAll('span');
    dots.forEach(dot => {
        dot.classList.remove('bg-amber-800');
        dot.classList.add('bg-gray-400');
    });
    let activeDotIndex = Math.floor(currentReviewIndex / cardsPerView);
    if (dots[activeDotIndex]) {
        dots[activeDotIndex].classList.remove('bg-gray-400');
        dots[activeDotIndex].classList.add('bg-amber-800');
    }
};

const updateCarousel = () => {
    const cardWidth = reviewCards[0].offsetWidth;
    const offset = -currentReviewIndex * cardWidth;
    reviewsCarousel.style.transform = `translateX(${offset}px)`;
    updateDots();
};

const showNextReview = () => {
    currentReviewIndex += cardsPerView;
    if (currentReviewIndex >= totalReviewCards) {
        currentReviewIndex = 0;
    }
    updateCarousel();
};

const showPrevReview = () => {
    currentReviewIndex -= cardsPerView;
    if (currentReviewIndex < 0) {
        currentReviewIndex = Math.floor((totalReviewCards - 1) / cardsPerView) * cardsPerView;
        if (currentReviewIndex < 0) currentReviewIndex = 0;
    }
    updateCarousel();
};

const init = () => {
    updateCardsPerView();
    updateCarousel();
    renderDots();
    window.addEventListener('resize', () => {
        updateCardsPerView();
        updateCarousel();
        renderDots();
    });
    nextReviewBtn.addEventListener('click', showNextReview);
    prevReviewBtn.addEventListener('click', showPrevReview);
};

window.onload = init;


// Modal Logic
const loginModal = document.getElementById('login-modal');
const modalContent = loginModal.querySelector('.modal-content');
const loginForm = document.getElementById('login-form');
const messageBox = document.getElementById('message-box');

function showLoginModal() {
    loginModal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function hideLoginModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        loginModal.classList.add('hidden');
        // Reset form and message box
        loginForm.reset();
        messageBox.classList.add('hidden');
        messageBox.textContent = '';
    }, 300);
}

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;

    const correctId = "emp123";
    const correctPassword = "password123";

    if (employeeId === correctId && password === correctPassword) {
        messageBox.classList.remove('bg-red-100', 'text-red-800', 'hidden');
        messageBox.classList.add('bg-green-100', 'text-green-800');
        messageBox.textContent = 'Login successful! Redirecting...';

        setTimeout(() => {
            window.location.href = 'sweet-card-emp.html';
        }, 1500);
    } else {
        messageBox.classList.remove('bg-green-100', 'text-green-800', 'hidden');
        messageBox.classList.add('bg-red-100', 'text-red-800');
        messageBox.textContent = 'Invalid Employee ID or password. Please try again.';
    }
});
// Click outside the modal to close it
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        hideLoginModal();
    }
});