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

// Show the logout confirmation modal
function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'flex'; // Show the modal
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

// Hide the profile popup when clicking outside
function closeProfilePopup(event) {
    const popup = document.getElementById('profilePopup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
}

// Show the settings popup
function openSettingsPopup() {
    document.getElementById('settingsPopup').style.display = 'flex'; // Show the settings modal
}

// Hide the settings popup when clicking outside
function closeSettingsPopup(event) {
    const popup = document.getElementById('settingsPopup');
    if (event.target === popup) {
        popup.style.display = 'none'; // Hide the settings modal
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize modals
    const logoutModal = document.getElementById('logoutModal');
    logoutModal.style.display = 'none'; // Ensure the modal is hidden on load

    const profilePopup = document.getElementById('profilePopup');
    profilePopup.style.display = 'none';

    const settingsPopup = document.getElementById('settingsPopup');
    settingsPopup.style.display = 'none';

    // Add click event listener to the logout link
    const logoutLink = document.getElementById('logoutLink');
    logoutLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        showLogoutModal(); // Show the logout modal
    });

    // Add click event listener to the confirm logout button
    document.getElementById('confirmLogout').addEventListener('click', handleLogout);

    // Add click event listener to the cancel logout button
    document.getElementById('cancelLogout').addEventListener('click', hideLogoutModal);

    // Close the logout modal when clicking outside
    logoutModal.addEventListener('click', function (event) {
        if (event.target === logoutModal) {
            hideLogoutModal();
        }
    });

    // Add event listener to the profile link
    const profileLink = document.getElementById('profileLink');
    profileLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        showProfilePopup();
    });

    // Close the profile popup when clicking outside
    profilePopup.addEventListener('click', closeProfilePopup);

    // Add event listener to the settings link
    const settingsLink = document.getElementById('settingsLink');
    settingsLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        openSettingsPopup(); // Show the settings modal
    });

    // Close the settings popup when clicking outside
    settingsPopup.addEventListener('click', closeSettingsPopup);



    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function () {
        const userInput = document.getElementById('userInput').value.trim();

        if (userInput === '') {
            alert('Please enter some text.');
        } else {
            // Premade quote and book to submit
            const quoteData = {
                book: 'Book name',
                quote_text: userInput
            };

            console.log('Sending quote data:', quoteData);  // Log the data to verify

            // API call to submit the quote
            fetch('api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quoteData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(`Error: ${err.error || 'Failed to submit quote.'}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Quote added successfully:', data);
                    alert('Quote added successfully!');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting the quote.');
                });
        }
    });
});