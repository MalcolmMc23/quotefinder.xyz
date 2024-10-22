// Fetch user profile data once logged in
window.onload = async function () {
    try {
        const response = await fetch('/api/profile');
        console.log('Response status:', response.status); // Log the response status
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

        const hasAccessText = user.has_access
        document.getElementById('access-status').textContent = hasAccessText;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Optionally, redirect to login page or show an error message
        window.location.href = '/';
    }
};

// Handle the submit button in the input section
// document.getElementById('submitButton').onclick = function () {
//     const userInput = document.getElementById('userInput').value;
//     // Do something with the user input, e.g., send it to the server
//     console.log('User input:', userInput);
//     // You can implement your own functionality here
// };

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
    modal.style.display = 'flex'; // This line shows the modal
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
    modal.style.display = 'none'; // Ensure the modal is hidden on load

    const logoutLink = document.querySelector('.sidebar a[href="/logout"]');

    // Add click event listener to the logout link
    logoutLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        showLogoutModal(); // This should only be called on logout link click
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

    // Your code here
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', openLogoutModal);
    }
});

// Show the profile popup with user information
function showProfilePopup() {
    const profilePopup = document.getElementById('profilePopup');
    const userName = document.getElementById('user-name').innerText;
    const userEmail = document.getElementById('user-email').innerText;
    const googleId = document.getElementById('google-id').innerText;
    const createdAt = document.getElementById('created-at').innerText;

    // Populate the popup with user information
    profilePopup.querySelector('.modal-content h2').innerText = userName; // Set the title to the user's name
    profilePopup.querySelector('.modal-content p').innerText = `Email: ${userEmail}\nGoogle ID: ${googleId}\nAccount Created At: ${createdAt}`;

    profilePopup.style.display = 'flex';
}

// Add event listener to the profile link
document.querySelector('.sidebar a[href="#"]').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default link behavior
    showProfilePopup();
});

function openLogoutModal() {
    document.getElementById('logoutModal').style.display = 'flex'; // Show the modal
}

// Example of how to call this function
// document.getElementById('logoutButton').addEventListener('click', openLogoutModal);




function closeProfilePopup(event) {
    const popup = document.getElementById('profilePopup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', openLogoutModal);
    } else {
        console.error('Logout button not found in the DOM.');
    }
});

// Show the settings popup
function openSettingsPopup() {
    document.getElementById('settingsPopup').style.display = 'flex'; // Show the settings modal
}

// Hide the settings popup
function closeSettingsPopup(event) {
    const popup = document.getElementById('settingsPopup');
    if (event.target === popup) {
        popup.style.display = 'none'; // Hide the settings modal
    }
}

// Add event listener to the settings link
document.querySelector('.sidebar a[href="#"]').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default link behavior
    openSettingsPopup(); // Show the settings modal
});

