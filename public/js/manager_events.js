function showPopup(message) {
  const modal = document.getElementById("popupModal");
  const msg = document.getElementById("popupMessage");
  msg.textContent = message;
  modal.style.display = "block";
}

document.addEventListener("click", e => {
  if (e.target.id === "closePopup" || e.target.id === "popupModal") {
    document.getElementById("popupModal").style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const community = localStorage.getItem('community');
  const tbody = document.querySelector('#eventTable tbody');
  const deletedTbody = document.querySelector('#deletedEventTable tbody');
  const form = document.getElementById('eventForm');
  const modal = document.getElementById('registrationsModal');
  const regBody = document.getElementById('registrationsBody');

  // Show event creation modal
  document.getElementById('toggleCreateBtn').onclick = () => {
    document.getElementById('createEventModal').style.display = 'block';
  };

  // Close event modal
  document.getElementById('closeEventModal').onclick = () => {
    document.getElementById('createEventModal').style.display = 'none';
  };

  // Close modal if clicked outside
  window.onclick = function (event) {
    const modal = document.getElementById('createEventModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Create new event
  form.onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', document.getElementById('eventName').value);
    fd.append('description', document.getElementById('description').value);
    fd.append('ticketLimit', document.getElementById('ticketLimit').value || 0);
    fd.append('maxPerUser', document.getElementById('ticketPerUser').value);
    fd.append('community', community);
    const img = document.getElementById('eventImage').files[0];
    if (img) fd.append('image', img);

    try {
      const res = await fetch('/api/events/create', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();

      if (result.success) {
        form.reset();
        document.getElementById('createEventModal').style.display = 'none'; // ✅ hide modal
        showPopup('✅ Event created successfully!');
        loadEvents();
        loadDeletedEvents();
      } else {
        showPopup('⚠️ ' + result.message);
      }
    } catch (err) {
      console.error('❌ Create Error:', err);
      showPopup('❌ Failed to create event.');
    }
  };

  // View registrations
  window.viewRegistrations = async (evId) => {
    try {
      const res = await fetch(`/api/events/registrations/${evId}`);
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      regBody.innerHTML = '';
      data.data.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.houseNumber || '-'}</td>
          <td>${u.username || '-'}</td>
          <td>${u.phone || '-'}</td>
          <td>${u.tickets || '-'}</td>
        `;
        regBody.appendChild(tr);
      });
      modal.style.display = 'block';
    } catch (err) {
      console.error('❌ Registration Fetch Error:', err);
      alert('❌ Could not load registrations.');
    }
  };

  window.closeModal = () => {
    modal.style.display = 'none';
  };

  // Load active events
  async function loadEvents() {
    tbody.innerHTML = '';
    try {
      const res = await fetch(`/api/events/${community}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      data.data.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ev.name}</td>
          <td>${ev.description}</td>
          <td>${ev.ticketLimit === 0 ? 'Unlimited' : ev.ticketLeft}</td>
          <td>${ev.maxPerUser}</td>
          <td>
            <button onclick="viewRegistrations('${ev._id}')">👥 View</button>
            <button onclick="deleteEvent('${ev._id}')">🗑️ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('❌ Events Load Error:', err);
      alert('❌ Could not load events.');
    }
  }

  // Load deleted events
  async function loadDeletedEvents() {
    deletedTbody.innerHTML = '';
    try {
      const res = await fetch(`/api/events/deleted/${community}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      data.data.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ev.name}</td>
          <td>${ev.description}</td>
          <td><button onclick="viewRegistrations('${ev._id}')">👥 View Past Registrations</button></td>
        `;
        deletedTbody.appendChild(tr);
      });
    } catch (err) {
      console.error('❌ Deleted Events Load Error:', err);
      alert('❌ Could not load deleted events.');
    }
  }

  window.downloadCSV = function (tableId, filename) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll("tr"));
    let csv = [];

    rows.forEach(row => {
      const cols = Array.from(row.querySelectorAll("th, td"));
      const rowData = cols.map(cell => `"${cell.innerText.trim()}"`);
      csv.push(rowData.join(","));
    });

    const csvContent = csv.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", filename);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.deleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/delete/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        loadEvents();
        loadDeletedEvents();
      } else {
        alert('❌ ' + result.message);
      }
    } catch (err) {
      console.error('❌ Delete Event Error:', err);
      alert('❌ Could not delete event.');
    }
  };

  // Initial load
  loadEvents();
  loadDeletedEvents();
});
