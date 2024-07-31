document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('url');
    if (imageUrl) {
        document.getElementById('full-image').src = imageUrl;
    }
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
}

document.getElementById('translate-btn').addEventListener('click', function() {
    var translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
        translateElement.value = 'no';
        translateElement.dispatchEvent(new Event('change'));
    }
});