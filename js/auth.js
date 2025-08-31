document.addEventListener("DOMContentLoaded", () => {
  // LOGIN FORM
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(u => u.email === email && u.password === pass);

      if (found) {
        localStorage.setItem("loggedInUser", JSON.stringify(found));
        alert("Login successful!");
        window.location.href = "index.html"; // redirect to shop
      } else {
        alert("Invalid email or password!");
      }
    };
  }

  // SIGNUP FORM
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const pass = document.getElementById("signupPassword").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.email === email)) {
        alert("User already exists. Please login.");
        window.location.href = "login.html";
        return;
      }

      users.push({ name, email, password: pass });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please login.");
      window.location.href = "login.html";
    };
  }
});
