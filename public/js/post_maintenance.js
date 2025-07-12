document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postMaintenanceForm');
  const purposeInput = document.getElementById('purpose');
  const amountInput = document.getElementById('amount');
  const statusText = document.getElementById('postStatus');
  const tableBody = document.querySelector('#noticesTable tbody');

  const community = localStorage.getItem('community');

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const purpose = purposeInput.value.trim();
    const amount = amountInput.value;

    if (!purpose || !amount) {
      statusText.textContent = '❌ Please fill in all fields.';
      return;
    }

    try {
      const res = await fetch('/api/maintenance/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community, purpose, amount })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        statusText.textContent = result.message;
        purposeInput.value = '';
        amountInput.value = '';
        loadNotices(); // Refresh table
      } else {
        statusText.textContent = result.message || '❌ Failed to post maintenance.';
      }
    } catch (err) {
      console.error('❌ Error posting:', err);
      statusText.textContent = '❌ Server error';
    }
  });

  // Load all maintenance notices for this community
  async function loadNotices() {
    try {
      const res = await fetch(`/api/maintenance/community/${community}`);

      const data = await res.json();

      console.log("Fetched result:", data);

      tableBody.innerHTML = '';

      const notices = Array.isArray(data) ? data : data.data;

      if (Array.isArray(notices) && notices.length > 0) {
        notices.forEach((notice) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${notice.purpose}</td>
            <td>₹${notice.amount}</td>
            <td><button data-id="${notice._id}" class="deleteBtn">🗑️ Delete</button></td>
          `;
          tableBody.appendChild(tr);
        });
        attachDeleteListeners();
      } else {
        tableBody.innerHTML = '<tr><td colspan="3">No maintenance notices found.</td></tr>';
      }
    } catch (err) {
      console.error('❌ Failed to fetch notices:', err);
      tableBody.innerHTML = '<tr><td colspan="3">Server error</td></tr>';
    }
  }

  // Attach delete button event
  function attachDeleteListeners() {
    const buttons = document.querySelectorAll('.deleteBtn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this maintenance post?')) {
          try {
            const res = await fetch(`/api/maintenance/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
              loadNotices();
            }
          } catch (err) {
            console.error('❌ Error deleting maintenance:', err);
          }
        }
      });
    });
  }

  // Initial load
  loadNotices();
});
