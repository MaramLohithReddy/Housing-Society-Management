document.addEventListener("DOMContentLoaded", async () => {
  const community = localStorage.getItem("community");
  const tableBody = document.querySelector("#userTable tbody");
  const statusMsg = document.getElementById("statusMsg");

  try {
    const res = await fetch(`/api/users/community/${community}`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      if (result.data.length === 0) {
        statusMsg.textContent = "No users found in this community.";
        return;
      }

      result.data.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.username}</td>
          <td>${user.houseNumber}</td>
          <td>${user.phone}</td>
        `;
        tableBody.appendChild(tr);
      });
    } else {
      statusMsg.textContent = "Failed to retrieve user data.";
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    statusMsg.textContent = "An error occurred while loading users.";
  }
});
