document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('url');
    if (imageUrl) {
        document.getElementById('full-image').src = imageUrl;
    }
});

