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
    const text = `"You're a wizzard Harry"`;
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


let canvas = document.getElementById('drawingCanvas')
let canvasContext = canvas.getContext('2d');


class FloatingText {
    constructor(text, font) {
        this.text = text;
        this.x = 0
        this.y = 0
        this.vX = 1
        this.vY = 1
        // this.init();
    }

    run() {
        this.render()
        this.update();
    }

    render() {
        canvasContext.clearRect(0, 0, 10000, 10000); // Clear the canvas
        canvasContext.font = "30px 'YourFontName', sans-serif"; // Set the font size and family
        canvasContext.fillText("alksjflaskdjf;lasdkfjlaskdjf", this.x, this.y);

    }
    update() {
        this.x += this.vX;
        this.y += this.vY;
        console.log(this.x, this.y);
    }
}



let fText;
window.onload = init;
function init() {
    fText = new FloatingText("hello")
    animate();
}

function animate() {
    fText.run()
    requestAnimationFrame(animate);
}
