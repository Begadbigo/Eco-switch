

window.onload = function() {
    // Get users from localStorage (default is an empty array if none exist)
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Sort users by points (highest first)
    users.sort((a, b) => b.points - a.points);

    // Get the table body and clear old data
    const tableBody = document.querySelector("#rankingTable tbody");
    tableBody.innerHTML = "";

    // If there are no users, show a message
    if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">No users yet. Please log in.</td></tr>`;
        return;
    }

    // Display users in the table
    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.points}</td>
        `;
        tableBody.appendChild(row);
    });

    // Function to show challenges
    window.showChallenges = function(category) {
        const challenges = {
            kids: ["Plant a tree at home", "Use a reusable water bottle"],
            teens: ["Reduce plastic use for one day", "Use eco-friendly transportation"],
            adults: ["Install solar panels", "Join a street cleaning campaign"]
        };
    
        const challengeDiv = document.getElementById("challenges");
    
        if (!challenges[category]) {
            challengeDiv.innerHTML = "<p>No challenges found for this category.</p>";
            return;
        }
    
        challengeDiv.innerHTML = `
            <h2>Challenges:</h2>
            <div class="challenge-container">
                ${challenges[category]
                    .map((challenge) => `
                        <div class="challenge-box">
                            <p>${challenge}</p>
                            <button class="challenge-btn" data-challenge="${challenge}">Complete</button>
                        </div>
                    `)
                    .join('')}
            </div>
        `;
    
        // Attach event listeners to the buttons after rendering them
        document.querySelectorAll(".challenge-btn").forEach(button => {
            button.addEventListener("click", function() {
                completeChallenge(this.getAttribute("data-challenge"));
            });
        });
    };
    
    // Function when clicking the button
    function completeChallenge(challenge) {
        alert(`Challenge completed: ${challenge}`);
    }
    
};
