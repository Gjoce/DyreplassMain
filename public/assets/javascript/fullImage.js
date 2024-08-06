document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('url');
    if (imageUrl) {
        document.getElementById('full-image').src = imageUrl;
    }
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'no', autoDisplay: false}, 'google_translate_element');
}

document.getElementById('translate-btn').addEventListener('click', function() {
    var translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
        translateElement.value = 'en'; // Set value to English
        translateElement.dispatchEvent(new Event('change')); // Trigger change event
    }
});
