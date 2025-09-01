document.addEventListener("DOMContentLoaded", () => {
  let cakeItems = [
    { id: 1, name: "Chocolate Cake", price: 800, rating: 4.4, image: "./images/chocolate-cake.jpg", category: "cake" },
    { id: 2, name: "Red Velvet Cake", price: 950, rating: 4.7, image: "./images/red-velbat-kitkat-cake.jpg", category: "cake" },
    { id: 3, name: "Black Forest Cake", price: 1000, rating: 4.5, image: "./images/black-forest-cake.JPG", category: "cake" },
    { id: 4, name: "Chocolate Pastry", price: 350, rating: 3.9, image: "./images/choco-pastry.jpeg", category: "pastry" },
    { id: 5, name: "Strawberry Shortcake", price: 900, rating: 4.8, image: "./images/strawberry.jpg", category: "pastry" },
    { id: 6, name: "Fruit Tart", price: 600, rating: 4.3, image: "./images/fruit-tart.jpg", category: "pastry" }
  ];

  if (localStorage.getItem("customerCakeItems")) {
    cakeItems = JSON.parse(localStorage.getItem("customerCakeItems"));
  }

  let cart = JSON.parse(localStorage.getItem("customerCart")) || [];

  function updateCartCount() {
    const count = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    document.getElementById("cakeCartCount").textContent = count;
  }

  function addToCart(itemId, btn) {
    const item = cakeItems.find(i => i.id === itemId);
    if (!item) return;
    const existing = cart.find(c => c.id === itemId);
    if (existing) existing.quantity++;
    else cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    localStorage.setItem("customerCart", JSON.stringify(cart));
    updateCartCount();
    btn.textContent = "Added!";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = "Order"; btn.disabled = false; }, 800);
  }

  function getStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars += '<i class="fas fa-star"></i>';
      else if (rating >= i - 0.5) stars += '<i class="fas fa-star-half-alt"></i>';
      else stars += '<i class="far fa-star"></i>';
    }
    return `${stars} (${rating.toFixed(1)})`;
  }

  function renderCakes() {
    const cakeContainer = document.getElementById("cake-section-cards");
    const pastryContainer = document.getElementById("pastry-section-cards");
    cakeContainer.innerHTML = "";
    pastryContainer.innerHTML = "";

    cakeItems.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 col-lg-3 mb-4 dessert-card";
      col.dataset.name = item.name.toLowerCase();
      col.innerHTML = `
        <div class="card h-100 item-card">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title card-title-custom fw-bold">${item.name}</h5>
            <p class="text-muted">Price: ${item.price} Tk</p>
            <div class="star-rating">${getStars(item.rating)}</div>
            <button class="btn btn-custom-mid-brown mt-auto cakeOrderBtn" data-item-id="${item.id}">Order</button>
          </div>
        </div>
      `;
      if (item.category === "pastry") pastryContainer.appendChild(col);
      else cakeContainer.appendChild(col);
    });

    document.querySelectorAll(".cakeOrderBtn").forEach(btn => {
      btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.itemId), btn));
    });
  }

  document.getElementById("cakeSearchInput").addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(".dessert-card").forEach(card => {
      const name = card.dataset.name;
      card.style.display = name.includes(query) ? "block" : "none";
    });
  });

  document.getElementById("cakeCartButton").addEventListener("click", () => {
    window.location.href = "order.html";
  });

  renderCakes();
  updateCartCount();
});
