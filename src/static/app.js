document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <ul>
            <li><strong>Participants:</strong></li>
            ${
              details.participants.length > 0
                ? details.participants.map(email => `<li style="list-style-type:circle;margin-left:20px;">${email}</li>`).join("")
                : '<li style="list-style-type:circle;margin-left:20px;">No participants yet</li>'
            }
          </ul>
          <ul>
            <li><strong>Benefits:</strong></li>
            <li style="list-style-type:circle;margin-left:20px;">Meet new friends</li>
            <li style="list-style-type:circle;margin-left:20px;">Learn new skills</li>
            <li style="list-style-type:circle;margin-left:20px;">Have fun!</li>
          </ul>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Adaugă activitate nouă (exemplu simplu, doar frontend)
  const addActivityForm = document.getElementById("add-activity-form");
  if (addActivityForm) {
    addActivityForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("new-activity-name").value;
      const description = document.getElementById("new-activity-description").value;
      const schedule = document.getElementById("new-activity-schedule").value;
      const maxParticipants = document.getElementById("new-activity-max").value;

      try {
        const response = await fetch("/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            schedule,
            max_participants: Number(maxParticipants)
          })
        });

        const result = await response.json();

        if (response.ok) {
          messageDiv.textContent = "Activitatea a fost adăugată!";
          messageDiv.className = "success";
          addActivityForm.reset();
          fetchActivities();
        } else {
          messageDiv.textContent = result.detail || "Eroare la adăugare.";
          messageDiv.className = "error";
        }
        messageDiv.classList.remove("hidden");
        setTimeout(() => {
          messageDiv.classList.add("hidden");
        }, 5000);
      } catch (error) {
        messageDiv.textContent = "Eroare la conectare cu serverul.";
        messageDiv.className = "error";
        messageDiv.classList.remove("hidden");
        console.error("Error adding activity:", error);
      }
    });
  }

  // Initialize app
  fetchActivities();
  activitySelect.innerHTML = "";
});
