// Get the modal
var modal = document.getElementById('loginModal');

// Get the button that opens the modal
var btn = document.getElementById('loginSignupBtn');

// Get the <span> element that closes the modal
var span = document.getElementById('closeModal');

// Get modal content sections
var modalMainContent = document.getElementById('modal-main-content');
var emailLoginForm = document.getElementById('emailLoginForm');

// When the user clicks the button, open the modal
btn.onclick = function () {
    modal.style.display = 'block';
    modalMainContent.style.display = 'block';
    emailLoginForm.style.display = 'none';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = 'none';
    emailLoginForm.style.display = 'none';
    modalMainContent.style.display = 'block';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        emailLoginForm.style.display = 'none';
        modalMainContent.style.display = 'block';
    }
}

// Handle sign in buttons
document.getElementById('googleSignIn').onclick = function () {
    // Redirect to Google sign in
    window.location.href = '/auth/google';
}

document.getElementById('emailSignIn').onclick = function () {
    // Hide main content and show email login form
    modalMainContent.style.display = 'none';
    emailLoginForm.style.display = 'block';
}

// Handle email login form submission
document.getElementById('submitEmailLogin').onclick = async function () {
    var email = document.getElementById('emailInput').value.trim();
    var password = document.getElementById('passwordInput').value.trim();
    var messageElement = document.getElementById('emailLoginMessage');

    if (email === '' || password === '') {
        messageElement.textContent = 'Please enter both email and password.';
        return;
    }

    // Send login request to the server
    try {
        var response = await fetch('/login-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            // Close the modal and refresh the page or fetch profile data
            modal.style.display = 'none';
            emailLoginForm.style.display = 'none';
            modalMainContent.style.display = 'block';
            // Optionally, refresh the page or update the UI
            window.location.reload();
        } else {
            var errorData = await response.json();
            messageElement.textContent = errorData.message || 'Login failed.';
        }
    } catch (error) {
        messageElement.textContent = 'An error occurred during login.';
    }
};

// Handle upload form submission
document.getElementById('uploadForm').onsubmit = function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    fetch('/upload-pdf', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('message').textContent = data;
        })
        .catch(error => {
            document.getElementById('message').textContent = 'Failed to upload PDF: ' + error;
        });
};

// Fetch user profile data once logged in
window.onload = async function () {
    try {
        // Check if the user is already authenticated by fetching the profile
        const response = await fetch('/profile');
        if (response.ok) {
            const user = await response.json();

            // Show the profile section and upload form, and hide the auth section
            document.getElementById('profile').style.display = 'block';
            document.getElementById('upload-section').style.display = 'block';
            document.getElementById('auth-section').style.display = 'none';

            // Populate user profile data
            document.getElementById('user-name').textContent = `Name: ${user.name}`;
            document.getElementById('user-email').textContent = `Email: ${user.email}`;
            document.getElementById('user-image').src = user.profile_picture;

        } else {
            // User is not logged in; show the auth section
            document.getElementById('auth-section').style.display = 'block';
            document.getElementById('profile').style.display = 'none';
            document.getElementById('upload-section').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};