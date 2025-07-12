document.getElementById("emailForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();

  const res = await fetch("/api/forgot/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const result = await res.json();
  document.getElementById("status").textContent = result.message;

  if (result.success) {
    localStorage.setItem("resetEmail", email);
    document.getElementById("emailForm").style.display = "none";
    document.getElementById("resetForm").style.display = "block";
  }
});

document.getElementById("resetForm").addEventListener("submit", async e => {
  e.preventDefault();
  const otp = document.getElementById("otp").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const email = localStorage.getItem("resetEmail");

  const res = await fetch("/api/forgot/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword })
  });

  const result = await res.json();
  document.getElementById("status").textContent = result.message;

  if (result.success) {
    alert("Password updated. You can now log in.");
    location.href = "/login.html";
  }
});
