document.addEventListener('DOMContentLoaded', function() {
    // --- Calendar Code ---
    const monthYearElement = document.getElementById('monthYear');
    const calendarDaysElement = document.getElementById('calendarDays');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    let currentDate = new Date();

    function renderCalendar() {
        if (!monthYearElement || !calendarDaysElement) return; // Guard if elements don't exist

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

    // Initialize calendar only if elements exist (they might not if portal not unlocked)
    if (monthYearElement && calendarDaysElement && prevMonthButton && nextMonthButton) {
        // Calendar listeners will be added here, but initial render might depend on portal unlock
        prevMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }


    // --- Global Page Password & Department Link Toggle Logic ---
    const pageContentWrapper = document.getElementById('pageContentWrapper');
    const globalPasswordModal = document.getElementById('globalPasswordModal');
    const globalPasswordInput = document.getElementById('globalPasswordInput');
    const submitGlobalPasswordButton = document.getElementById('submitGlobalPasswordButton');
    const globalPasswordErrorP = document.getElementById('globalPasswordError');

    const PORTAL_PASSWORD = "BSK@2025#"; // The global password
    const PORTAL_UNLOCKED_KEY = 'portalUnlocked_v1'; // Added version to bust old storage if needed

    function isPortalUnlocked() {
        return sessionStorage.getItem(PORTAL_UNLOCKED_KEY) === 'true';
    }

    function unlockPortal() {
        sessionStorage.setItem(PORTAL_UNLOCKED_KEY, 'true');
        globalPasswordModal.style.display = 'none';
        pageContentWrapper.style.display = 'block';
        initializeDepartmentToggles();

        // Render calendar now that its container is visible
        if (monthYearElement && calendarDaysElement && !calendarDaysElement.hasChildNodes()) {
            renderCalendar();
        }
    }

    function showGlobalPasswordModal() {
        globalPasswordModal.style.display = 'block'; // Or 'flex' if using flex to center
        if(globalPasswordInput) globalPasswordInput.focus();
    }

    // Check on load
    if (isPortalUnlocked()) {
        unlockPortal();
    } else {
        showGlobalPasswordModal();
    }

    if(submitGlobalPasswordButton) {
        submitGlobalPasswordButton.addEventListener('click', () => {
            if (globalPasswordInput.value === PORTAL_PASSWORD) {
                globalPasswordErrorP.textContent = '';
                unlockPortal();
            } else {
                globalPasswordErrorP.textContent = 'Incorrect password. Please try again.';
                globalPasswordInput.value = '';
                globalPasswordInput.focus();
            }
        });
    }

    if(globalPasswordInput) {
        globalPasswordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if(submitGlobalPasswordButton) submitGlobalPasswordButton.click();
            }
        });
    }

    function initializeDepartmentToggles() {
        const allDepartmentBlocks = document.querySelectorAll('.department-block');
        allDepartmentBlocks.forEach(block => {
            block.addEventListener('click', () => {
                const departmentId = block.dataset.department;
                const targetLinksWrapper = document.querySelector(`.department-links-wrapper[data-department-content="${departmentId}"]`);

                if (targetLinksWrapper) {
                    const isActive = targetLinksWrapper.classList.contains('active');

                    document.querySelectorAll('.department-links-wrapper.active').forEach(activeWrapper => {
                        if (activeWrapper !== targetLinksWrapper) {
                            activeWrapper.classList.remove('active');
                        }
                    });

                    if (isActive) {
                        targetLinksWrapper.classList.remove('active');
                    } else {
                        targetLinksWrapper.classList.add('active');
                    }
                }
            });
        });

        // Ensure all link wrappers start hidden after portal unlock
        document.querySelectorAll('.department-links-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
    }
});
