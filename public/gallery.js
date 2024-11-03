document.addEventListener('DOMContentLoaded', () => {
    const fullGallery = document.getElementById('fullGallery');
    const sortFilter = document.getElementById('sortFilter');

    let images = [];

    async function loadImages() {
        try {
            const response = await fetch('/images');
            images = await response.json();
            renderGallery();
        } catch (error) {
            console.error('Failed to load images:', error);
        }
    }

    function renderGallery() {
        fullGallery.innerHTML = '';
        
        const sortedImages = [...images].sort((a, b) => {
            if (sortFilter.value === 'newest') {
                return new Date(b.uploadedAt) - new Date(a.uploadedAt);
            } else {
                return new Date(a.uploadedAt) - new Date(b.uploadedAt);
            }
        });

        sortedImages.forEach(image => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = image.url;
            img.alt = 'Gallery image';
            img.className = 'gallery-image';

            const uploadDate = new Date(image.uploadedAt).toLocaleDateString('zh-CN');
            const dateLabel = document.createElement('div');
            dateLabel.className = 'upload-date';
            dateLabel.textContent = `上传时间: ${uploadDate}`;

            imgContainer.appendChild(img);
            imgContainer.appendChild(dateLabel);
            fullGallery.appendChild(imgContainer);
        });
    }

    sortFilter.addEventListener('change', renderGallery);

    loadImages();
});