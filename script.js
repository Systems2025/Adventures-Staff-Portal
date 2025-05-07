document.addEventListener('DOMContentLoaded', function() {
    console.log("Main portal (index.html) DOM loaded.");

    const pageContentWrapper = document.getElementById('pageContentWrapper');
    // The key must exactly match the one used in login.js
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v3'; 

    function isPortalAuthenticated() {
        const authenticated = sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
        console.log("Is portal authenticated (from session)?", authenticated);
        return authenticated;
    }

    if (isPortalAuthenticated()) {
        console.log("Portal is authenticated. Displaying content.");
        if (pageContentWrapper) {
            pageContentWrapper.style.display = 'block';
            initializeUIElements(); // Function to setup department toggles and calendar
        } else {
            console.error("pageContentWrapper not found! Cannot display content.");
        }
    } else {
        console.log("Portal not authenticated. Redirecting to login page.");
        // Adjust 'login.html' if your login page has a different name or path
        window.location.href = 'login.html'; 
        return; // Stop further script execution on this page as it will redirect
    }

    function initializeUIElements() {
        console.log("Initializing UI elements (department toggles, calendar)...");
        initializeDepartmentToggles();
        initializeCalendar(); // Call to set up the calendar
    }

    // --- Calendar Code ---
    function initializeCalendar() {
        const monthYearElement = document.getElementById('monthYear');
        const calendarDaysElement = document.getElementById('calendarDays');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');
        let currentDate = new Date();

        function renderCalendar() {
            if (!monthYearElement || !calendarDaysElement) {
                console.warn("Calendar elements not found for rendering.");
                return;
            }
            
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth(); 

            monthYearElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
            calendarDaysElement.innerHTML = '';

            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);
            const lastDayOfPrevMonth = new Date(year, month, 0);

            const firstDayIndex = firstDayOfMonth.getDay(); 
            const lastDateOfMonth = lastDayOfMonth.getDate();
            const lastDateOfPrevMonth = lastDayOfPrevMonth.getDate();

            for (let i = firstDayIndex; i > 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.textContent = lastDateOfPrevMonth - i + 1;
                dayElement.classList.add('other-month-day');
                calendarDaysElement.appendChild(dayElement);
            }

            const today = new Date();
            for (let i = 1; i <= lastDateOfMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.textContent = i;
                if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                    dayElement.classList.add('today');
                }
                calendarDaysElement.appendChild(dayElement);
            }

            const totalDaysRendered = firstDayIndex + lastDateOfMonth;
            const remainingDays = (7 - (totalDaysRendered % 7)) % 7; 

            for (let i = 1; i <= remainingDays; i++) {
                 const dayElement = document.createElement('div');
                dayElement.textContent = i;
                dayElement.classList.add('other-month-day');
                calendarDaysElement.appendChild(dayElement);
            }
        }

        if (monthYearElement && calendarDaysElement && prevMonthButton && nextMonthButton) {
            console.log("Attaching calendar navigation listeners.");
            prevMonthButton.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
            nextMonthButton.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
            renderCalendar(); // Initial render now that content is shown
        } else {
            console.warn("One or more calendar elements not found for initialization.");
        }
    }


    // --- Department Link Toggling ---
    function initializeDepartmentToggles() {
        console.log("Initializing department toggles...");
        const allDepartmentBlocks = document.querySelectorAll('.department-block');
        console.log("Found department blocks:", allDepartmentBlocks.length);

        allDepartmentBlocks.forEach(block => {
            block.addEventListener('click', () => {
                const departmentId = block.dataset.department;
                console.log("Department block clicked:", departmentId);
                const targetLinksWrapper = document.querySelector(`.department-links-wrapper[data-department-content="${departmentId}"]`);

                if (targetLinksWrapper) {
                    const isActive = targetLinksWrapper.classList.contains('active');
                    console.log("Target links wrapper:", targetLinksWrapper, "Is active?", isActive);

                    // Hide all OTHER active link wrappers
                    document.querySelectorAll('.department-links-wrapper.active').forEach(activeWrapper => {
                        if (activeWrapper !== targetLinksWrapper) {
                            console.log("Deactivating other wrapper:", activeWrapper);
                            activeWrapper.classList.remove('active');
                        }
                    });

                    // Toggle the clicked one
                    if (isActive) {
                        console.log("Deactivating target wrapper.");
                        targetLinksWrapper.classList.remove('active');
                    } else {
                        console.log("Activating target wrapper.");
                        targetLinksWrapper.classList.add('active');
                    }
                } else {
                    console.warn("No links wrapper found for department:", departmentId);
                }
            });
        });

        // Ensure all link wrappers start hidden
        document.querySelectorAll('.department-links-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
        console.log("All department link wrappers initialized to hidden.");
    }
});
