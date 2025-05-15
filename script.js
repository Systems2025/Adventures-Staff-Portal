document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    // --- Simplified visibility for non-login page setup ---
    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper'); 
    if (pageContentWrapper) pageContentWrapper.style.display = 'block';
    if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
    initializeUIElements();
    // --- End of simplified visibility ---

    /* --- Optional Login Page Auth Block (Keep commented or uncomment as needed) --- */

    function initializeUIElements() {
        console.log("Initializing UI elements...");
        initializeDepartmentToggles(); // For main content filters
        initializeSidebarCollapsibles(); // For left sidebar social links
        initializeWidgetCollapsibles(); // NEW: For right sidebar registration forms
        setupResponsiveCollapsibles(); // NEW: To manage mobile-only behavior
    }

    // --- Sidebar Collapsible Logic (Keep as is from previous full code) ---
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
                    parentNavSection.classList.toggle('open');
                    if (content.classList.contains('open')) { 
                        content.style.maxHeight = null; 
                        content.classList.remove('open');
                        icon.classList.remove('fa-chevron-up'); icon.classList.add('fa-chevron-down');
                    } else { 
                        content.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + "px"; 
                        icon.classList.remove('fa-chevron-down'); icon.classList.add('fa-chevron-up');
                    }
                }
            });
            toggle.dataset.listenerAttached = 'true';
        });
    }

    // --- Registration Forms Widget Collapsible Logic (Mobile Only) ---
    let widgetCollapsibleListeners = []; // To store references for removal

    function initializeWidgetCollapsibles() {
        removeWidgetCollapsibleListeners(); // Remove any existing listeners first

        const widgetCollapsibleToggles = document.querySelectorAll('.registration-forms-widget .collapsible-widget-toggle');
        const mobileBreakpoint = 768; // Define your mobile breakpoint

        widgetCollapsibleToggles.forEach(toggle => {
            const parentGroup = toggle.closest('.collapsible-widget-group');
            const content = toggle.nextElementSibling; // Assumes ul is direct sibling of h4

            if (!content || !parentGroup) {
                console.warn("Widget collapsible content or parent group not found for toggle:", toggle);
                return;
            }

            // Default state for desktop: expanded, no toggle icon functionality needed by JS here
            // (CSS hides the icon on desktop)
            if (window.innerWidth > mobileBreakpoint) {
                content.style.maxHeight = content.scrollHeight + "px"; // Ensure expanded on desktop
                content.classList.add('open');
                parentGroup.classList.add('open'); // For icon rotation if any
                // Toggle icon is hidden by CSS on desktop, so no JS needed to manage it here
            } else {
                // Mobile state: collapsed by default (max-height: 0 from CSS)
                content.style.maxHeight = null;
                content.classList.remove('open');
                parentGroup.classList.remove('open');
                const icon = toggle.querySelector('.toggle-icon-widget');
                if(icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }

                // Add listener only for mobile
                const clickHandler = function(event) {
                    event.preventDefault();
                    parentGroup.classList.toggle('open');
                    const currentIcon = this.querySelector('.toggle-icon-widget');

                    if (content.classList.contains('open')) {
                        content.style.maxHeight = null;
                        content.classList.remove('open');
                        if (currentIcon) {
                            currentIcon.classList.remove('fa-chevron-up');
                            currentIcon.classList.add('fa-chevron-down');
                        }
                    } else {
                        content.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + "px";
                        if (currentIcon) {
                            currentIcon.classList.remove('fa-chevron-down');
                            currentIcon.classList.add('fa-chevron-up');
                        }
                    }
                };
                
                toggle.addEventListener('click', clickHandler);
                widgetCollapsibleListeners.push({ element: toggle, type: 'click', handler: clickHandler });
            }
        });
    }

    function removeWidgetCollapsibleListeners() {
        widgetCollapsibleListeners.forEach(listener => {
            listener.element.removeEventListener(listener.type, listener.handler);
        });
        widgetCollapsibleListeners = []; // Clear the array
    }

    function setupResponsiveCollapsibles() {
        initializeWidgetCollapsibles(); // Initial setup
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log("Resizing, re-initializing widget collapsibles");
                initializeWidgetCollapsibles(); // Re-evaluate on resize
            }, 250); // Debounce resize event
        });
    }


    // --- Department Filter Logic (Keep as is from previous) ---
    function initializeDepartmentToggles() {
        // ... (existing department filter logic) ...
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
