document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#logTable tbody");
  const community = localStorage.getItem('community');

  try {
    // ✅ Await the fetch call and store the result
    const res = await fetch(`/api/guest/logs/${community}`);
    const logs = await res.json();

    // ✅ Clear table before appending
    tableBody.innerHTML = '';

    // ✅ Check if logs exist
    if (logs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No QR logs found for your community.</td></tr>`;
      return;
    }

    logs.forEach((log, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${log.guestName}</td>
        <td>${log.houseNumber}</td>
        <td>${log.visitDate}</td>
        <td>${log.visitTime}</td>
        <td style="color: ${log.used ? 'green' : 'red'}">
          ${log.used ? '✔ Entered' : '❌ Not Entered'}
        </td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("❌ Failed to fetch logs:", err);
    tableBody.innerHTML = `<tr><td colspan="6">❌ Failed to load logs. Please try again.</td></tr>`;
  }
});
