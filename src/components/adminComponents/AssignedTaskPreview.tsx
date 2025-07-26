'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal } from 'lucide-react';

import { EventInput } from '@fullcalendar/core';
import { formatDate } from '@fullcalendar/core';

interface EventPreviewPanelProps {
  events: EventInput[];
  onDelete: (id: string) => void;
  onEdit?: (event: EventInput) => void;
}

export default function EventPreviewPanel({
  events,
  onDelete,
  onEdit,
}: EventPreviewPanelProps) {
  const [eventToDelete, setEventToDelete] = useState<EventInput | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const groupedEvents = events.reduce<Record<string, EventInput[]>>(
    (acc, event) => {
      const date = new Date(event.start as string).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {}
  );

  const renderTable = (filteredEvents: EventInput[], isTask = false) => {
    const grouped = filteredEvents.reduce<Record<string, EventInput[]>>(
      (acc, event) => {
        const date = new Date(event.start as string).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
      },
      {}
    );

    return Object.entries(grouped).map(([date, dateEvents]) => (
      <div
        key={date}
        className="mb-6 border border-neutral-200 rounded-lg p-4 shadow-sm bg-white"
      >
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{date}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              {isTask && <TableHead>Location</TableHead>}
              {isTask && <TableHead>Contact Person</TableHead>}
              {isTask ? (
                <TableHead>Assigned Staffer</TableHead>
              ) : (
                <TableHead>Status</TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dateEvents.map((event) => {
              const start = new Date(event.start as string);
              const end = event.end ? new Date(event.end as string) : null;

              const startTime =
                event.startTime ||
                start.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

              const endTime =
                event.endTime ||
                end?.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }) ||
                '--:--';

              const timeRange = `${startTime} - ${endTime}`;

              return (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    {event.title.replace(/\s*\([^)]*\)/, '')}
                  </TableCell>
                  <TableCell>
                    {event.description ? (
                      <span className="italic text-muted-foreground">
                        {event.description}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(start, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{timeRange}</TableCell>
                  {isTask && <TableCell>{event.location || '—'}</TableCell>}
                  {isTask && <TableCell>{event.contact || '—'}</TableCell>}
                  <TableCell>
                    {event.staffer ? (
                      <span className="text-sm font-medium text-green-600">
                        {event.staffer}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(event)}>
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setEventToDelete(event);
                            setIsAlertOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    ));
  };

  return (
    <div className="mt-10">
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <h2 className="text-xl font-semibold mb-4">Scheduled Events</h2>
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="italic text-center text-gray-400">
              No events scheduled
            </div>
          ) : (
            renderTable(events.filter((e) => !e.task))
          )}
        </TabsContent>
        <TabsContent value="tasks">
          <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
          {events.filter((e) => e.task).length === 0 ? (
            <div className="italic text-center text-gray-400">
              No tasks assigned
            </div>
          ) : (
            renderTable(
              events.filter((e) => e.task),
              true
            )
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{eventToDelete?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (eventToDelete?.id) {
                  onDelete(eventToDelete.id as string);
                  setEventToDelete(null);
                  setIsAlertOpen(false);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
