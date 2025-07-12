document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('complaintForm');
  const successModal = document.getElementById('successModal');
  const okButton = document.getElementById('okButton');
  const statusText = document.getElementById('status');

  // Submit complaint handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const issue = document.getElementById('issue').value;
    const description = document.getElementById('description').value.trim();
    const photo = document.getElementById('photo').files[0];

    const houseNumber = localStorage.getItem('houseNumber');
    const community = localStorage.getItem('community');

    const formData = new FormData();
    formData.append('issue', issue);
    formData.append('description', description);
    formData.append('houseNumber', houseNumber);
    formData.append('community', community);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch('/api/complaints/create', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();

      if (result.success) {
        // Show success modal
        successModal.style.display = 'block';
        statusText.textContent = '';
      } else {
        statusText.textContent = '❌ ' + result.message;
      }

      loadComplaintHistory();
    } catch (err) {
      statusText.textContent = '❌ Error submitting complaint';
    }
  });

  // OK button in modal → reset form and close modal
  okButton.addEventListener('click', () => {
    successModal.style.display = 'none';
    form.reset(); // clear fields
  });

  // Load complaint history on page load
  loadComplaintHistory();
});

// Fetch and display complaint history
async function loadComplaintHistory() {
  const houseNumber = localStorage.getItem('houseNumber');
  const res = await fetch(`/api/complaints/user/${houseNumber}`);
  const data = await res.json();
  const tbody = document.getElementById('complaintHistory');
  tbody.innerHTML = '';

  data.data.forEach(c => {
    const tr = document.createElement('tr');
    const statusClass = c.status === 'Resolved' ? 'status-resolved' : 'status-pending';

    tr.innerHTML = `
      <td>${c.issue}</td>
      <td class="${statusClass}">${c.status}</td>
      <td>${new Date(c.createdAt).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}
