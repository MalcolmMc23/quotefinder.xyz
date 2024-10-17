// Fetch user profile data once logged in
window.onload = async function () {
    try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
            // Handle non-200 responses (like redirects)
            throw new Error('Failed to fetch profile data. Please log in again.');
        }

        const data = await response.json();  // Parse the JSON
        const user = data.user;

        // Update HTML content
        document.getElementById('profile-picture').src = user.profile_picture;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('google-id').textContent = user.google_id;
        document.getElementById('created-at').textContent = new Date(user.created_at).toLocaleString();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Optionally, redirect to login page or show an error message
        window.location.href = '/';
    }
};

// Handle the submit button in the input section
document.getElementById('submitButton').onclick = function () {
    const userInput = document.getElementById('userInput').value;
    // Do something with the user input, e.g., send it to the server
    console.log('User input:', userInput);
    // You can implement your own functionality here
};