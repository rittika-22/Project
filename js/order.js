document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cakeCart")) || [];

  function renderCart() {
    const container = document.getElementById("cakeCartItems");
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = '<p class="text-center text-muted mt-5">Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("col-12", "mb-3");
        div.innerHTML = `
          <div class="card d-flex flex-row align-items-center p-3">
            <div class="flex-grow-1">
              <h5 class="mb-0 fw-bold">${item.name}</h5>
              <p class="mb-0 text-muted">Tk ${item.price}</p>
            </div>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-2 qtyBtn" data-id="${item.id}" data-change="-1">-</button>
              <span class="fs-5 fw-bold me-2">${item.quantity || 1}</span>
              <button class="btn btn-sm btn-outline-secondary qtyBtn" data-id="${item.id}" data-change="1">+</button>
            </div>
            <div class="ms-4">
              <span class="fs-5 fw-bold">Tk ${(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          </div>
        `;
        container.appendChild(div);
      });

      document.querySelectorAll(".qtyBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.dataset.id);
          const change = parseInt(btn.dataset.change);
          updateQuantity(id, change);
        });
      });
    }

    document.getElementById("totalBill").textContent = calculateTotal();
  }

  function updateQuantity(itemId, change) {
    const idx = cart.findIndex(i => i.id === itemId);
    if (idx > -1) {
      cart[idx].quantity = (cart[idx].quantity || 1) + change;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      localStorage.setItem("cakeCart", JSON.stringify(cart));
      renderCart();
    }
  }

  function calculateTotal() {
    return cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0).toFixed(2);
  }

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    const loggedIn = localStorage.getItem("loggedInUser");
    if (loggedIn) {
      alert("Order confirmed! Thank you.");
      cart = [];
      localStorage.setItem("cakeCart", JSON.stringify(cart));
      window.location.href = "cake-card.html"; // back to shop
    } else {
      localStorage.setItem("checkoutPending", "true");
      window.location.href = "login.html";
    }
  });

  renderCart();
});
