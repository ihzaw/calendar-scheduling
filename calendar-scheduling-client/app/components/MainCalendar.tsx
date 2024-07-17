"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CalendarModeRadio from "./CalendarModeRadio";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import ModalCreateEvent, { SelectedTime } from "./ModalCreateEvent";
import { format } from "date-fns";

export interface SelectedDate {
  start: string;
  end: string;
}

export interface EventDetail {
  title: string;
  time: SelectedTime;
}

export type ModalMode = "CREATE" | "UPDATE";

const MainCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedDate, setSelectedDate] = useState<SelectedDate>({
    start: "",
    end: "",
  });
  const [title, setTitle] = useState("");
  const [isTime, setIsTime] = useState(false);
  const [time, setTime] = useState<SelectedTime>({ start: "", end: "" });
  const [modalMode, setModalMode] = useState<ModalMode>("CREATE");
  const [selectedEventId, setSelectedEventId] = useState("");

  const handleSelectDate = (e: DateSelectArg) => {
    const modal = document.getElementById("modal-create") as HTMLDialogElement;
    if (modal) {
      setModalMode("CREATE");
      modal.showModal();
      setSelectedDate({
        start: e.startStr,
        end: e.endStr,
      });
    }
  };

  const resetModal = () => {
    setTitle("");
    setIsTime(false);
    setTime({
      start: "",
      end: "",
    });
  };

  const handleCloseModalCreate = () => {
    const modal = document.getElementById("modal-create") as HTMLDialogElement;
    if (modal) {
      modal.close();
      resetModal();
    }
  };

  const handleEventClick = (calendarData: EventClickArg) => {
    const { event } = calendarData;
    const timeFormat = "HH:mm";

    const formattedTime =
      time.start || time.end
        ? {
            start: `${selectedDate.start}T${time.start}`,
            end: `${selectedDate.end}T${time.end}`,
          }
        : {
            start: selectedDate.start,
            end: selectedDate.end,
          };

    setTitle(event.title);
    setSelectedDate({
      start: formattedTime.start,
      end: formattedTime.end,
    });
    setTime(
      event.allDay
        ? { start: "", end: "" }
        : {
            start: event.start ? format(event.start, timeFormat) : "",
            end: event.end ? format(event.end, timeFormat) : "",
          }
    );
    setSelectedEventId(event.id);

    const hasTime = event.startStr.includes("T") || event.endStr.includes("T");
    if (hasTime) {
      setIsTime(true);
    } else {
      setIsTime(false);
    }

    const modal = document.getElementById("modal-create") as HTMLDialogElement;
    if (modal) {
      setModalMode("UPDATE");
      modal.showModal();
    }
  };

  const handleSave = () => {
    const formattedTime =
      time.start || time.end
        ? {
            start: `${selectedDate.start}T${time.start}`,
            end: `${selectedDate.end}T${time.end}`,
          }
        : {
            start: selectedDate.start,
            end: selectedDate.end,
          };

    const payload = {
      title: title,
      time: formattedTime,
    };

    const newEvents = [...events];

    if (payload.time.start || payload.time.end) {
      newEvents.push({
        id: payload.title.split(" ").join("_"),
        title: payload.title,
        start: payload.time.start,
        end: payload.time.end,
      });
    } else {
      newEvents.push({
        id: payload.title.split(" ").join("_"),
        title: payload.title,
        allDay: true,
      });
    }

    setEvents(newEvents);
    handleCloseModalCreate();
  };

  const handleUpdate = () => {
    const formattedTime =
      time.start || time.end
        ? {
            start: `${selectedDate.start}T${time.start}`,
            end: `${selectedDate.end}T${time.end}`,
          }
        : {
            start: selectedDate.start,
            end: selectedDate.end,
          };

    const newUpdatedEvent = {
      id: selectedEventId,
      title: title,
      ...formattedTime,
    };

    const newEvents = [...events];
    const selectedIndex = newEvents.findIndex(
      (event) => event.id === selectedEventId
    );
    newEvents.splice(selectedIndex, 1, newUpdatedEvent);
    setEvents(newEvents);

    handleCloseModalCreate();
    setSelectedEventId("");
  };

  const handleDelete = () => {
    const newEvents = [...events]
    const selectedEventIndex = newEvents.findIndex((event) => event.id === selectedEventId)
    newEvents.splice(selectedEventIndex, 1)
    setEvents(newEvents)

    handleCloseModalCreate()
    setSelectedEventId("")
  }

  const eventSource = useMemo<EventSourceInput>(() => {
    return {
      events,
    };
  }, [events]);

  return (
    <div>
      <ModalCreateEvent
        ref={dialogRef}
        selectedDate={selectedDate}
        handleSave={handleSave}
        time={time}
        setTime={setTime}
        isTime={isTime}
        setIsTime={setIsTime}
        title={title}
        setTitle={setTitle}
        modalMode={modalMode}
        handleUpdate={handleUpdate}
        resetModal={resetModal}
        handleDelete={handleDelete}
      />
      <div className="border-t border-base-100 h-full p-8">
        <FullCalendar
          select={handleSelectDate}
          selectable
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          events={eventSource}
          eventClick={handleEventClick}
          dayMaxEvents={4}
          eventMaxStack={3}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            meridiem: false,
          }}
        />
      </div>
    </div>
  );
};

export default MainCalendar;
