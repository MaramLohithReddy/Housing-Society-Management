window.login = async function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/security/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('community', data.community); // ✅ Store community
    window.location.href = '/security_scan.html';
  } else {
    const data = await res.json();
    document.getElementById('error').innerText = data.message || "Login failed";
  }
};
