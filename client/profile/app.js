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
        document.getElementById('access-status').textContent = user.has_access

        const hasAccess = user.has_access;
        const inputSection = document.getElementById('inputSection');
        if (hasAccess) {
            inputSection.style.display = 'block'; // Show the input section
            fetchBooks();

        } else {
            inputSection.style.display = 'none'; // Hide the input sectio
        }


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


    const findQuoteButton = document.getElementById('findQuoteButton');
    findQuoteButton.addEventListener('click', async function () {
        try {
            // Show loading indicator

            // Send a POST request to the server to fetch a quote
            const response = await fetch('/api/findQuote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Received quote:', data);

            // Display the quote on the webpage
            displayQuote(data.quote);
        } catch (error) {
            console.error('Error fetching quote:', error);
            alert('Failed to fetch quote. Please try again later.');
        } finally {
            // Hide loading indicator
        }
    });



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
            fetch('https://quotefinder.xyz/api/quotes', {
                // fetch('http://localhost:3000/api/addQuote', {
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




    //************************** PDF file handling ************************

    const fileUploadInput = document.getElementById('fileUpload');
    const saveFileButton = document.getElementById('saveFile');
    const bookNameInput = document.getElementById('bookName');

    saveFileButton.disabled = true;

    function updateSaveFileButtonState() {
        const isFileSelected = fileUploadInput.files && fileUploadInput.files.length > 0;
        const isBookNameProvided = bookNameInput.value.trim() !== '';

        // Enable the Save File button only if both conditions are true
        saveFileButton.disabled = !(isFileSelected && isBookNameProvided);
    }
    // Event listeners for changes in file input and book name input
    fileUploadInput.addEventListener('change', updateSaveFileButtonState);
    bookNameInput.addEventListener('input', updateSaveFileButtonState);

    saveFileButton.addEventListener('click', async function () {
        try {
            // Check if a file has been selected
            if (fileUploadInput.files && fileUploadInput.files.length > 0) {
                const file = fileUploadInput.files[0];
                const bookName = bookNameInput.value.trim();

                // Create FormData and append the file with the key 'pdfFile'
                const formData = new FormData();
                formData.append('pdfFile', file);
                formData.append('bookName', bookName);

                // Create an XMLHttpRequest to monitor upload progress
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload-pdf', true);

                // Set up a handler for the progress event
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        const percentComplete = ((event.loaded / event.total) * 100).toFixed(2);
                        console.log('working on progress')
                    }
                };

                // Set up a handler for when the request finishes
                xhr.onload = function () {
                    if (xhr.status === 200 || xhr.status === 201) {
                        const result = JSON.parse(xhr.responseText);
                        console.log(result.message); // "PDF uploaded and book saved successfully!"

                        // Print "Hello World" to the console
                        alert(result.message);

                        console.log('Hello World');

                    } else {
                        const errorText = xhr.responseText;
                        alert(errorText || 'Failed to upload PDF.', 'error');

                    }
                    // Hide progress after completion
                };

                // Set up a handler for errors
                xhr.onerror = function () {
                    console.error("An error occurred during the transaction");
                    alert('An error occurred during the upload.');
                };

                // Send the request
                xhr.send(formData);

                // Show initial progress
                alert('Upload started...');
            } else {
                throw new Error('Please select a file and enter a book name before saving.');
            }
        } catch (error) {
            console.error('Error saving file:', error);
            alert(error.message || 'An error occurred while saving the file.');
            // showMessage(error.message || 'An error occurred while saving the file.', 'error');
        }
    });

});
//************* end of PDF file handling ************************



//**************** Book List *******************




async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        displayBooks(data.books);
    } catch (error) {
        console.error('Error fetching books:', error);
        const booksContainer = document.getElementById('books-container');
        booksContainer.innerHTML = `<p style="color:red;">Failed to load your books. Please try again later.</p>`;
    }
}

function displayBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; // Clear any existing content

    if (books.length === 0) {
        booksContainer.innerHTML = '<p>You have not uploaded any books yet.</p>';
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-item');

        const bookName = document.createElement('div');
        bookName.classList.add('book-name');
        bookName.textContent = book.name;

        const uploadDate = document.createElement('div');
        uploadDate.classList.add('upload-date');
        const date = new Date(book.upload_date);
        uploadDate.textContent = `Uploaded on: ${date.toLocaleString()}`;

        const downloadLink = document.createElement('a');
        downloadLink.href = `/download-book/${book.id}`;
        downloadLink.classList.add('download-button');
        downloadLink.textContent = 'Download PDF';

        bookDiv.appendChild(bookName);
        bookDiv.appendChild(uploadDate);
        bookDiv.appendChild(downloadLink);

        booksContainer.appendChild(bookDiv);
    });
}

//***************** end of book list ***************

