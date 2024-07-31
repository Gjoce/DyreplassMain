document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    window.location.href = `mailto:dyrplass@gmail.com?subject=Inquiry%20about%20Puppies&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(email)}`;
});
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
}

document.getElementById('translate-btn').addEventListener('click', function() {
    var translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
        translateElement.value = 'no'; // Set value to Norwegian
        translateElement.dispatchEvent(new Event('change')); // Trigger change event
    }
});