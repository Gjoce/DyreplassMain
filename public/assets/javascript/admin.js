// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkFhi7_yox70faJBaRHc_5EWsaRNeQlJA",
    authDomain: "dyrplass-3ea73.firebaseapp.com",
    projectId: "dyrplass-3ea73",
    storageBucket: "dyrplass-3ea73.appspot.com",
    messagingSenderId: "633432609384",
    appId: "1:633432609384:web:882a1824c78ea71236a1dd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Immediately check the auth status and token verification on page load
async function verifyAuthToken() {
    const authToken = localStorage.getItem('authToken'); // Retrieve the token

    if (!authToken) {
        console.log("no token");
        window.location.href = 'login.html'; // Redirect if no token found
        return;
    }
    try {
        const response = await fetch('https://dyreplass-6fca1ec2c6c4.herokuapp.com/api/verifyToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            window.location.href = 'login.html'; // Redirect if token verification fails
        }
    } catch (error) {
        window.location.href = 'login.html'; // Redirect on error
    }
}

// Run the token verification before any content is displayed
document.addEventListener('DOMContentLoaded', verifyAuthToken);

document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
        localStorage.removeItem('authToken'); // Remove token from localStorage
        window.location.href = 'login.html'; // Redirect to login page
    });
});

document.getElementById('puppyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('puppyName').value;
    const breed = document.getElementById('puppyBreed').value;
    const breederId1 = document.getElementById('breederId1').value;
    const price = document.getElementById('puppyPrice').value;
    const description = document.getElementById('puppyDescription').value;
    const mainPicturesFiles = document.getElementById('puppyPicture').files;  // Get the file from the input
    const parentPicturesFiles = document.getElementById('parentPictures').files; // Get parent pictures

    try {
        
         // Upload main pictures to Firebase Storage
    // Upload main pictures to Firebase Storage
        let mainPicturesUrls = [];
        if (mainPicturesFiles.length > 0) {
            for (let i = 0; i < mainPicturesFiles.length; i++) {
                const mainPictureFile = mainPicturesFiles[i];
                const storageRef = storage.ref(`puppies/${name}_${Date.now()}_${i}`);
                const snapshot = await storageRef.put(mainPictureFile);
                const mainPictureUrl = await snapshot.ref.getDownloadURL();
                mainPicturesUrls.push(mainPictureUrl);
                console.log(`Uploaded picture ${i}: ${mainPictureUrl}`); // Log each URL
            }
            console.log('All main picture URLs:', mainPicturesUrls); // Log the complete array
        }


   

        // Upload parent pictures if any
        let parentPicturesUrls = [];
        if (parentPicturesFiles.length > 0) {
            for (let i = 0; i < parentPicturesFiles.length; i++) {
                const parentPictureFile = parentPicturesFiles[i];
                const parentStorageRef = storage.ref(`puppies/parents/${name}_${Date.now()}_${i}`);
                const parentSnapshot = await parentStorageRef.put(parentPictureFile);
                const parentPictureUrl = await parentSnapshot.ref.getDownloadURL();
                parentPicturesUrls.push(parentPictureUrl);
            }
        }

        // Add the puppy document to Firestore
        await db.collection('puppies').add({
            breed: breed,
            breeder_id: breederId1,
            description: description,
            name: name,
            parent_pictures: parentPicturesUrls,
            picture_url: mainPicturesUrls,
            price: price
        });

        alert('Puppy added successfully!');
        document.getElementById('puppyForm').reset(); // Reset the form

    } catch (error) {
        console.error('Error adding puppy: ', error);
        alert('Error adding puppy. Please try again.');
    }
});



document.getElementById('breederForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const breederId = document.getElementById('breederId').value.trim();
    if (!breederId) {
        alert('Breeder ID is required.');
        return;
    }

    const name = document.getElementById('breederName').value.trim();
    const description = document.getElementById('breederDescription').value.trim();
    const pictureFiles = document.getElementById('breederPicture').files; // Get multiple files

    try {
        let pictureUrls = []; // Array to store URLs of uploaded images

        if (pictureFiles.length > 0) {
            for (let i = 0; i < pictureFiles.length; i++) {
                const pictureFile = pictureFiles[i];
                const storageRef = storage.ref(`breeders/${name}_${Date.now()}_${i}`);
                const snapshot = await storageRef.put(pictureFile);
                const pictureUrl = await snapshot.ref.getDownloadURL();
                pictureUrls.push(pictureUrl); // Add the URL to the array
            }
        }

        // Create the breeder data object
        const breederData = {
            name: name,
            description: description,
        };

        // If picture URLs exist, add them to the breeder data object
        if (pictureUrls.length > 0) {
            breederData.picture_urls = pictureUrls; // Use a plural field name for multiple URLs
        }

        // Use the specified breederId as the document ID
        await db.collection('breeders').doc(breederId).set(breederData);

        alert('Breeder added successfully!');
        document.getElementById('breederForm').reset(); // Reset the form

    } catch (error) {
        console.error('Error adding breeder: ', error);
        alert('Error adding breeder. Please try again.');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    function handleFileInput(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        input.addEventListener('change', function() {
            preview.innerHTML = ''; // Clear existing previews
            const files = input.files;
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    handleFileInput('puppyPicture', 'puppyPicturePreview');
    handleFileInput('parentPictures', 'parentPicturesPreview');
    handleFileInput('breederPicture', 'breederPicturePreview');
});



