document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const puppyId = urlParams.get('id');

    if (puppyId) {
        try {
            const response = await fetch(`/api/puppies/${puppyId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const puppy = await response.json();

            if (puppy) {
                const breederResponse = await fetch(`/api/breeders/${puppy.breeder_id}`);
                if (!breederResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const breeder = await breederResponse.json();

                let pictureUrls = Array.isArray(puppy.picture_url) ? puppy.picture_url : [puppy.picture_url];
                const carouselIndicators = pictureUrls.map((url, index) => `
                    <li data-target="#puppyCarousel" data-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>
                `).join('');

                const carouselInner = pictureUrls.map((url, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${url}" class="d-block w-100 small-carousel-image" alt="${puppy.name}" data-full-url="${url}">
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

                const parentPictures = puppy.parent_pictures ? puppy.parent_pictures.map((url, index) => `
                    <div class="col-md-6">
                        <img src="${url}" class="d-block w-100 small-carousel-image mb-3" alt="Parent ${index + 1}" data-full-url="${url}">
                    </div>
                `).join('') : '<p>No parent pictures available.</p>';

                const breederButton = document.createElement('button');
                breederButton.textContent = breeder.name;
                breederButton.className = 'btn btn-warning ml-2';
                breederButton.addEventListener('click', () => {
                    window.location.href = `breederInfo.html?id=${puppy.breeder_id}`;
                });

                const breederInfo = document.createElement('span');
                breederInfo.appendChild(breederButton);

                const detailsContainer = document.getElementById('puppy-details');
                detailsContainer.innerHTML = `
                    <div class="col-md-6 mb-4">
                        <div class="card">
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
                        <div class="mt-4">
                            <h3>Parents</h3>
                            <div class="row">
                                ${parentPictures}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card p-4">
                            <h2 class="mt-3">${puppy.name}</h2>
                            <p><strong>Breed:</strong> ${puppy.breed}</p>
                            <p><strong>Description:</strong> ${puppy.description}</p>
                            <p><strong>Breeder:</strong> </p>
                            <p id="breeder-info"></p>
                            <p><strong>Price:</strong> ${puppy.price} EUR</p>
                            <a href="../contact.html" class="btn btn-warning">Contact</a>
                        </div>
                    </div>
                `;

                document.getElementById('breeder-info').appendChild(breederInfo);

                // Add click event listeners to images
                const images = document.querySelectorAll('.small-carousel-image');
                images.forEach(image => {
                    image.addEventListener('click', () => {
                        const fullUrl = image.getAttribute('data-full-url');
                        window.location.href = `fullImage.html?url=${encodeURIComponent(fullUrl)}`;
                    });
                });
            } else {
                document.getElementById('puppy-details').innerHTML = `<p>Puppy not found.</p>`;
            }
        } catch (error) {
            console.error('Error fetching puppy details:', error);
            document.getElementById('puppy-details').innerHTML = `<p>Error fetching puppy details.</p>`;
        }
    } else {
        document.getElementById('puppy-details').innerHTML = `<p>No puppy ID provided.</p>`;
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
