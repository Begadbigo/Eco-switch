document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");

    if (!form) {
        console.error("❌ Form with ID 'registerForm' not found!");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form refresh

        // Ensure all form elements exist
        const firstName = document.getElementById("firstName")?.value.trim() || "";
        const secondName = document.getElementById("secondName")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const nationalID = document.getElementById("nationalID")?.value.trim() || "";
        const age = document.getElementById("age")?.value.trim() || "";
        const password = document.getElementById("password")?.value.trim() || "";

        // Fetch the selected gender from radio buttons
        const gender = document.querySelector('input[name="gender"]:checked')?.value || "";

        // Validate required fields
        if (!firstName || !secondName || !email || !nationalID || !gender || !age || !password) {
            alert("❌ Please fill in all fields.");
            return;
        }

        // Validate National ID (Must be exactly 14 digits)
        if (!/^\d{14}$/.test(nationalID)) {
            alert("❌ National ID must be exactly 14 digits.");
            return;
        }

        // Validate Password (At least 8 chars, uppercase, lowercase, number, special char)
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/.test(password)) {
            alert("❌ Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
            return;
        }

        // Validate Age (Between 12 and 100)
        if (isNaN(age) || age < 12 || age > 100) {
            alert("❌ Age must be between 12 and 100.");
            return;
        }

        // Prepare Data to Send
        const formData = {
            first_name: firstName,
            second_name: secondName,
            email: email,
            national_id: nationalID,
            gender: gender,
            age: age,
            password: password
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ " + data.message);
                window.location.href = "login.html"; // Redirect to login page after success
            } else {
                alert("❌ " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("❌ Registration failed. Please try again later.");
        }
    });
});
