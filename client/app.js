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

// Typing animation
document.addEventListener('DOMContentLoaded', function () {
    const text = `"You're a wizzard Harry" (Rowling 39)`;
    const typingElement = document.getElementById('animated-text');
    const typingDelay = 100; // Delay between each character (in milliseconds)
    const startDelay = 1000; // 5 seconds delay before starting the animation

    function typeText(text, element, delay) {
        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, delay);
            }
        }

        typeChar();
    }

    // Add a delay before starting the typing animation
    setTimeout(function () {
        typeText(text, typingElement, typingDelay);
    }, startDelay);
});

document.addEventListener('DOMContentLoaded', function () {
    const floatingTexts = document.querySelectorAll('.floating-text');
    const numTexts = floatingTexts.length;
    const zoneHeight = 100 / numTexts; // Height of each zone in percentage

    floatingTexts.forEach((text, index) => {
        // Vertical position within its zone
        const zoneTop = index * zoneHeight;
        const zoneBottom = (index + 1) * zoneHeight;
        const top = zoneTop + Math.random() * (zoneBottom - zoneTop);
        text.style.top = `${top}%`;

        // Random start position (left or right)
        const startSide = Math.random() < 0.5 ? 'left' : 'right';
        text.style[startSide] = '-50%';
        text.style[startSide === 'left' ? 'right' : 'left'] = 'auto';

        // Random animation duration
        const duration = Math.random() * 10 + 25; // 25s to 35s
        text.style.animationDuration = `${duration}s`;

        // Random delay
        const delay = Math.random() * -15;
        text.style.animationDelay = `${delay}s`;

        // Set animation direction
        text.style.animationName = startSide === 'left' ? 'float' : 'float-reverse';

        // Random slight up or down movement (reduced range)
        const maxMovement = zoneHeight / 4; // Limit movement to 1/4 of the zone height
        const yMovement = (Math.random() * 2 - 1) * maxMovement; // -maxMovement to +maxMovement
        text.style.setProperty('--y-movement', `${yMovement}vh`);
    });
});
