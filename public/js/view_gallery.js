document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const popupModal = document.getElementById('imagePopup');
  const popupImage = document.getElementById('popupImage');
  const popupClose = document.getElementById('popupClose');

  // Fetch community from localStorage (adjust as needed)
  const community = localStorage.getItem('community');

  // Fetch gallery images by community
  async function loadGallery() {
    try {
      const response = await fetch(`/api/gallery/${community}`);
      const data = await response.json();

      if (!data.success) {
        gallery.innerHTML = `<p>Error loading gallery: ${data.message}</p>`;
        return;
      }

      if (data.data.length === 0) {
        gallery.innerHTML = `<p>No images found for your community.</p>`;
        return;
      }

      // Clear gallery container
      gallery.innerHTML = '';

      // Create img elements for each image
      data.data.forEach(imageObj => {
        const img = document.createElement('img');
        img.src = imageObj.imageUrl;
        img.alt = `Community image uploaded on ${new Date(imageObj.uploadedAt).toLocaleDateString()}`;
        img.tabIndex = 0; // make focusable for accessibility

        // Open popup on click or Enter key
        img.addEventListener('click', () => openPopup(img.src, img.alt));
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPopup(img.src, img.alt);
          }
        });

        gallery.appendChild(img);
      });
    } catch (error) {
      gallery.innerHTML = `<p>Error loading gallery: ${error.message}</p>`;
    }
  }

  function openPopup(src, alt) {
    popupImage.src = src;
    popupImage.alt = alt;
    popupModal.classList.remove('hidden');
    popupClose.focus();
  }

  function closePopup() {
    popupModal.classList.add('hidden');
    popupImage.src = '';
    popupImage.alt = '';
  }

  // Close popup on clicking close button
  popupClose.addEventListener('click', closePopup);

  // Close popup on clicking outside content
  popupModal.addEventListener('click', (e) => {
    if (e.target === popupModal) {
      closePopup();
    }
  });

  // Close popup on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popupModal.classList.contains('hidden')) {
      closePopup();
    }
  });

  // Initial load
  loadGallery();
});
