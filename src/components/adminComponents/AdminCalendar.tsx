'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import EventDialogue from './AdminCalendarDialog';
import PreviewPanel from './PreviewPanel';

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [editEvent, setEditEvent] = useState<EventInput | null>(null);

  // Load saved events from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setEditEvent(null); // Reset edit mode
    setIsDialogOpen(true);
  };

  const handleEventDrop = (info: any) => {
    const updatedEvents = currentEvents.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.startStr,
            end: info.event.endStr,
          }
        : event
    );
    setCurrentEvents(updatedEvents);
  };

  const handleEventResize = (info: any) => {
    const updatedEvents = currentEvents.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.startStr,
            end: info.event.endStr,
          }
        : event
    );
    setCurrentEvents(updatedEvents);
  };

  const getEventClassNames = (arg: any) => {
    const isTask = arg.event.extendedProps.task;
    return isTask ? 'task-event' : 'calendar-event';
  };

  return (
    <>
      <style jsx global>{`
        .task-event {
          background-color: #facc15 !important;
          color: #000 !important;
        }
        .calendar-event {
          background-color: #3b82f6 !important;
          color: #fff !important;
        }
      `}</style>

      <div className="px-4 md:px-10 py-6 space-y-8">
        <FullCalendar
          key={currentEvents.length}
          ref={calendarRef}
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
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventResizableFromStart={true}
          eventClassNames={getEventClassNames}
        />

        <PreviewPanel
          events={currentEvents}
          onDelete={(id) =>
            setCurrentEvents((prev) => prev.filter((event) => event.id !== id))
          }
          onEdit={(event) => {
            setSelectedDate({
              startStr: event.start as string,
              endStr: event.end as string,
              allDay: event.allDay ?? false,
              start: new Date(event.start as string),
              end: new Date(event.end as string),
              view: calendarRef.current?.getApi().view!,
              jsEvent: {} as any,
            });
            setEditEvent(event);
            setIsDialogOpen(true);
          }}
        />
      </div>

      <EventDialogue
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedDate={selectedDate}
        onAddEvent={(data) => {
          if (!selectedDate) return;

          const isEditing = !!editEvent;
          const eventId = isEditing
            ? editEvent!.id
            : `${selectedDate.startStr}-${data.title}`;

          const newEvent: EventInput = {
            id: eventId,
            start: selectedDate.startStr,
            end: selectedDate.endStr || selectedDate.startStr,
            allDay: selectedDate.allDay,
            ...data,
          };

          setCurrentEvents((prev) =>
            isEditing
              ? prev.map((event) => (event.id === eventId ? newEvent : event))
              : [...prev, newEvent]
          );
        }}
        onAddTask={(task) => {
          if (!selectedDate) return;

          const isEditing = !!editEvent;
          const taskId = isEditing
            ? editEvent!.id
            : `${selectedDate.startStr}-${task.title}`;

          const newTask: EventInput = {
            id: taskId,
            start: selectedDate.startStr,
            end: selectedDate.endStr || selectedDate.startStr,
            allDay: selectedDate.allDay,
            task: true,
            ...task,
          };

          setCurrentEvents((prev) =>
            isEditing
              ? prev.map((event) => (event.id === taskId ? newTask : event))
              : [...prev, newTask]
          );
        }}
      />
    </>
  );
};

export default Calendar;
