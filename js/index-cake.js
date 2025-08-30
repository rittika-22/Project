document.addEventListener('DOMContentLoaded', () => {
  const shopPage = document.getElementById('cake-shop-page');
  const cartButton = document.getElementById('cart-button');
  const searchInput = document.getElementById('searchInput');
  const navbar = document.querySelector('.navbar-nav');

  const defaultItems = [
    { id: 1, name: "Chocolate Cake", price: 800.00, rating: 4.4, image: "./images/chocolate-cake.jpg" },
    { id: 2, name: "Red Velvet Cake", price: 950.00, rating: 4.7, image: "./images/red-velbat-kitkat-cake.jpg" },
    { id: 3, name: "Black Forest Cake", price: 1000.00, rating: 4.5, image: "./images/black-forest-cake.JPG" },
    { id: 4, name: "Chocolate Pastry", price: 350.00, rating: 3.9, image: "./images/choco-pastry.jpeg" },
    { id: 5, name: "Strawberry Shortcake", price: 900.00, rating: 4.8, image: "./images/strawberry.jpg" },
    { id: 6, name: "Fruit Tart", price: 600.00, rating: 4.3, image: "./images/fruit-tart.jpg" }
  ];

  let cart = JSON.parse(localStorage.getItem('cakeCart')) || [];

  // ------------------ Navbar Logout Button ------------------ //
  function updateNavbar() {
    const loggedIn = localStorage.getItem("loggedInUser");
    let logoutLi = document.getElementById('nav-logout');

    if (loggedIn) {
      if (!logoutLi) {
        logoutLi = document.createElement('li');
        logoutLi.id = 'nav-logout';
        logoutLi.classList.add('nav-item');
        logoutLi.innerHTML = `<a class="nav-link text-white fw-bold" href="#">Logout</a>`;
        navbar.appendChild(logoutLi);

        logoutLi.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem("loggedInUser");
          alert("Logged out successfully!");
          logoutLi.remove();
        });
      }
    } else if (logoutLi) {
      logoutLi.remove();
    }
  }

  // ------------------ Cart Helper Functions ------------------ //
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
  }

  function addToCart(itemId) {
    const idx = cart.findIndex(c => c.id === itemId);
    if (idx > -1) {
      cart[idx].quantity++;
    } else {
      const item = defaultItems.find(i => i.id === itemId);
      if (item) cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cakeCart', JSON.stringify(cart));
    updateCartCount();

    const btn = document.querySelector(`.order-btn[data-item-id="${itemId}"]`);
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 800);
  }

  function updateQuantity(itemId, change) {
    const idx = cart.findIndex(c => c.id === itemId);
    if (idx > -1) {
      cart[idx].quantity += change;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      localStorage.setItem('cakeCart', JSON.stringify(cart));
      updateCartCount();
      renderOrderPage();
    }
  }

  function calculateTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);
  }

  // ------------------ Login / Signup ------------------ //
  function renderLoginPage(afterLoginCallback) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container mt-5 login-box">
        <h2 class="text-center mb-4">🔑 Customer Login</h2>
        <form id="loginForm" class="p-4 shadow rounded bg-white">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" id="loginEmail" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" id="loginPassword" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-success w-100 mb-3">Login</button>
          <p class="text-center">Not registered? <a href="#" id="goSignup">Sign up here</a></p>
          <button id="backToShopBtn" class="btn btn-custom-mid-brown">Back to Shop</button>
        </form>
      </div>
    `;

    document.getElementById("loginForm").onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(u => u.email === email && u.password === pass);

      if (found) {
        localStorage.setItem("loggedInUser", JSON.stringify(found));
        updateNavbar();
        if (afterLoginCallback) afterLoginCallback();
      } else {
        alert("User not found or wrong password.");
      }
    };

    document.getElementById("goSignup").onclick = () => renderSignupPage(afterLoginCallback);
  }

  function renderSignupPage(afterSignupCallback) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container mt-5 login-box">
        <h2 class="text-center mb-4">📝 Customer Signup</h2>
        <form id="signupForm" class="p-4 shadow rounded bg-white">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" id="signupName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" id="signupEmail" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" id="signupPassword" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary w-100 mb-3">Sign Up</button>
          <p class="text-center">Already registered? <a href="#" id="goLogin">Login here</a></p>
        </form>
      </div>
    `;

    document.getElementById("signupForm").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const pass = document.getElementById("signupPassword").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.email === email)) {
        alert("User already exists! Please login.");
        renderLoginPage(afterSignupCallback);
        return;
      }

      users.push({ name, email, password: pass });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please log in.");
      renderLoginPage(afterSignupCallback);
    };

    document.getElementById("goLogin").onclick = () => renderLoginPage(afterSignupCallback);
  }

  // ------------------ Order Page ------------------ //
  function renderOrderPage() {
    shopPage.style.display = "none";

    let orderPage = document.getElementById('order-page');
    if (!orderPage) {
      orderPage = document.createElement('div');
      orderPage.id = "order-page";
      orderPage.classList.add("container", "mt-4");

      orderPage.innerHTML = `
        <nav class="bg-lightblue text-white display-2 p-4 d-flex justify-content-between align-items-center fw-bold">
          Your Order
          <div class="d-flex align-items-center">
            <span class="text-white me-3 fs-4">Total: Tk <span id="totalBill">0.00</span></span>
            <button id="backToShopBtn" class="btn btn-custom-mid-brown">Back to Shop</button>
          </div>
        </nav>
        <div class="row mt-4" id="cartItemsContainer"></div>
        <div class="text-center mt-5 mb-5">
          <button id="checkoutBtn" class="btn btn-success btn-lg">Checkout Order</button>
        </div>
      `;
      document.getElementById('app').appendChild(orderPage);
    }

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-muted mt-5">Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        cartItemsContainer.insertAdjacentHTML('beforeend', `
          <div class="col-12 mb-3">
            <div class="card order-page-card d-flex flex-row align-items-center p-3">
              <img src="${item.image}" class="img-fluid rounded me-3" style="width:80px;height:80px;object-fit:cover;">
              <div class="flex-grow-1">
                <h5 class="mb-0 card-title-custom fw-bold">${item.name}</h5>
                <p class="mb-0 text-muted">Tk ${item.price.toFixed(2)}</p>
              </div>
              <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary me-2 quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                <span class="fs-5 fw-bold me-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary quantity-btn" data-id="${item.id}" data-change="1">+</button>
              </div>
              <div class="ms-4">
                <span class="fs-5 fw-bold">Tk ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        `);
      });

      document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          updateQuantity(parseInt(btn.dataset.id), parseInt(btn.dataset.change));
        });
      });
    }

    document.getElementById('totalBill').textContent = calculateTotal();

    document.getElementById('backToShopBtn').onclick = () => {
      orderPage.remove();
      shopPage.style.display = "block";
    };

    document.getElementById('checkoutBtn').onclick = () => {
      if (cart.length === 0) return alert("Your cart is empty!");
      const loggedIn = localStorage.getItem("loggedInUser");
      if (loggedIn) confirmOrder();
      else renderLoginPage(confirmOrder);
    };
  }

  function confirmOrder() {
    alert("✅ Order confirmed! Thank you.");
    cart = [];
    localStorage.setItem("cakeCart", JSON.stringify(cart));
    updateCartCount();
    renderOrderPage(); // refresh order page after order
  }

  // ------------------ Event Listeners ------------------ //
  document.getElementById('itemCardsContainer').addEventListener('click', e => {
    if (e.target.classList.contains('order-btn')) {
      addToCart(parseInt(e.target.dataset.itemId));
    }
  });

  searchInput.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.dessert-card').forEach(card => {
      card.style.display = card.dataset.name.toLowerCase().includes(term) ? "block" : "none";
    });
  });

  cartButton.addEventListener('click', () => renderOrderPage());

  // ------------------ Initial Setup ------------------ //
  updateCartCount();
  updateNavbar();
});
