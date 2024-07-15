"use client";

import { useState } from "react";
import CalendarModeRadio from "./CalendarModeRadio";

const MainCalendar = () => {
  const [mode, setMode] = useState<CalendarModeType>("Monthly");

  const handleClickMode = (selectedMode: CalendarModeType) => {
    setMode(selectedMode);
  };

  return (
    <div>
      <div className="flex justify-end">
        <CalendarModeRadio selectedMode={mode} onClickMode={handleClickMode} />
      </div>
      <div className="border-t border-base-100 h-full p-8">halow</div>
    </div>
  );
};

export default MainCalendar;
