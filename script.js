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
    // --- UNCOMMENT THIS BLOCK IF USING SEPARATE LOGIN PAGE ---
    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper'); 
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; 

    function isPortalAuthenticated() {
        const authenticated = sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
        return authenticated;
    }

    if (isPortalAuthenticated()) {
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block'; 
        initializeUIElements();
    } else {
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
            // Prevent attaching multiple listeners if this function is called again
            if (toggle.dataset.listenerAttached === 'true') return;

            toggle.addEventListener('click', function(event) {
                event.preventDefault(); 
                const parentNavSection = this.closest('.nav-section.collapsible');
                const content = this.nextElementSibling; // Assumes ul is direct sibling of h4
                const icon = this.querySelector('.toggle-icon-sidebar');

                if (content && parentNavSection && icon) {
                    parentNavSection.classList.toggle('open'); // For CSS to rotate icon

                    // Toggle display for the content
                    if (content.style.display === "none" || content.style.display === "") {
                        content.style.display = "block";
                        // Animate max-height for opening
                        // Set max-height to scrollHeight after display is block to get correct height
                        requestAnimationFrame(() => { // Ensure display change has rendered
                           content.style.maxHeight = content.scrollHeight + "px";
                        });
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        content.style.maxHeight = "0"; // Animate max-height for closing
                        // Listen for transition end to set display to none for accessibility
                        // and to ensure scrollHeight is 0 if re-opened before transition fully ends.
                        content.addEventListener('transitionend', function handler() {
                            content.style.display = "none";
                            content.removeEventListener('transitionend', handler);
                        });
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
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

            if (!content || !parentGroup || !icon) return;
            
            // Reset styles/classes before applying new state
            content.style.maxHeight = ""; 
            content.classList.remove('open-mobile', 'collapsed-mobile');
            parentGroup.classList.remove('open');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');

            if (window.innerWidth > mobileBreakpoint) {
                // DESKTOP: Ensure content is expanded
                content.style.display = 'block'; // Make sure it's visible
                content.style.maxHeight = content.scrollHeight + "px"; 
                parentGroup.classList.add('open'); 
            } else {
                // MOBILE: Set up for collapsing, ensure initially collapsed
                content.style.display = 'none'; // Start hidden on mobile
                parentGroup.classList.remove('open');

                const clickHandler = function(event) {
                    event.preventDefault();
                    parentGroup.classList.toggle('open'); 
                    
                    if (content.style.display === "none" || content.style.display === "") {
                        content.style.display = 'block';
                        requestAnimationFrame(() => {
                            content.style.maxHeight = content.scrollHeight + "px";
                        });
                        content.classList.add('open-mobile'); // Add class after display change for transition
                        content.classList.remove('collapsed-mobile');
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        content.style.maxHeight = null; // Start collapse animation
                        content.classList.remove('open-mobile');
                        content.classList.add('collapsed-mobile');
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                        // Set display to none after transition for accessibility and proper re-opening
                        content.addEventListener('transitionend', function handler() {
                            if (!content.classList.contains('open-mobile')) { // Check if it's still meant to be closed
                                content.style.display = "none";
                            }
                            content.removeEventListener('transitionend', handler);
                        }, { once: true }); // Ensure listener fires only once per transition
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
