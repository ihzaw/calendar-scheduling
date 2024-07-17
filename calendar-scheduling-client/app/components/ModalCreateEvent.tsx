import { EventImpl } from "@fullcalendar/core/internal";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "react-feather";
import { parse, format } from "date-fns";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "./styles.css";
import { EventDetail, ModalMode } from "./MainCalendar";

interface ModalProps {
  ref: RefObject;
  selectedDate: SelectedDate;
  handleSave: () => void;
  handleUpdate: () => void;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  isTime: boolean;
  setIsTime: Dispatch<SetStateAction<boolean>>;
  time: SelectedTime;
  setTime: Dispatch<SetStateAction<SelectedTime>>;
  modalMode: ModalMode;
  resetModal: () => void;
  handleDelete: () => void;
}

export interface SelectedTime {
  start: string | null;
  end: string | null;
}

const ModalCreateEvent = (props: ModalProps) => {
  const {
    ref,
    selectedDate,
    handleSave,
    title,
    setTitle,
    isTime,
    setIsTime,
    time,
    setTime,
    modalMode,
    handleUpdate,
    resetModal,
    handleDelete,
  } = props;

  const dateFormat = "EEEE, dd MMMM";
  const formattedSelectedDate = useMemo(() => {
    return {
      start: selectedDate.start ? format(selectedDate.start, dateFormat) : "",
      end: selectedDate.end ? format(selectedDate.end, dateFormat) : "",
    };
  }, [selectedDate]);

  const disabledCondition = useMemo(() => {
    if (isTime) {
      return !title || !time.start || !time.end;
    }

    return !title;
  }, [title, isTime, selectedDate]);

  const closeModal = () => {
    const modal = document.getElementById("modal-create") as HTMLDialogElement;
    console.log("modal :", modal);
    if (modal) {
      modal.close();
      resetModal();
    }
  };

  return (
    <dialog id="modal-create" className="modal" ref={ref}>
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={closeModal}
        >
          ✕
        </button>
        <h3 className="font-bold mt-6 mb-12">
          <input
            type="text"
            placeholder="Add Title and Time..."
            className="input input-ghost w-full px-4 text-2xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </h3>

        <div className="flex gap-4 px-4 mb-8">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              className="radio checked:bg-red-500 w-4 h-4"
              checked={!isTime}
              onChange={() => {
                setTime({
                  start: "",
                  end: "",
                });
                setIsTime(false);
              }}
            />
            <span className="label-text">All day</span>
          </label>
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              className="radio checked:bg-blue-500 w-4 h-4"
              checked={isTime}
              onChange={() => {
                setTime({
                  start: "",
                  end: "",
                });
                setIsTime(true);
              }}
            />
            <span className="label-text">Add time</span>
          </label>
        </div>

        {!isTime && (
          <div className="px-4">
            <div className="mb-4">
              {formattedSelectedDate.start}{" "}
              {formattedSelectedDate.end
                ? `- ${formattedSelectedDate.end}`
                : ""}
            </div>
            <div>All day</div>
          </div>
        )}
        {isTime && (
          <div className="px-4">
            <div className="mb-4">
              {formattedSelectedDate.start}{" "}
              {formattedSelectedDate.end
                ? `- ${formattedSelectedDate.end}`
                : ""}
            </div>
            <div className="flex items-center justify-center w-full gap-4">
              <TimePicker
                onChange={(newVal) => setTime({ ...time, start: newVal })}
                format="hh:mm a"
                value={time.start}
                className="border-0 w-full rounded-lg"
                disableClock
                locale="id-ID"
                maxDetail="minute"
              />
              <TimePicker
                onChange={(newVal) => setTime({ ...time, end: newVal })}
                format="hh:mm a"
                value={time.end}
                className="border-0 w-full rounded-lg"
                disableClock
                locale="id-ID"
                maxDetail="minute"
                minTime={time.start ?? undefined}
              />
            </div>
          </div>
        )}

        <div className="divider px-4"></div>

        <div className="px-4">
          <label className="input input-bordered flex items-center gap-2">
            <User />
            <input type="text" className="grow" placeholder="Invite people" />
          </label>
        </div>

        <div className="divider px-4"></div>

        <div className="px-4 py-2 flex justify-end">
          {modalMode === "UPDATE" && (
            <span className="w-full flex justify-start">
              <button
                className="btn btn-error text-white"
                onClick={() => handleDelete()}
              >
                Delete
              </button>
            </span>
          )}
          <button
            className="btn btn-primary"
            disabled={disabledCondition}
            onClick={
              modalMode === "CREATE" ? () => handleSave() : () => handleUpdate()
            }
          >
            {modalMode === "CREATE" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalCreateEvent;
