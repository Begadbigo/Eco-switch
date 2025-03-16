document.addEventListener("DOMContentLoaded", function () {
    const authButtons = document.getElementById("authButtons"); // Login & Register Buttons
    const userProfile = document.getElementById("userProfile"); // User's Profile Section
    const userName = document.getElementById("userName"); // User's Name
    const userIcon = document.getElementById("userIcon"); // Profile Icon
    const logoutBtn = document.getElementById("logoutBtn"); // Logout Button

    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        authButtons.style.display = "none";  // Hide Login & Register
        userProfile.style.display = "flex";  // Show User Profile
        userName.textContent = user.first_name;  // Display First Name
    }

    // Toggle Logout Button when clicking the user icon
    userIcon.addEventListener("click", function () {
        logoutBtn.style.display = logoutBtn.style.display === "none" ? "block" : "none";
    });

    // Logout Functionality
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("user");  // Remove user from storage
        window.location.reload();  // Refresh the page
    });

    // Login Handling
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert("✅ " + data.message);

                    // Store user data
                    localStorage.setItem("user", JSON.stringify(data.user));

                    window.location.href = "Main.html"; // Redirect after login
                } else {
                    alert("❌ " + data.error);
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("❌ Login failed. Please try again.");
            }
        });
    }
});
