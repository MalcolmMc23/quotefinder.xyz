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



window.onload = async function () {
    try {
        const response = await fetch('/profile');
        if (response.ok) {
            const user = await response.json();
            // Show the profile section and upload form, and hide the login button
            document.getElementById('profile').style.display = 'block';
            document.getElementById('upload-section').style.display = 'block';
            document.getElementById('auth-section').style.display = 'none';

            // Populate user profile data
            document.getElementById('user-name').textContent = `Name: ${user.name}`;
            document.getElementById('user-email').textContent = `Email: ${user.email}`;
            document.getElementById('user-image').src = user.profile_picture;
        } else {
            // User is not logged in; keep login button visible
            document.getElementById('auth-section').style.display = 'block';
            document.getElementById('profile').style.display = 'none';
            document.getElementById('upload-section').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};