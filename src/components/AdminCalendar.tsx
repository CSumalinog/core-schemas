'use client';

import React, { useState, useEffect } from 'react';
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    setSelectedDate(selectInfo.start);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle('');
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'?`
      )
    ) {
      selected.event.remove();
    }
  };
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate?.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate,
        end: selectedDate,
        allDay: true,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <>
      <div className="px-4 md:px-10 py-6 space-y-8">
        <div>
          <FullCalendar
            height={'100vh'}
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
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={
              typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('events') || '[]')
                : []
            }
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Scheduled Events</h2>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italice text-center text-gray-400">
                No events scheduled
              </div>
            )}
            {currentEvents.length > 0 &&
              currentEvents.map((event: EventApi) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                  key={event.id}
                >
                  {event.title} <br />
                  <label className="text-slate-950">
                    {formatDate(event.start!, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Add a new event to the calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            /> 
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Event
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
