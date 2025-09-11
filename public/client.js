const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'timeGridWeek', 
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  selectable: true,
  select: function(info) {
    // Formulier tonen met start en eindtijd
    document.getElementById("reservationDate").value = info.startStr.split("T")[0];
    document.getElementById("reservationStart").value = info.start.toISOString().substring(11,16); // hh:mm
    document.getElementById("reservationEnd").value = info.end.toISOString().substring(11,16); // hh:mm
    modal.style.display = 'block';
  },
  events: async function(fetchInfo, successCallback, failureCallback) {
    try {
      const res = await fetch('/api/reservations');
      const reservations = await res.json();
      const events = reservations.map(r => ({
        title: `${r.object} (${r.name})`,
        start: `${r.date}T${r.start_time}`,
        end: `${r.date}T${r.end_time}`
      }));
      successCallback(events);
    } catch (err) {
      failureCallback(err);
    }
  }
});
