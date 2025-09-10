document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const modal = document.getElementById('reservationModal');
  const form = document.getElementById('reservationForm');
  const reservationDateInput = document.getElementById('reservationDate');
  const closeModalBtn = document.getElementById('closeModal');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    selectable: true,
    dateClick: function(info) {
      reservationDateInput.value = info.dateStr;
      modal.style.display = 'block';
    },
    events: async function(fetchInfo, successCallback, failureCallback) {
      try {
        const res = await fetch('/api/reservations');
        const reservations = await res.json();
        const events = reservations.map(r => ({
          title: `${r.object} - ${r.timeslot} (${r.name})`,
          start: r.date
        }));
        successCallback(events);
      } catch (err) {
        failureCallback(err);
      }
    }
  });

  calendar.render();

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const body = {
      object: formData.get('object'),
      date: formData.get('date'),
      timeslot: formData.get('timeslot'),
      name: formData.get('name')
    };

    await fetch('/api/reservations', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    form.reset();
    modal.style.display = 'none';
    calendar.refetchEvents();
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});
