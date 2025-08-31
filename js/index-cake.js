// Load existing cart from localStorage
let cart = JSON.parse(localStorage.getItem("cakeCart")) || [];
const otherCartItems = JSON.parse(localStorage.getItem("cart")) || [];

// Use the spread operator to push all items from otherCartItems into the cart array
cart.push(...otherCartItems);
// Update cart count badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById("cakeCartCount").textContent = count;
}

// Add item to cart
document.querySelectorAll(".cakeOrderBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const itemId = parseInt(btn.dataset.itemId);
    const itemName = btn.closest(".dessert-card").querySelector(".card-title").textContent;
    const priceText = btn.closest(".card-body").querySelector(".card-text").textContent;
    const price = parseInt(priceText.replace(/\D/g, ''));

    const existing = cart.find(c => c.id === itemId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id: itemId, name: itemName, price: price, quantity: 1 });
    }

    localStorage.setItem("cakeCart", JSON.stringify(cart));
    updateCartCount();

    btn.textContent = "Added!";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Order";
      btn.disabled = false;
    }, 800);
  });
});

// Cart button click redirects to order.html
document.getElementById("cakeCartButton").addEventListener("click", () => {
  window.location.href = "order.html";
});

// Search functionality
document.getElementById("cakeSearchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".dessert-card").forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
  });
});

// Initialize
updateCartCount();
