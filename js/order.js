document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem("customerCart")) || [];

    // 2. Render the Cart Items to the HTML
    function renderCart() {
        const container = document.getElementById("cakeCartItems");
        if (!container) return;

        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = '<p class="text-center text-muted mt-5">Your cart is empty. Time for some Mithai!</p>';
        } else {
            cart.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("col-12", "mb-3");
                div.innerHTML = `
                    <div class="card d-flex flex-row align-items-center p-3 shadow-sm border-0" style="border-radius: 15px;">
                        <div class="flex-grow-1">
                            <h5 class="mb-0 fw-bold" style="color: #E65100;">${item.name}</h5>
                            <p class="mb-0 text-muted">Tk ${item.price}</p>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-warning me-2 qtyBtn" data-id="${item.id}" data-change="-1">-</button>
                            <span class="fs-5 fw-bold me-2">${item.quantity || 1}</span>
                            <button class="btn btn-sm btn-outline-warning qtyBtn" data-id="${item.id}" data-change="1">+</button>
                        </div>
                        <div class="ms-4">
                            <span class="fs-5 fw-bold" style="color: #BF360C;">Tk ${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });

            // Re-attach listeners to the new buttons
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

    // 3. Update Item Quantity
    function updateQuantity(itemId, change) {
        const idx = cart.findIndex(i => i.id === itemId);
        if (idx > -1) {
            cart[idx].quantity = (cart[idx].quantity || 1) + change;

            // If quantity hits 0, remove it from cart
            if (cart[idx].quantity <= 0) {
                cart.splice(idx, 1);
            }

            localStorage.setItem("customerCart", JSON.stringify(cart));
            renderCart();
        }
    }

    // 4. Calculate Total Price
    function calculateTotal() {
        return cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0).toFixed(2);
    }

    // 5. Checkout Logic (Sending to Aiven via Backend)
    // NOTE: 'async' is added here to allow 'await' inside
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", async () => {
            if (cart.length === 0) {
                alert("Please add items to your cart first!");
                return;
            }

            const userString = localStorage.getItem("loggedInUser");

            if (userString) {
                const user = JSON.parse(userString);

                // Prepare the data for the backend
                const orderData = {
                    email: user.email,        // This was the source of your NULL error
                    name: user.full_name,
                    items: cart,
                    total: calculateTotal()
                };

                try {
                    // Send request to your server
                    const response = await fetch('http://localhost:3000/api/place-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert(`Shukriya! Order #${result.orderId} placed successfully.`);

                        // Clear cart after success
                        localStorage.removeItem("customerCart");
                        cart = [];

                        window.location.href = "index.html";
                    } else {
                        alert("Billing Error: " + (result.error || "Could not save order."));
                    }
                } catch (err) {
                    console.error("Fetch Error:", err);
                    alert("Could not connect to the server. Is your backend running?");
                }
            } else {
                // If not logged in, redirect to login
                alert("Please login to complete your purchase.");
                localStorage.setItem("checkoutPending", "true");
                window.location.href = "login.html";
            }
        });
    }

    // Initial Render
    renderCart();
});