import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');
    if (error) {
      console.error("Fout bij laden:", error);
    } else {
      const formatted = data.map(r => ({
        id: r.id,
        title: `${r.object} (${r.name})`,
        start: `${r.date}T${r.start_time}`,
        end: `${r.date}T${r.end_time}`
      }));
      setEvents(formatted);
    }
  };

  const handleDateClick = async (info) => {
    const object = prompt("Welk object reserveren?");
    const name = prompt("Naam invullen:");
    if (!object || !name) return;

    const date = info.dateStr;
    const start_time = "08:00:00";
    const end_time = "09:00:00";

    const { data, error } = await supabase
      .from('reservations')
      .insert([{ object, name, date, start_time, end_time }])
      .select();

    if (error) {
      alert("Fout bij reserveren: " + error.message);
    } else {
      setEvents([...events, {
        id: data[0].id,
        title: `${data[0].object} (${data[0].name})`,
        start: `${date}T${start_time}`,
        end: `${date}T${end_time}`
      }]);
    }
  };

  return (
    <div className="calendar-container">
      <h1>Verhees Reserveringssysteem</h1>
      <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
}

export default App;
