import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onClose: () => void;
}

interface Event {
  date: string;
  title: string;
  type: 'holiday' | 'event';
}

const Calendar: React.FC<CalendarProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events - replace these later
  const events: Event[] = [
    { date: '2025-01-01', title: 'New Year', type: 'holiday' },
    { date: '2025-01-15', title: 'Team Meeting', type: 'event' },
    { date: '2025-01-26', title: 'Republic Day', type: 'holiday' },
    { date: '2025-02-14', title: 'Project Deadline', type: 'event' },
  ];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDayEvents = (day: number): Event[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getDayEvents(day);
      const isCurrentDay = day === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border border-gray-200 dark:border-gray-700 ${
            dayEvents.length > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          } ${isCurrentDay ? 'bg-yellow-100 dark:bg-yellow-600' : ''} `}
        >
          <span className={`text-sm font-medium ${isCurrentDay ? 'font-bold text-yellow-800' : 'text-gray-700 dark:text-gray-300'}`}>
            {day}
          </span>
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className={`text-xs mt-1 p-1 rounded ${
                event.type === 'holiday'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
              }`}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="ml-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 dark:text-gray-300">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
