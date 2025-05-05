document.addEventListener('DOMContentLoaded', function() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarDaysElement = document.getElementById('calendarDays');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDate = new Date();

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0 = January, 11 = December

        // Set Month and Year in Header
        monthYearElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        // Clear previous calendar days
        calendarDaysElement.innerHTML = '';

        // Get calendar boundaries
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfPrevMonth = new Date(year, month, 0);

        const firstDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday
        const lastDateOfMonth = lastDayOfMonth.getDate();
        const lastDateOfPrevMonth = lastDayOfPrevMonth.getDate();

        // Add days from the previous month
        for (let i = firstDayIndex; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.textContent = lastDateOfPrevMonth - i + 1;
            dayElement.classList.add('other-month-day');
            calendarDaysElement.appendChild(dayElement);
        }

        // Add days of the current month
        const today = new Date(); // Get today's date for highlighting
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            // Highlight today's date
            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                dayElement.classList.add('today');
            }
            calendarDaysElement.appendChild(dayElement);
        }

        // Add days from the next month to fill the grid
        const totalDaysRendered = firstDayIndex + lastDateOfMonth;
        const remainingDays = (7 - (totalDaysRendered % 7)) % 7; // Days needed to complete the last week

        for (let i = 1; i <= remainingDays; i++) {
             const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('other-month-day');
            calendarDaysElement.appendChild(dayElement);
        }
    }

    // Event Listeners for month navigation
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
});