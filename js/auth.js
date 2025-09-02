document.addEventListener("DOMContentLoaded", () => {
    // Placeholder for the hashPassword function.
    // This is needed to make the login form work.
    // For a real-world application, use a secure cryptographic library.
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Function to update the login/logout button based on user status
    function updateAuthButton() {
        const userAuthBtn = document.getElementById("userAuthBtn");
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (userAuthBtn) {
            if (loggedInUser) {
                userAuthBtn.textContent = "Logout";
                userAuthBtn.href = "#"; // Use a dummy href since we're handling the click
                userAuthBtn.addEventListener("click", handleLogout);
            } else {
                userAuthBtn.textContent = "Login";
                userAuthBtn.href = "login.html"; // Redirect to login page
                userAuthBtn.removeEventListener("click", handleLogout);
            }
        }
    }

    // New logout handler function
    function handleLogout(e) {
        e.preventDefault(); // Prevent the default link behavior
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out."); // Use a simple alert for now
        window.location.reload(); // Reload the page to update the UI
    }

    // Function to show a message box
    function showMessageBox(message) {
        const messageBox = document.getElementById("message-box");
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = "mb-4 p-3 rounded-lg text-center font-medium " +
                (message.includes("successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700");
            messageBox.style.display = "block";
        }
    }

    // Call the function on page load
    updateAuthButton();
    
    // LOGIN FORM
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const pass = document.getElementById("loginPassword").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const passHash = await hashPassword(pass);

            const found = users.find(u => u.email === email && u.password === passHash);

            if (found) {
                localStorage.setItem("loggedInUser", JSON.stringify(found));
                showMessageBox("Login successful!");
                window.location.href = "order.html"; // Redirect to home page
            } else {
                showMessageBox("Invalid email or password!");
            }
        };
    }

    // SIGNUP FORM
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const pass = document.getElementById("signupPassword").value;
            const confirm = document.getElementById("signupConfirm").value;

            if (pass.length < 6) {
                showMessageBox("Password must be at least 6 characters long!");
                return;
            }
            if (pass !== confirm) {
                showMessageBox("Passwords do not match!");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.find(u => u.email === email)) {
                showMessageBox("User already exists. Please login.");
                window.location.href = "login.html";
                return;
            }

            const passHash = await hashPassword(pass);
            users.push({ name, email, password: passHash });
            localStorage.setItem("users", JSON.stringify(users));
            showMessageBox("Signup successful! You can now log in.");
            window.location.href = "login.html";
        };
    }
});