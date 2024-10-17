// Get the modal
var modal = document.getElementById('loginModal');

// Get the button that opens the modal
var btn = document.getElementById('loginSignupBtn');

// Removed the close button reference
// var closeBtn = document.getElementById('closeModal');

// Get modal content sections
var modalMainContent = document.getElementById('modal-main-content');
var emailLoginForm = document.getElementById('emailLoginForm');

// Ensure the modal is hidden by default
modal.style.display = 'none';

// When the user clicks the button, open the modal
btn.onclick = function () {
    modal.style.display = 'flex'; // Use 'flex' to match modal's display
    modalMainContent.style.display = 'block';
    emailLoginForm.style.display = 'none';
}

// Removed the close button click event

// When the user clicks anywhere outside of the modal content, close it
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
document.addEventListener('DOMContentLoaded', function () {
    // Handle switching to the email login form
    document.getElementById('emailSignIn').onclick = function () {
        const modalMainContent = document.getElementById('modal-main-content');
        const emailLoginForm = document.getElementById('emailLoginForm');

        // Check if the elements exist
        if (!modalMainContent || !emailLoginForm) {
            console.error('Elements not found in the DOM');
            return;
        }

        // Hide main content and show email login form
        modalMainContent.style.display = 'none';
        emailLoginForm.style.display = 'block';

        // Focus on the email input field
        document.getElementById('emailInput').focus();
    };

    // Handle email login form submission
    // Handle email login form submission
    document.getElementById('submitEmailLogin').onclick = async function (event) {
        event.preventDefault();  // Prevent form from refreshing the page

        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        if (!email || !password) {
            alert('Please fill out both email and password.');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Login successful, redirect or show success message
                window.location.href = '/profile';
            } else {
                // Handle non-200 HTTP responses (e.g., 400 or 500)
                const errorData = await response.json();
                document.getElementById('emailLoginMessage').textContent = `Login failed: ${errorData.message}`;
            }
        } catch (error) {
            console.error('Error during login:', error);
            document.getElementById('emailLoginMessage').textContent = 'An error occurred. Please try again.';
        }
    };
    // Handle upload form submission
    document.getElementById('uploadForm').onsubmit = async function (event) {
        event.preventDefault();  // Prevent page reload
        const formData = new FormData(this);

        try {
            const response = await fetch('/upload-pdf', {
                method: 'POST',
                body: formData,
            });

            const result = await response.text();
            document.getElementById('message').textContent = result;
        } catch (error) {
            document.getElementById('message').textContent = 'Failed to upload PDF: ' + error;
        }
    };

    // Fetch user profile data once logged in
    (async function fetchProfile() {
        try {
            const response = await fetch('/api/profile');

            if (response.ok) {
                const { user } = await response.json();
                document.getElementById('user-name').textContent = `Name: ${user.name}`;
                document.getElementById('user-email').textContent = `Email: ${user.email}`;
                document.getElementById('user-image').src = user.profile_picture;

                // Show the profile and upload sections
                document.getElementById('profile').style.display = 'block';
                document.getElementById('upload-section').style.display = 'block';
                document.getElementById('auth-section').style.display = 'none';
            } else {
                // User is not logged in, show login options
                document.getElementById('auth-section').style.display = 'block';
                document.getElementById('profile').style.display = 'none';
                document.getElementById('upload-section').style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    })();
});