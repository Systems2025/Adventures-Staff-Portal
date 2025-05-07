document.addEventListener('DOMContentLoaded', function() {
    console.log("Login page DOM loaded.");

    const passwordInput = document.getElementById('portalPasswordInput');
    const submitButton = document.getElementById('submitLoginButton');
    const errorParagraph = document.getElementById('loginError');

    const PORTAL_PASSWORD = "BSK@2025#"; // The global password
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; // Use a consistent key, v3 for fresh test

    if (!passwordInput || !submitButton || !errorParagraph) {
        console.error("Login page elements not found!");
        if(errorParagraph) errorParagraph.textContent = "Page loading error. Please refresh.";
        return;
    }

    // If already unlocked, redirect immediately (e.g., user hits back button)
    if (sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true') {
        console.log("Already unlocked, redirecting to portal...");
        window.location.href = 'index.html'; // Adjust if your main portal page has a different name
        return; // Stop further execution on this page
    }


    function attemptLogin() {
        console.log("Attempting login...");
        const enteredPassword = passwordInput.value;

        if (enteredPassword === PORTAL_PASSWORD) {
            console.log("Password correct. Setting unlock flag and redirecting.");
            errorParagraph.textContent = '';
            sessionStorage.setItem(PORTAL_UNLOCKED_KEY, 'true');
            window.location.href = 'index.html'; // Adjust if your main portal page has a different name
        } else {
            console.log("Password incorrect.");
            errorParagraph.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = ''; // Clear input
            passwordInput.focus();
        }
    }

    submitButton.addEventListener('click', attemptLogin);

    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it were in a form
            attemptLogin();
        }
    });

    // Optional: Autofocus on the password field
    passwordInput.focus();
});
