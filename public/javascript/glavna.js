document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://dyrplass-3ea73.web.app/api/puppies');
        const puppies = await response.json();
        const listingsContainer = document.getElementById('listings-container');
        const amountDisplay = document.getElementById('amount-display');
        const shownCount = document.getElementById('shown-count');

        function displayPuppies(puppiesToShow) {
            listingsContainer.innerHTML = ''; // Clear existing content

            puppiesToShow.forEach(puppy => {
                const puppyCard = document.createElement('div');
                puppyCard.classList.add('col-md-4', 'mb-4');

                let imageUrl = Array.isArray(puppy.picture_url) ? puppy.picture_url[0] : puppy.picture_url;

                puppyCard.innerHTML = 
                    `<div class="card">
                        <img src="${imageUrl}" class="card-img-top img-fluid rounded" style="max-height: 200px; max-width: 100%; object-fit: cover;" alt="${puppy.name}">
                        <div class="card-body">
                        <h4 class="card-title">${puppy.name}</h4>
                            <h5 class="card-text">${puppy.breed} Puppy</h5>
                            <p class="card-text">${puppy.price} EUR</p>
                            <a href="../details.html?id=${puppy.id}" class="btn filterzakucinja">Show Details</a>
                        </div>
                    </div>`;
                listingsContainer.appendChild(puppyCard);
            });

            // Update shown count
            shownCount.textContent = puppiesToShow.length;

            // Show modal if no puppies are found
            if (puppiesToShow.length === 0) {
                $('#noResultsModal').modal('show');
            }
        }

        function getSelectedBreeds() {
            const selectedBreeds = [];
            const checkboxes = document.querySelectorAll('#breed-filter-form .form-check-input');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedBreeds.push(checkbox.value);
                }
            });
            return selectedBreeds;
        }

        function filterPuppies() {
            const selectedBreeds = getSelectedBreeds();
            const priceRange = document.getElementById('priceRange').value;
            const searchQuery = document.getElementById('search-input').value.toLowerCase();

            const filteredPuppies = puppies.filter(puppy => {
                const matchesBreed = selectedBreeds.length === 0 || selectedBreeds.includes(puppy.breed);
                const matchesPrice = parseFloat(puppy.price) <= parseFloat(priceRange);
                const matchesSearch = puppy.breed.toLowerCase().includes(searchQuery) || puppy.name.toLowerCase().includes(searchQuery);
                return matchesBreed && matchesPrice && matchesSearch;
            });

            console.log('Filtered Puppies:', filteredPuppies); // Debugging output
            displayPuppies(filteredPuppies);
        }

        document.getElementById('breed-filter-form').addEventListener('change', filterPuppies);
        document.getElementById('priceRange').addEventListener('input', function() {
            filterPuppies();
            document.getElementById('priceRangeValue').textContent = this.value;
        });
        document.getElementById('search-form').addEventListener('submit', function(event) {
            event.preventDefault();
            filterPuppies();
        });

        // Initial display
        displayPuppies(puppies);

        // Show amount on scroll
        window.addEventListener('scroll', () => {
            const listingsContainerRect = listingsContainer.getBoundingClientRect();
            if (listingsContainerRect.top >= 0 && listingsContainerRect.bottom <= window.innerHeight) {
                amountDisplay.style.visibility = 'visible';
            } else {
                amountDisplay.style.visibility = 'hidden';
            }
        });

    } catch (error) {
        console.error('Error fetching puppies:', error);
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
