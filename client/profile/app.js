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

// Open the sidebar
function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}

// Close the sidebar
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

// Handle the burger menu button click
document.getElementById('burger-button').onclick = function () {
    openNav();
};

// Add these functions to your existing JavaScript file

// Show the logout confirmation modal
function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'flex';
}

// Hide the logout confirmation modal
function hideLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'none';
}

// Handle logout confirmation
function handleLogout() {
    // Perform logout action here
    console.log('Logging out...');
    // Redirect to home page or perform any other logout actions
    window.location.href = '/logout';
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('logoutModal');
    const logoutLink = document.querySelector('.sidebar a[href="/logout"]');

    // Add click event listener to the logout link
    logoutLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        showLogoutModal();
    });

    // Add click event listener to the confirm logout button
    document.getElementById('confirmLogout').addEventListener('click', handleLogout);

    // Add click event listener to the cancel logout button
    document.getElementById('cancelLogout').addEventListener('click', hideLogoutModal);

    // Close the modal when clicking outside of it
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideLogoutModal();
        }
    });
});
