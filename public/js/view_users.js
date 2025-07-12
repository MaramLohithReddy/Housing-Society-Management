document.addEventListener("DOMContentLoaded", async () => {
  const community = localStorage.getItem("community");
  const tableBody = document.querySelector("#userTable tbody");
  const statusMsg = document.getElementById("statusMsg");

  try {
    const res = await fetch(`/api/users/community/${community}`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      result.data.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.username}</td>
          <td>${user.houseNumber}</td>
          <td>${user.phone}</td>
          <td>
            <button class="deleteBtn" data-id="${user._id}">🗑️ Delete</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      attachDeleteListeners();
    } else {
      statusMsg.textContent = "No users found.";
    }
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    statusMsg.textContent = "❌ Failed to load users.";
  }

  function attachDeleteListeners() {
    document.querySelectorAll('.deleteBtn').forEach(button => {
      button.addEventListener('click', async () => {
        const userId = button.getAttribute('data-id');
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
          const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
          const result = await res.json();
          if (result.success) {
            location.reload();
          } else {
            alert("❌ Failed to delete user.");
          }
        } catch (err) {
          console.error("❌ Error deleting user:", err);
          alert("❌ Network error.");
        }
      });
    });
  }
});
