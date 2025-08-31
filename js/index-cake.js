// index-cake.js (updated with separate order page)
document.addEventListener('DOMContentLoaded', () => {
  const shopPage = document.getElementById('cakeShopPage');
  const cartButton = document.getElementById('cakeCartButton');
  const searchInput = document.getElementById('cakeSearchInput');
  const cakeItemsContainer = document.getElementById('cakeItemsContainer');

  // Default cake & pastry items
  const defaultItems = [
    { id: 1, name: "Black Forest Cake", price: 500, img: "images/blackforest.jpg" },
    { id: 2, name: "Red Velvet Cake", price: 700, img: "images/redvelvet.jpg" },
    { id: 3, name: "Chocolate Pastry", price: 120, img: "images/chocolatepastry.jpg" },
    { id: 4, name: "Vanilla Cupcake", price: 80, img: "images/vanillacupcake.jpg" }
  ];

  let cart = JSON.parse(localStorage.getItem("cakeCart")) || [];

  // Render items
  function renderItems(items) {
    cakeItemsContainer.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("cake-card");
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p>Price: ${item.price} BDT</p>
        <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
      `;
      cakeItemsContainer.appendChild(card);
    });

    // Add to cart button events
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const selected = defaultItems.find(i => i.id === id);
        cart.push(selected);
        localStorage.setItem("cakeCart", JSON.stringify(cart));
        alert(`${selected.name} added to cart!`);
      });
    });
  }

  // Initial render
  renderItems(defaultItems);

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = defaultItems.filter(item => item.name.toLowerCase().includes(query));
    renderItems(filtered);
  });

  // Redirect to order page on cart button click
  cartButton.addEventListener("click", () => {
    window.location.href = "order.html"; // separate order page
  });
});
