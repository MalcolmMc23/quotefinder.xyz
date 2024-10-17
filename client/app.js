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

document.getElementById('emailSignIn').onclick = function () {
    // Hide main content and show email login form
    modalMainContent.style.display = 'none';
    emailLoginForm.style.display = 'block';
    // Focus on the email input field
    document.getElementById('emailInput').focus();
}

// Handle email login form submission
document.getElementById('submitEmailLogin').onclick = async function () {
    // ... (Existing code for handling email login submission)
};

// Handle upload form submission
// ... (Existing code for handling upload form submission)

// Fetch user profile data once logged in
document.addEventListener('DOMContentLoaded', async function () {
    // ... (Existing code for fetching user profile data)
});