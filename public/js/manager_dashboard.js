
  document.addEventListener("DOMContentLoaded", () => {
    // 🔐 1. Auth & Role Check (Manager only)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "manager") {
      window.location.href = "/login.html"; // Redirect if unauthorized
      return;
    }

    // 🏘️ 2. Load Community Name
    const community = localStorage.getItem("community");
    if (community) {
      const nameEl = document.getElementById("managerCommunity");
      if (nameEl) nameEl.textContent = community;
    }

    // 🎯 3. Sidebar Highlight
    const links = document.querySelectorAll(".sidebar a");
    links.forEach(link => {
      link.addEventListener("click", () => {
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    });

    // 🛠️ 4. Feature Hooks for Future Expansion
    console.log("✅ Manager dashboard loaded");
  });

