document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper');
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; // Must match the key used in login.js

    // --- Mobile Sidebar Toggle Logic ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const leftSidebar = document.getElementById('leftSidebar');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const body = document.body;

    if (mobileMenuToggle && leftSidebar && mobileSidebarOverlay) {
        mobileMenuToggle.addEventListener('click', function() {
            body.classList.toggle('sidebar-open');
            const isOpen = body.classList.contains('sidebar-open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
            // Change icon based on state
            if (isOpen) {
                mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>'; // Close icon
                mobileMenuToggle.setAttribute('aria-label', 'Close menu');
            } else {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Hamburger icon
                mobileMenuToggle.setAttribute('aria-label', 'Open menu');
            }
        });

        mobileSidebarOverlay.addEventListener('click', function() {
            if (body.classList.contains('sidebar-open')) {
                body.classList.remove('sidebar-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Reset to Hamburger icon
                mobileMenuToggle.setAttribute('aria-label', 'Open menu');
            }
        });
    } else {
        console.warn("Mobile menu elements (toggle, sidebar, or overlay) not found.");
    }
    // --- End Mobile Sidebar Toggle Logic ---


    function isPortalAuthenticated() {
        const authenticated = sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
        console.log("Is portal authenticated (from session)?", authenticated);
        return authenticated;
    }

    if (isPortalAuthenticated()) {
        console.log("Portal is authenticated. Displaying content.");
        if (pageContentWrapper) {
            pageContentWrapper.style.display = 'block';
        } else {
            console.error("pageContentWrapper not found!");
        }
        if (rightSidebarContentWrapper) {
            rightSidebarContentWrapper.style.display = 'block';
        } else {
            console.error("rightSidebarContentWrapper not found!");
        }

        initializeUIElements();
    } else {
        console.log("Portal not authenticated. Redirecting to login page.");
        // Ensure this path is correct relative to where index.html is.
        // If they are in the same directory, 'login.html' is fine.
        window.location.href = 'login.html';
        return; // Stop further script execution on this page
    }

    function initializeUIElements() {
        console.log("Initializing UI elements (department toggles)...");
        initializeDepartmentToggles();
        // Add any other UI initializations here
    }

    // --- Department Filter Logic ---
    function initializeDepartmentToggles() {
        const filterButtons = document.querySelectorAll('.department-filter-controls .filter-btn');
        const categorySections = document.querySelectorAll('.categories-container .category-section');

        function updateCategoryVisibility(selectedFilter) {
            categorySections.forEach(section => {
                const category = section.dataset.category;
                if (selectedFilter === 'all' || category === selectedFilter) {
                    section.style.display = 'block'; // Or your preferred display type like 'flex', 'grid'
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

            // Set initial filter based on the button with 'active' class or default to the first/all
            const initialActiveFilterButton = document.querySelector('.department-filter-controls .filter-btn.active');
            if (initialActiveFilterButton) {
                updateCategoryVisibility(initialActiveFilterButton.dataset.filter);
            } else {
                // Default to the first button if no 'active' class is set in HTML
                if (filterButtons.length > 0) {
                    filterButtons[0].classList.add('active'); // Make the first button active
                    updateCategoryVisibility(filterButtons[0].dataset.filter);
                } else {
                     updateCategoryVisibility('all'); // Fallback if no buttons (shouldn't happen with current HTML)
                }
            }
        } else {
            console.warn("Filter buttons or category sections not found. Filtering will not work.");
        }
    }
});
