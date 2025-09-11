document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const modal = document.getElementById("reservationModal");
  const form = document.getElementById("reservationForm");
  const closeModalBtn = document.getElementById("closeModal");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    slotDuration: "01:00:00",
    allDaySlot: false,
    expandRows: true,
    height: "auto",
    nowIndicator: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    selectMirror: true,
    select: function(info) {
      document.getElementById("reservationDate").value = info.startStr.split("T")[0];
      document.getElementById("reservationStart").value = info.start.toISOString().substring(11,16);
      document.getElementById("reservationEnd").value = info.end.toISOString().substring(11,16);
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
        console.error("Fout bij ophalen:", err);
        failureCallback(err);
      }
    }
  });

  calendar.render();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        modal.style.display = 'none';
        form.reset();
        calendar.refetchEvents();
      } else {
        const errMsg = await res.text();
        alert("Fout bij opslaan reservering: " + errMsg);
      }
    } catch (err) {
      alert("Netwerkfout: " + err);
    }
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = 'none';
  });
});
