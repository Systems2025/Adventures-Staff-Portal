document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper');

    // --- Simplified visibility for non-login page setup ---
    // If using a separate login page, comment out these lines and uncomment the auth block below.
    if (pageContentWrapper) pageContentWrapper.style.display = 'block';
    if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
    initializeUIElements();
    // --- End of simplified visibility ---

    /*
    // --- UNCOMMENT THIS BLOCK IF USING SEPARATE LOGIN PAGE ---
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; // Choose a unique key

    function isPortalAuthenticated() {
        // Check sessionStorage for the key
        const authenticated = sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
        // console.log("Is portal authenticated:", authenticated);
        return authenticated;
    }

    if (isPortalAuthenticated()) {
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
        initializeUIElements();
    } else {
        // If not authenticated, redirect to login.html (or your login page)
        // Ensure 'login.html' exists or change to your actual login page path.
        // window.location.href = 'login.html';
        // console.log("User not authenticated. Redirecting to login page (currently commented out).");

        // For development: if login is not set up, you might want to show content anyway.
        // Remove or comment this out for production if login is mandatory.
        console.warn("Authentication check failed or login page redirect is commented out. Displaying content for development.");
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
        initializeUIElements();
    }
    // --- END OF LOGIN PAGE AUTHENTICATION BLOCK ---
    */


    function initializeUIElements() {
        console.log("Initializing UI elements...");
        initializeDepartmentToggles();
        initializeSidebarCollapsibles(); // This will only work if collapsible HTML structure is present in sidebar
        // Right sidebar widget collapsible JS has been removed as HTML structure changed.
    }

    // --- Sidebar Collapsible Logic (for social links or any other .collapsible section) ---
    // This function remains in case you want to add collapsible sections to the sidebar later.
    // It will only affect elements with '.nav-section.collapsible' and '.collapsible-toggle'.
    function initializeSidebarCollapsibles() {
        const collapsibleToggles = document.querySelectorAll('.sidebar-navigation .collapsible-toggle');

        collapsibleToggles.forEach(toggle => {
            if (toggle.dataset.listenerAttached === 'true') return;

            toggle.addEventListener('click', function(event) {
                event.preventDefault();
                const parentNavSection = this.closest('.nav-section.collapsible');
                const content = this.nextElementSibling; // Assumes ul is direct sibling of h4
                const icon = this.querySelector('.toggle-icon-sidebar');

                if (content && parentNavSection && icon) {
                    parentNavSection.classList.toggle('open');

                    if (content.style.display === "none" || content.style.display === "") {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                        content.style.display = "block";
                        requestAnimationFrame(() => {
                           content.style.maxHeight = content.scrollHeight + "px";
                        });
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                        content.style.maxHeight = "0";
                        content.addEventListener('transitionend', function handler() {
                            if (content.style.maxHeight === "0px") { // Check if still closing
                                content.style.display = "none";
                            }
                            content.removeEventListener('transitionend', handler);
                        }, { once: true });
                    }
                } else {
                    // console.warn("Collapsible structure incomplete for:", this);
                }
            });
            toggle.dataset.listenerAttached = 'true';
        });
        if (collapsibleToggles.length === 0) {
            // console.log("No sidebar collapsible toggles found to initialize.");
        }
    }


    // --- Department Filter Logic ---
    function initializeDepartmentToggles() {
        const filterButtons = document.querySelectorAll('.department-filter-controls .filter-btn');
        const categorySections = document.querySelectorAll('.categories-container .category-section');

        function updateCategoryVisibility(selectedFilter) {
            categorySections.forEach(section => {
                const category = section.dataset.category;
                if (selectedFilter === 'all' || category === selectedFilter) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }

        if (filterButtons.length > 0 && categorySections.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    const selectedFilter = this.dataset.filter;
                    updateCategoryVisibility(selectedFilter);
                });
            });

            const initialActiveFilterButton = document.querySelector('.department-filter-controls .filter-btn.active');
            if (initialActiveFilterButton) {
                updateCategoryVisibility(initialActiveFilterButton.dataset.filter);
            } else if (filterButtons.length > 0) {
                filterButtons[0].classList.add('active'); // Default to first button if none are active
                updateCategoryVisibility(filterButtons[0].dataset.filter);
            } else {
                 updateCategoryVisibility('all'); // Fallback
            }
        } else {
            // console.warn("Filter buttons or category sections not found. Filtering will not work.");
        }
    }
});
