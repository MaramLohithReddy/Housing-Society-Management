document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const houseNumber = document.getElementById('houseNumber').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const community = localStorage.getItem('community');

  if (!username || !houseNumber || !phone || !email || !password) return;

  try {
    const res = await fetch('/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, houseNumber, phone, email, password, community })
    });

    const result = await res.json();
    document.getElementById('status').textContent = result.message;
  } catch (err) {
    console.error("❌ Error creating user:", err);
    document.getElementById('status').textContent = "❌ Server error";
  }
});
