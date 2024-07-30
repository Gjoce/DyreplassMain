document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const puppyId = urlParams.get('id');
    console.log('Retrieved puppyId:', puppyId); // Debugging output

    if (puppyId) {
        try {
            const response = await fetch(`/api/puppies/${puppyId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const puppy = await response.json();
            console.log('Fetched puppy data:', puppy); // Debugging output

            if (puppy) {
                let pictureUrls = Array.isArray(puppy.picture_url) ? puppy.picture_url : [puppy.picture_url];
                const carouselIndicators = pictureUrls.map((url, index) => `
                    <li data-target="#puppyCarousel" data-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>
                `).join('');

                const carouselInner = pictureUrls.map((url, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${url}" class="d-block w-100" alt="${puppy.name}">
                    </div>
                `).join('');

                const carouselControls = pictureUrls.length > 1 ? `
                    <a class="carousel-control-prev" href="#puppyCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#puppyCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                ` : '';

                document.getElementById('puppy-details').innerHTML = `
                    <div class="col-md-6">
                        <div id="puppyCarousel" class="carousel slide" data-ride="carousel">
                            <ol class="carousel-indicators">
                                ${carouselIndicators}
                            </ol>
                            <div class="carousel-inner">
                                ${carouselInner}
                            </div>
                            ${carouselControls}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h2>Name: ${puppy.name}</h2>
                        <p><strong>Breed:</strong> ${puppy.breed}</p>
                        <p><strong>Price:</strong> ${puppy.price} EUR</p>
                        <p><strong>Description:</strong> ${puppy.description}</p>
                        <a href="../contact.html" class="btn filterzakucinja">Contact</a>
                    </div>
                `;
            } else {
                document.getElementById('puppy-details').innerHTML = `<p>Puppy not found.</p>`;
            }
        } catch (error) {
            console.error('Error fetching puppy details:', error);
            document.getElementById('puppy-details').innerHTML = `<p>Error fetching details. Please try again later.</p>`;
        }
    } else {
        console.error('puppyId is not defined'); // Debugging output
    }
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
