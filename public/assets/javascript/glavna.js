document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://dyreplass-6fca1ec2c6c4.herokuapp.com/api/puppies');
        const puppies = await response.json();
        const listingsContainer = document.getElementById('listings-container');
        const shownCount = document.getElementById('shown-count');

        function displayPuppies(puppiesToShow) {
            listingsContainer.innerHTML = ''; // Clear existing content

            puppiesToShow.forEach(puppy => {
                const puppyCard = document.createElement('div');
                puppyCard.classList.add('col-md-4', 'mb-4');

                let imageUrl = Array.isArray(puppy.picture_url) ? puppy.picture_url[0] : puppy.picture_url;

                // Wrap the card in an anchor tag
                puppyCard.innerHTML = 
                    `<a href="../details.html?id=${puppy.id}" class="card-link">
                        <div class="card">
                            <img src="${imageUrl}" class="card-img-top img-fluid rounded" style="max-height: 200px; max-width: 100%; object-fit: cover;" alt="${puppy.name}">
                            <div class="card-body">
                                <h4 class="card-title">${puppy.name}</h4>
                                <h5 class="card-text">${puppy.breed} valp</h5>
                                <p class="card-text">${puppy.price} NOK</p>
                            </div>
                        </div>
                    </a>`;
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
            const searchQuery = document.getElementById('search-input').value.toLowerCase();

            const filteredPuppies = puppies.filter(puppy => {
                const matchesBreed = selectedBreeds.length === 0 || selectedBreeds.includes(puppy.breed);
                const matchesSearch = puppy.breed.toLowerCase().includes(searchQuery) || puppy.name.toLowerCase().includes(searchQuery);
                return matchesBreed && matchesSearch;
            });

            console.log('Filtered Puppies:', filteredPuppies); // Debugging output
            displayPuppies(filteredPuppies);
        }

        document.getElementById('breed-filter-form').addEventListener('change', filterPuppies);
        
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
