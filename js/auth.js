document.addEventListener("DOMContentLoaded", () => {
  // Helper: SHA-256 hash
  async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

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
        alert("Login successful!");
        // Return to order page if checking out
        if (localStorage.getItem("checkoutPending") === "true") {
          localStorage.removeItem("checkoutPending");
          window.location.href = "order.html";
        } else {
          window.location.href = "cake-card.html";
        }
      } else {
        alert("Invalid email or password!");
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
        alert("Password must be at least 6 characters long!");
        return;
      }
      if (pass !== confirm) {
        alert("Passwords do not match!");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.email === email)) {
        alert("User already exists. Please login.");
        window.location.href = "login.html";
        return;
      }

      const passHash = await hashPassword(pass);
      users.push({ name, email, password: passHash });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Signup successful! Please login.");
      window.location.href = "login.html";
    };
  }
});
