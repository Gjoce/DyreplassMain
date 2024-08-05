document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://dyreplass-6fca1ec2c6c4.herokuapp.com/admin-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        window.location.href = '/index.html';
    } else {
        document.getElementById('errorMessage').classList.remove('d-none');
    }
});