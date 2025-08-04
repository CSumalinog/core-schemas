'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';
import { EventInput, formatDate } from '@fullcalendar/core';

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

  const groupedByDate = (filtered: EventInput[]) =>
    filtered.reduce<Record<string, EventInput[]>>((acc, event) => {
      const date = new Date(event.start as string).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    }, {});

  const renderTable = (filteredEvents: EventInput[], isTask = false) => {
    const grouped = groupedByDate(filteredEvents);

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
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              {isTask && <TableHead>Contact</TableHead>}
              {isTask && <TableHead>Staffer</TableHead>}
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
                    {(event.title ?? '').replace(/\s*\([^)]*\)/, '')}
                  </TableCell>
                  <TableCell>
                    {formatDate(start, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{timeRange}</TableCell>
                  <TableCell>{event.location || '—'}</TableCell>
                  {isTask && <TableCell>{event.contact || '—'}</TableCell>}
                  {isTask && <TableCell>{event.staffer || '—'}</TableCell>}
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
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          
          {events.filter((e) => !e.task).length === 0 ? (
            <div className="italic text-center text-gray-400">
              No events scheduled
            </div>
          ) : (
            renderTable(
              events.filter((e) => !e.task),
              false
            )
          )}
        </TabsContent>

        <TabsContent value="tasks">
         
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
