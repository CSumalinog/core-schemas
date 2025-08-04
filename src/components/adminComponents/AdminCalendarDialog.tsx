'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DateSelectArg } from '@fullcalendar/core';

interface EventDialogueProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedDate: DateSelectArg | null;
  isAdmin?: boolean;
  onAddEvent: (data: any) => void;
  onAddTask?: (task: any) => void;
}

export default function EventDialogue({
  isDialogOpen,
  setIsDialogOpen,
  selectedDate,
  isAdmin = true,
  onAddEvent,
  onAddTask,
}: EventDialogueProps) {
  const [activeTab, setActiveTab] = useState<'event' | 'task'>('event');

  const [eventData, setEventData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  const [taskData, setTaskData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    staffer: '',
    contact: '',
  });

  const resetForms = () => {
    setEventData({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
    });
    setTaskData({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      staffer: '',
      contact: '',
    });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleWithTime = `${eventData.title} (${eventData.startTime} - ${eventData.endTime})`;

    onAddEvent({
      ...eventData,
      title: titleWithTime,
      start: selectedDate?.startStr,
      end: selectedDate?.endStr || selectedDate?.startStr,
      allDay: selectedDate?.allDay,
    });

    resetForms();
    setIsDialogOpen(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskWithTime = {
      ...taskData,
      task: true,
      title: `${taskData.title} (${taskData.startTime} - ${taskData.endTime})`,
      start: selectedDate?.startStr,
      end: selectedDate?.endStr || selectedDate?.startStr,
      allDay: selectedDate?.allDay,
    };

    if (onAddTask) {
      onAddTask(taskWithTime);
    } else {
      console.warn('Task handler not provided:', taskWithTime);
    }

    resetForms();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogDescription>
            {selectedDate && (
              <span>
                Selected Date:{' '}
                {new Date(selectedDate.startStr).toLocaleDateString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="event"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'event' | 'task')}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="task">Task</TabsTrigger>
          </TabsList>

          {/* ───── EVENT FORM ───── */}
          <TabsContent value="event">
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={eventData.title}
                onChange={(e) =>
                  setEventData({ ...eventData, title: e.target.value })
                }
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  className="w-full p-2 border rounded"
                  value={eventData.startTime}
                  onChange={(e) =>
                    setEventData({ ...eventData, startTime: e.target.value })
                  }
                  required
                />
                <span className="text-gray-500">–</span>
                <input
                  type="time"
                  className="w-full p-2 border rounded"
                  value={eventData.endTime}
                  onChange={(e) =>
                    setEventData({ ...eventData, endTime: e.target.value })
                  }
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 border rounded"
                value={eventData.location}
                onChange={(e) =>
                  setEventData({ ...eventData, location: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={eventData.description}
                onChange={(e) =>
                  setEventData({ ...eventData, description: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </TabsContent>

          {/* ───── TASK FORM ───── */}
          <TabsContent value="task">
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full p-2 border rounded"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData({ ...taskData, title: e.target.value })
                }
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  className="w-full p-2 border rounded"
                  value={taskData.startTime}
                  onChange={(e) =>
                    setTaskData({ ...taskData, startTime: e.target.value })
                  }
                  required
                />
                <span className="text-gray-500">–</span>
                <input
                  type="time"
                  className="w-full p-2 border rounded"
                  value={taskData.endTime}
                  onChange={(e) =>
                    setTaskData({ ...taskData, endTime: e.target.value })
                  }
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 border rounded"
                value={taskData.location}
                onChange={(e) =>
                  setTaskData({ ...taskData, location: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={taskData.description}
                onChange={(e) =>
                  setTaskData({ ...taskData, description: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={taskData.staffer}
                onChange={(e) =>
                  setTaskData({ ...taskData, staffer: e.target.value })
                }
              >
                <option value="">Assign Staffer</option>
                <option value="Writer">Writer</option>
                <option value="Photographer">Photographer</option>
              </select>
              <input
                type="text"
                placeholder="Contact Person"
                className="w-full p-2 border rounded"
                value={taskData.contact}
                onChange={(e) =>
                  setTaskData({ ...taskData, contact: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
