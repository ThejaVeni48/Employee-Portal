import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { useSelector } from "react-redux";
import "./Calender.css";

const CalendarComponent = () => {
  const [holidays, setHolidays] = useState([]);
  const companyId = useSelector((state) => state.companyId);

  useEffect(() => {
    getHolidays();
  }, []);

  const getHolidays = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getHolidays?companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();

      const formattedHolidays = response.data.map((h) => ({
        date: new Date(h.START_DATE),
        name: h.NAME,
      }));

      setHolidays(formattedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Company Holiday Calendar</h2>
      <div className="calendar-card">
        <Calendar
          inline
          showWeek
          dateTemplate={(cell) => {
            const cellDate = new Date(cell.year, cell.month, cell.day);
            const holiday = holidays.find(
              (h) =>
                h.date.getFullYear() === cellDate.getFullYear() &&
                h.date.getMonth() === cellDate.getMonth() &&
                h.date.getDate() === cellDate.getDate()
            );

            const isToday =
              new Date().toDateString() === cellDate.toDateString();

            return (
              <div
                className={`calendar-cell ${
                  holiday ? "holiday-cell" : isToday ? "today-cell" : ""
                }`}
                title={holiday ? holiday.name : ""}
              >
                <span>{cell.day}</span>
                {holiday && (
                  <div className="holiday-label">{holiday.name}</div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
