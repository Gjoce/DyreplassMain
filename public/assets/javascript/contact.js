function escapeHtml(unsafe) {
    return unsafe.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = escapeHtml(document.getElementById('email').value);
    const message = escapeHtml(document.getElementById('message').value);
    window.location.href = `mailto:dyrplass@gmail.com?subject=Inquiry%20about%20Puppies&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(email)}`;
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
