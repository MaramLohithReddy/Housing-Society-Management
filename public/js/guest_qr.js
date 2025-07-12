document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qrForm');
  const canvas = document.getElementById('qrCanvas');
  const ctx = canvas.getContext('2d');
  const whatsappBtn = document.getElementById('whatsappBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const guestName = document.getElementById('guestName').value;
    const visitDate = document.getElementById('visitDate').value;
    const visitTime = document.getElementById('visitTime').value;
    const houseNumber = localStorage.getItem('houseNumber');
    const communityName = localStorage.getItem('community');


    // ✅ Send request to backend to create and store guest QR
    const response = await fetch('/api/guest/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName, visitDate, visitTime, houseNumber, communityName })
    });

    const data = await response.json();
    if (!response.ok) {
      alert("❌ Failed to generate QR");
      return;
    }

    const qrId = data.qrId;
    const qrText = qrId; // ✅ only the ObjectId to be scanned
    const tempCanvas = document.createElement('canvas');
    await QRCode.toCanvas(tempCanvas, qrText);

    // Draw QR and info on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0, 300, 300);

    ctx.font = "16px Arial";
    ctx.fillText(`Guest: ${guestName}`, 10, 320);
    ctx.fillText(`Date: ${visitDate}`, 10, 340);
    ctx.fillText(`Time: ${visitTime}`, 10, 360);
    ctx.fillText(`House: ${houseNumber}`, 10, 380);

    whatsappBtn.style.display = "inline-block";
  });

  whatsappBtn.addEventListener('click', () => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "guest_qr.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Guest QR',
            text: 'Scan this guest QR to allow entry.'
          });
        } catch (err) {
          alert("Sharing canceled or failed.");
        }
      } else {
        alert("❌ Your browser doesn't support direct image sharing. Try on Chrome (Android).");
      }
    });
  });
});
