document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    // --- Assuming no separate login for this version, otherwise keep authentication check ---
    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper'); 

    if (pageContentWrapper) pageContentWrapper.style.display = 'block';
    if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
    initializeUIElements();
    // --- End of simplified visibility toggle ---

    /* 
    // --- UNCOMMENT THIS BLOCK IF USING SEPARATE LOGIN PAGE ---
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; // Must match the key used in login.js

    function isPortalAuthenticated() {
        const authenticated = sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
        console.log("Is portal authenticated (from session)?", authenticated);
        return authenticated;
    }

    if (isPortalAuthenticated()) {
        console.log("Portal is authenticated. Displaying content.");
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block'; 
        initializeUIElements();
    } else {
        console.log("Portal not authenticated. Redirecting to login page.");
        window.location.href = 'login.html'; 
        return; 
    }
    // --- END OF LOGIN PAGE AUTHENTICATION BLOCK ---
    */


    function initializeUIElements() {
        console.log("Initializing UI elements...");
        initializeDepartmentToggles();
        initializeSidebarCollapsibles(); // New function call
    }

    // --- Sidebar Collapsible Logic ---
    function initializeSidebarCollapsibles() {
        const collapsibleToggles = document.querySelectorAll('.sidebar-navigation .collapsible-toggle');
        collapsibleToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                this.parentElement.classList.toggle('open'); // Optional: for styling the whole section
                const content = this.nextElementSibling; // Assumes ul.collapsible-content-sidebar is next
                const icon = this.querySelector('.toggle-icon-sidebar');

                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                        icon.classList.add('rotated'); // For CSS rotation
                    }
                } else {
                    content.style.display = 'none';
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                        icon.classList.remove('rotated');
                    }
                }
            });
        });
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
            } else {
                if (filterButtons.length > 0) {
                    filterButtons[0].classList.add('active');
                    updateCategoryVisibility(filterButtons[0].dataset.filter);
                } else {
                     updateCategoryVisibility('all');
                }
            }
        } else {
            console.warn("Filter buttons or category sections not found. Filtering will not work.");
        }
    }
});
