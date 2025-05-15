document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    // --- Simplified visibility for non-login page setup ---
    // If using a separate login page, comment out these lines and uncomment the auth block below.
    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper'); 
    if (pageContentWrapper) pageContentWrapper.style.display = 'block';
    if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
    initializeUIElements();
    // --- End of simplified visibility ---

    /* 
    // --- UNCOMMENT THIS BLOCK IF USING SEPARATE LOGIN PAGE (login.html, login.js, login.css) ---
    // AND ensure pageContentWrapper & rightSidebarContentWrapper are style="display:none;" in index.html or style.css
    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper'); 
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; // Must match the key used in login.js

    function isPortalAuthenticated() {
        const authenticated = sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
        // console.log("Is portal authenticated (from session)?", authenticated);
        return authenticated;
    }

    if (isPortalAuthenticated()) {
        // console.log("Portal is authenticated. Displaying content.");
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block'; 
        initializeUIElements();
    } else {
        // console.log("Portal not authenticated. Redirecting to login page.");
        window.location.href = 'login.html'; 
        return; 
    }
    // --- END OF LOGIN PAGE AUTHENTICATION BLOCK ---
    */


    function initializeUIElements() {
        console.log("Initializing UI elements...");
        initializeDepartmentToggles();
        initializeSidebarCollapsibles(); 
        setupResponsiveWidgetCollapsibles();
    }

    // --- Sidebar Collapsible Logic (for social links) ---
    function initializeSidebarCollapsibles() {
        const collapsibleToggles = document.querySelectorAll('.sidebar-navigation .collapsible-toggle');
        
        collapsibleToggles.forEach(toggle => {
            if (toggle.dataset.listenerAttached === 'true') return;

            toggle.addEventListener('click', function(event) {
                event.preventDefault(); 
                const parentNavSection = this.closest('.nav-section.collapsible');
                const content = this.nextElementSibling; 
                const icon = this.querySelector('.toggle-icon-sidebar');

                if (content && parentNavSection && icon) {
                    parentNavSection.classList.toggle('open'); // For CSS to rotate icon

                    if (content.classList.contains('open')) { 
                        content.style.maxHeight = null; 
                        content.classList.remove('open');
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    } else { 
                        content.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + "px"; 
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            });
            toggle.dataset.listenerAttached = 'true';
        });
    }

    // --- Registration Forms Widget Collapsible Logic (Mobile Only) ---
    let widgetCollapsibleHandlers = []; 

    function applyWidgetCollapsibleBehavior() {
        removeWidgetCollapsibleListeners(); 

        const widgetCollapsibleToggles = document.querySelectorAll('.registration-forms-widget .collapsible-widget-toggle');
        const mobileBreakpoint = 768;

        widgetCollapsibleToggles.forEach(toggle => {
            const parentGroup = toggle.closest('.collapsible-widget-group');
            const content = toggle.nextElementSibling; 
            const icon = toggle.querySelector('.toggle-icon-widget');

            if (!content || !parentGroup || !icon) {
                console.warn("Widget collapsible elements not found for a toggle.");
                return;
            }
            
            // Reset classes for accurate state detection
            content.classList.remove('open-mobile', 'collapsed-mobile');
            parentGroup.classList.remove('open');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');


            if (window.innerWidth > mobileBreakpoint) {
                // DESKTOP: Ensure content is expanded
                content.style.maxHeight = content.scrollHeight + "px"; 
                content.classList.add('open-mobile'); // Use distinct class for JS logic if needed
                parentGroup.classList.add('open'); // For icon rotation via CSS if any
            } else {
                // MOBILE: Set up for collapsing
                content.style.maxHeight = null; // Will be handled by .collapsed-mobile or set on open
                content.classList.add('collapsed-mobile'); 
                parentGroup.classList.remove('open');

                const clickHandler = function(event) {
                    event.preventDefault();
                    parentGroup.classList.toggle('open'); // For icon rotation
                    
                    if (content.classList.contains('open-mobile')) {
                        content.style.maxHeight = null;
                        content.classList.remove('open-mobile');
                        content.classList.add('collapsed-mobile');
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    } else {
                        content.classList.remove('collapsed-mobile');
                        content.classList.add('open-mobile');
                        content.style.maxHeight = content.scrollHeight + "px";
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                };
                toggle.addEventListener('click', clickHandler);
                widgetCollapsibleHandlers.push({ element: toggle, type: 'click', handler: clickHandler });
            }
        });
    }

    function removeWidgetCollapsibleListeners() {
        widgetCollapsibleHandlers.forEach(item => {
            item.element.removeEventListener(item.type, item.handler);
        });
        widgetCollapsibleHandlers = [];
    }

    function setupResponsiveWidgetCollapsibles() {
        applyWidgetCollapsibleBehavior(); 
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log("Resizing, re-applying widget collapsible behavior");
                applyWidgetCollapsibleBehavior(); 
            }, 250); 
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
