const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'timeGridWeek',  // start direct met weekrooster
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay' // knoppen: maand, week, dag
  },
  selectable: true,
  select: function(info) {
    // Wordt getriggerd als je met de muis een blok selecteert
    const startDate = info.startStr.split("T")[0];
    reservationDateInput.value = startDate;

    // Simpel tijdslot maken obv uur van selectie
    const hour = new Date(info.start).getHours();
    if (hour < 12) {
      form.elements["timeslot"].value = "Ochtend";
    } else {
      form.elements["timeslot"].value = "Middag";
    }

    modal.style.display = 'block';
  },
  events: async function(fetchInfo, successCallback, failureCallback) {
    try {
      const res = await fetch('/api/reservations');
      const reservations = await res.json();
      const events = reservations.map(r => ({
        title: `${r.object} (${r.name})`,
        start: r.date,   // hier kun je nog uitbreiden naar uren
        allDay: false
      }));
      successCallback(events);
    } catch (err) {
      failureCallback(err);
    }
  }
});
