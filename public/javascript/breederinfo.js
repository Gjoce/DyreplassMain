document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const breederId = urlParams.get('id');

    if (breederId) {
        try {
            const response = await fetch(`https://dyreplass-6fca1ec2c6c4.herokuapp.com/api/breeders/${breederId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const breeder = await response.json();

            // Display breeder details
            document.getElementById('breeder-info').innerHTML = `
                <h2>${breeder.name}</h2>
                <p><strong>Description:</strong> ${breeder.description}</p>
            `;

            // Display photos of previous puppies
            if (breeder.picture_url && breeder.picture_url.length > 0) {
                const gallery = breeder.picture_url.map(url => `
                    <div class="col-md-4 mb-3">
                        <img src="${url}" class="img-fluid fixed-size rounded" alt="Previous Puppy Photo">
                    </div>
                `).join('');

                document.getElementById('puppy-gallery').innerHTML = `
                    <h3>Photos of Previous Puppies</h3>
                    <div class="row">
                        ${gallery}
                    </div>
                `;
            } else {
                document.getElementById('puppy-gallery').innerHTML = '<p>No photos available.</p>';
            }
        } catch (error) {
            console.error('Error fetching breeder details:', error);
            document.getElementById('breeder-info').innerHTML = '<p>Error fetching breeder details.</p>';
        }
    } else {
        document.getElementById('breeder-info').innerHTML = '<p>No breeder ID provided.</p>';
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
    
