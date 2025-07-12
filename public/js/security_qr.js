document.addEventListener('DOMContentLoaded', () => {
  const resultBox = document.getElementById('result');
  const community = localStorage.getItem('community');

  if (!community) {
    alert("⚠️ Community not set. Please login again.");
    window.location.href = '/security_login.html';
    return;
  }

  function onScanSuccess(decodedText, decodedResult) {
    fetch(`/api/security/scan/${decodedText}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ community })
    })
    .then(async res => {
      const data = await res.json();
      if (res.ok) {
        resultBox.style.color = 'green';
        resultBox.innerText = data.message;
      } else {
        resultBox.style.color = 'red';
        resultBox.innerText = data.message || 'Scan failed';
      }
    })
    .catch(err => {
      resultBox.style.color = 'red';
      resultBox.innerText = '❌ Error during scan';
    });

    html5QrcodeScanner.clear(); // Stop scanning after one success
  }

  const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
  });

  html5QrcodeScanner.render(onScanSuccess);
});
