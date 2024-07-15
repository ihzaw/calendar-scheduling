"use client";

interface Props {
  selectedMode: string;
  onClickMode: (selectedMode: CalendarModeType) => void;
}

const CalendarModeRadio = (props: Props) => {
  const { selectedMode, onClickMode } = props;

  return (
    <ul className="py-6 pr-6 menu-horizontal gap-x-2">
      <li>
        <input
          type="radio"
          aria-label="Month"
          className="btn min-w-24"
          checked={selectedMode === 'Monthly'}
          onChange={() => onClickMode('Monthly')}
        />
      </li>
      <li>
        <input
          type="radio"
          aria-label="Week"
          className="btn min-w-24"
          checked={selectedMode === 'Weekly'}
          onChange={() => onClickMode('Weekly')}
        />
      </li>
      <li>
        <input
          type="radio"
          aria-label="Day"
          className="btn min-w-24"
          checked={selectedMode === 'Daily'}
          onChange={() => onClickMode('Daily')}
        />
      </li>
    </ul>
  );
};

export default CalendarModeRadio;
