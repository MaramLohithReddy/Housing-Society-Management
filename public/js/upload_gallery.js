const popupModal = document.getElementById('popupModal');
const popupMessage = document.getElementById('popupMessage');
const popupClose = document.getElementById('popupClose');

popupClose.addEventListener('click', () => {
  popupModal.classList.add('hidden');
});

function showPopup(message) {
  popupMessage.textContent = message;
  popupModal.classList.remove('hidden');
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const photoInput = document.getElementById('photo');
  const community = localStorage.getItem('community');

  if (!photoInput.files[0]) {
    showPopup('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('photo', photoInput.files[0]);
  formData.append('community', community);

  try {
    const res = await fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();

    if (result.success) {
      showPopup('✅ Image uploaded successfully!');
      photoInput.value = '';
    } else {
      showPopup('❌ Upload failed: ' + result.message);
    }
  } catch (err) {
    showPopup('❌ Upload failed due to network/server error.');
  }
});
