document.addEventListener("DOMContentLoaded", () => {
    // 1. Helper: Hash password before sending to server
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 2. UI: Update Login/Logout button appearance
    function updateAuthButton() {
        const userAuthBtn = document.getElementById("userAuthBtn");
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (userAuthBtn) {
            if (loggedInUser) {
                const user = JSON.parse(loggedInUser);
                userAuthBtn.textContent = `Logout (${user.full_name})`;
                userAuthBtn.href = "#";
                userAuthBtn.onclick = handleLogout;
            } else {
                userAuthBtn.textContent = "Login";
                userAuthBtn.href = "login.html";
                userAuthBtn.onclick = null;
            }
        }
    }

    // 3. Logic: Handle Logout
    function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.href = "index.html";
    }

    // 4. UI: Feedback Message Box
    function showMessageBox(message, isError = true) {
        const messageBox = document.getElementById("message-box");
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `mb-4 p-3 rounded text-center ${isError ? 'bg-danger text-white' : 'bg-success text-white'}`;
            messageBox.style.display = "block";
        } else {
            alert(message);
        }
    }

    // Initialize UI
    updateAuthButton();

    // --- 5. LOGIN FORM LOGIC ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const pass = document.getElementById("loginPassword").value;

            // Hash locally so we send the hash over the network
            const passHash = await hashPassword(pass);

            try {
                const response = await fetch('http://localhost:3000/api/customer/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: passHash })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem("loggedInUser", JSON.stringify(result.user));
                    window.location.href = "order.html"; // Redirect to ordering page
                } else {
                    showMessageBox(result.error || "Login failed");
                }
            } catch (err) {
                showMessageBox("Server is offline. Please check your backend.");
            }
        };
    }

    // --- 6. SIGNUP FORM LOGIC ---
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const pass = document.getElementById("signupPassword").value;
            const confirm = document.getElementById("signupConfirm").value;

            if (pass.length < 6) return showMessageBox("Password too short!");
            if (pass !== confirm) return showMessageBox("Passwords do not match!");

            const passHash = await hashPassword(pass);

            try {
                const response = await fetch('http://localhost:3000/api/customer/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name: name, email, password: passHash })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Account created! Please login.");
                    window.location.href = "login.html";
                } else {
                    showMessageBox(result.error || "Signup failed");
                }
            } catch (err) {
                showMessageBox("Connection error.");
            }
        };
    }
});