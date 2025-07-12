// USER LOGIN
document.getElementById('userLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    username: form.username.value,
    password: form.password.value,
    community: form.community.value,
    role: 'user'
  };

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    // ✅ Store user data + JWT token
    localStorage.setItem('token', result.token);
    localStorage.setItem('houseNumber', result.houseNumber);
    localStorage.setItem('community', result.community);
    localStorage.setItem('role', 'user');

    window.location.href = result.redirect;
  } else {
    alert(result.message);
  }
});

// MANAGER LOGIN
document.getElementById('managerLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    username: form.username.value,
    password: form.password.value,
    community: form.community.value,
    role: 'manager'
  };

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    // ✅ Store manager data + JWT token
    localStorage.setItem('token', result.token);
    localStorage.setItem('community', result.community || '');
    localStorage.setItem('role', 'manager');

    window.location.href = result.redirect;
  } else {
    alert(result.message);
  }
});
