document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const rightSidebarContentWrapper = document.getElementById('rightSidebarContentWrapper');

    // Simplified visibility for non-login page setup
    if (pageContentWrapper) pageContentWrapper.style.display = 'block';
    if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
    initializeUIElements();

    /*
    // --- UNCOMMENT THIS BLOCK IF USING SEPARATE LOGIN PAGE ---
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3';
    function isPortalAuthenticated() {
        return sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
    }

    if (isPortalAuthenticated()) {
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
        initializeUIElements();
    } else {
        // window.location.href = 'login.html'; // Redirect to login page
        // return; // Stop further execution
        // For testing without login, temporarily show content and init UI
        console.warn("Authentication bypassed for testing. Login page logic is commented out.");
        if (pageContentWrapper) pageContentWrapper.style.display = 'block';
        if (rightSidebarContentWrapper) rightSidebarContentWrapper.style.display = 'block';
        initializeUIElements();
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
                const content = this.nextElementSibling; // Assumes ul is direct sibling of h4
                const icon = this.querySelector('.toggle-icon-sidebar');

                if (content && parentNavSection && icon) {
                    parentNavSection.classList.toggle('open'); // For CSS to rotate icon (if .open class is used)

                    if (content.style.display === "none" || content.style.display === "") {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                        content.style.display = "block";
                        requestAnimationFrame(() => { // Ensure display change has rendered
                           content.style.maxHeight = content.scrollHeight + "px";
                        });
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                        content.style.maxHeight = "0";
                        content.addEventListener('transitionend', function handler() {
                            // Only set display to none if it's still intended to be closed
                            if (content.style.maxHeight === "0px") {
                                content.style.display = "none";
                            }
                            content.removeEventListener('transitionend', handler);
                        }, { once: true });
                    }
                }
            });
            toggle.dataset.listenerAttached = 'true';
        });
    }

    // --- Registration Forms Widget Collapsible Logic (Responsive) ---
    let widgetCollapsibleHandlers = [];

    function applyWidgetCollapsibleBehavior() {
        removeWidgetCollapsibleListeners();

        const widgetCollapsibleToggles = document.querySelectorAll('.registration-forms-widget .collapsible-widget-toggle');
        const mobileBreakpoint = 768; // Same as CSS media query breakpoint

        widgetCollapsibleToggles.forEach(toggle => {
            const parentGroup = toggle.closest('.collapsible-widget-group');
            const content = toggle.nextElementSibling; // ul.widget-links-list.collapsible-widget-content
            const icon = toggle.querySelector('.toggle-icon-widget');

            if (!content || !parentGroup || !icon) {
                console.warn("Skipping widget: missing elements for", toggle);
                return;
            }
            
            // Ensure CSS transition is present on the content element
            // content.style.transition = 'max-height 0.35s ease-out, padding-top 0.35s ease-out, padding-bottom 0.35s ease-out';


            if (window.innerWidth > mobileBreakpoint) {
                // DESKTOP: Always open
                parentGroup.classList.add('open');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                content.style.display = 'block';
                content.style.maxHeight = content.scrollHeight + 'px';
                // Remove any mobile click listener
                // (already handled by removeWidgetCollapsibleListeners)
            } else {
                // MOBILE: Collapsible
                // Set initial state based on whether .open class is already there (e.g. from previous interaction)
                // or default to closed if no .open class.
                const isInitiallyOpen = parentGroup.classList.contains('open');

                if (isInitiallyOpen) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                    content.style.display = 'block';
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                    content.style.maxHeight = '0';
                    content.style.display = 'none';
                }

                const clickHandler = function(event) {
                    event.preventDefault();
                    const isOpen = parentGroup.classList.toggle('open');

                    if (isOpen) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                        content.style.display = 'block';
                        requestAnimationFrame(() => {
                            content.style.maxHeight = content.scrollHeight + 'px';
                        });
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                        content.style.maxHeight = '0';
                        content.addEventListener('transitionend', function transitionEnd() {
                            if (!parentGroup.classList.contains('open')) {
                                content.style.display = 'none';
                            }
                            content.removeEventListener('transitionend', transitionEnd);
                        }, { once: true });
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
        applyWidgetCollapsibleBehavior(); // Initial setup
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

            // Set initial view based on the 'active' button or default to 'all'
            const initialActiveFilterButton = document.querySelector('.department-filter-controls .filter-btn.active');
            if (initialActiveFilterButton) {
                updateCategoryVisibility(initialActiveFilterButton.dataset.filter);
            } else if (filterButtons.length > 0) { // If no explicit active, make the first one active
                filterButtons[0].classList.add('active');
                updateCategoryVisibility(filterButtons[0].dataset.filter);
            } else { // Fallback if no buttons at all (should not happen with current HTML)
                 updateCategoryVisibility('all');
            }
        } else {
            console.warn("Filter buttons or category sections not found. Filtering will not work.");
        }
    }
});
