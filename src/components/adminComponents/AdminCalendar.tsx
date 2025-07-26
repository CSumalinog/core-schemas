'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDialogue from './AdminCalendarDialog';
import EventPreviewPanel from './EventPreviewPanel';

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [editEvent, setEditEvent] = useState<EventInput | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="px-4 md:px-10 py-6 space-y-8">
        <FullCalendar
          key={currentEvents.length}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          events={currentEvents}
        />

        <div>
          <EventPreviewPanel
            events={currentEvents}
            onDelete={(id) =>
              setCurrentEvents((prev) =>
                prev.filter((event) => event.id !== id)
              )
            }
            onEdit={(event) => {
              // Your edit logic here, e.g., open dialog and populate form
              setSelectedDate({
                startStr: event.start as string,
                endStr: event.end as string,
                allDay: event.allDay ?? false,
                start: new Date(event.start as string),
                end: new Date(event.end as string),
                view: calendarRef.current?.getApi().view!, // if using ref
                jsEvent: null, // Added to satisfy DateSelectArg type
              });
              setEditEvent(event);
              setIsDialogOpen(true);
            }}
          />
        </div>
      </div>

      <EventDialogue
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedDate={selectedDate}
        onAddEvent={(data) => {
          if (!selectedDate) return;
          const newEvent = {
            id: `${selectedDate.startStr}-${data.title}`,
            title: data.title,
            start: selectedDate.startStr,
            end: selectedDate.endStr,
            allDay: selectedDate.allDay,
            ...data,
          };
          setCurrentEvents((prev) => [...prev, newEvent]);
        }}
      />
    </>
  );
};

export default Calendar;
