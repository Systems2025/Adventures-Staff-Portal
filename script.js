document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper'); 
    
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; // Must match the key used in login.js

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
        window.location.href = 'login.html'; 
        return; 
    }

    function initializeUIElements() {
        console.log("Initializing UI elements (department toggles)...");
        initializeDepartmentToggles();
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
