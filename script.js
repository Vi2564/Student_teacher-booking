document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const studentNameInput = document.getElementById('student-name');
    const messageDisplay = document.getElementById('message');

    // This is a placeholder for your backend API endpoint.
    // Replace with your actual server URL if you have one.
    const API_URL = 'http://localhost:3000/api/schedule';

    // Function to fetch and display the schedule
    async function fetchSchedule() {
        try {
            const response = await fetch(API_URL);
            const schedule = await response.json();
            renderSchedule(schedule);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            messageDisplay.textContent = 'Failed to load schedule. Please try again later.';
        }
    }

    // Function to render the slots on the page
    function renderSchedule(schedule) {
        scheduleContainer.innerHTML = '';
        if (schedule.length === 0) {
            messageDisplay.textContent = 'No available slots at this time.';
            return;
        }

        schedule.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('slot', slot.available ? 'available' : 'booked');
            slotDiv.textContent = slot.time;
            slotDiv.dataset.slotId = slot.id;

            if (slot.available) {
                slotDiv.addEventListener('click', () => {
                    bookAppointment(slot.id);
                });
            }

            scheduleContainer.appendChild(slotDiv);
        });
    }

    // Function to handle the booking request
    async function bookAppointment(slotId) {
        const studentName = studentNameInput.value.trim();
        if (!studentName) {
            messageDisplay.textContent = 'Please enter your name to book an appointment.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: slotId, studentName: studentName })
            });

            const result = await response.json();
            if (response.ok) {
                messageDisplay.textContent = `Success! Appointment booked for ${result.slot.time}.`;
                messageDisplay.style.color = '#155724';
                fetchSchedule(); // Refresh the list to show the booked slot
            } else {
                messageDisplay.textContent = `Booking failed: ${result.message}`;
                messageDisplay.style.color = '#721c24';
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            messageDisplay.textContent = 'An unexpected error occurred. Please try again.';
            messageDisplay.style.color = '#721c24';
        }
    }

    // Initial call to load the schedule when the page loads
    fetchSchedule();
});