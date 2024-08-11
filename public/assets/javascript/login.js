const firebaseConfig = {
    apiKey: "AIzaSyDkFhi7_yox70faJBaRHc_5EWsaRNeQlJA",
    authDomain: "dyrplass-3ea73.firebaseapp.com",
    projectId: "dyrplass-3ea73",
    storageBucket: "dyrplass-3ea73.appspot.com",
    messagingSenderId: "633432609384",
    appId: "1:633432609384:web:882a1824c78ea71236a1dd"
  };
  
      // Initialize Firebase
      const app = firebase.initializeApp(firebaseConfig);
      const auth = firebase.auth();
      document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
          // Sign in with Firebase Authentication
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          const idToken = await userCredential.user.getIdToken();
  
          // Send the ID token to the backend for verification
          const response = await fetch('https://dyreplass-6fca1ec2c6c4.herokuapp.com/api/verifyToken', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}`
              }
          });
  
          if (response.ok) {
              // Store token and redirect to admin page
              const data = await response.json();
              localStorage.setItem('authToken', data.token);
              window.location.href = 'admin.html';
          } else {
              document.getElementById('login-error').textContent = 'Login failed. Please check your credentials.';
          }
      } catch (error) {
          document.getElementById('login-error').textContent = 'An error occurred. Please try again.';
      }
  });