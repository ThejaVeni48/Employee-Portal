import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useSelector } from "react-redux";

const Holiday = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [holidays, setHolidays] = useState([]);
  const companyId = useSelector((state) => state.companyId);

  useEffect(() => {
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

        // Sort holidays by date
        formattedHolidays.sort((a, b) => a.date - b.date);
        setHolidays(formattedHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    getHolidays();
  }, [companyId]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <p style={styles.title}>Holidays</p>

          <div style={styles.tabContainer}>
            <Button
              rounded
              outlined={activeIndex !== 0}
              label="Calendar"
              style={styles.btn}
              onClick={() => setActiveIndex(0)}
            />
            <Button
              rounded
              outlined={activeIndex !== 1}
              label="Timeline"
              onClick={() => setActiveIndex(1)}
              style={styles.btn}
            />
          </div>
        </div>

        <div style={styles.content}>
          {activeIndex === 0 && (
            <div style={styles.calendarWrapper}>
              <Calendar
                inline
                dateTemplate={(cell) => {
                  const cellDate = new Date(cell.year, cell.month, cell.day);
                  const holiday = holidays.find(
                    (h) =>
                      h.date.getFullYear() === cellDate.getFullYear() &&
                      h.date.getMonth() === cellDate.getMonth() &&
                      h.date.getDate() === cellDate.getDate()
                  );

                  return (
                    <div style={{ textAlign: "center", cursor: "pointer" }}>
                      {holiday ? (
                        <span
                          style={{
                            backgroundColor: "#FFD700",
                            borderRadius: "50%",
                            display: "inline-block",
                            width: "2rem",
                            height: "2rem",
                            lineHeight: "2rem",
                            fontWeight: "bold",
                          }}
                          title={holiday.name}
                        >
                          {cell.day}
                        </span>
                      ) : (
                        <span>{cell.day}</span>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          )}

          {activeIndex === 1 && (
            <div style={styles.timelineContainer}>
              {holidays.length > 0 ? (
                holidays.map((h, index) => (
                  <div key={index} style={styles.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineContent}>
                      <p style={styles.holidayName}>{h.name}</p>
                      <p style={styles.holidayDate}>
                        {h.date.toDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No holidays available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#f9fafc",
    // paddingTop: "40px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    width: "800px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "1rem 2rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1c3681",
    margin: 0,
  },
  tabContainer: {
    display: "flex",
    gap: "10px",
  },
  btn: {
    width: "130px",
    fontWeight: "500",
  },
  content: {
    marginTop: "10px",
  },
  calendarWrapper: {
    display: "flex",
    justifyContent: "center",
  },

  // Timeline styles
  timelineContainer: {
    position: "relative",
    marginTop: "20px",
    paddingLeft: "30px",
    borderLeft: "3px solid #1c3681",
  },
  timelineItem: {
    position: "relative",
    marginBottom: "20px",
    paddingLeft: "20px",
  },
  timelineDot: {
    position: "absolute",
    left: "-9px",
    top: "5px",
    width: "15px",
    height: "15px",
    backgroundColor: "#1c3681",
    borderRadius: "50%",
  },
  timelineContent: {
    backgroundColor: "#f2f4f8",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  holidayName: {
    fontWeight: "600",
    marginBottom: "4px",
    color: "#1c3681",
  },
  holidayDate: {
    color: "#555",
    fontSize: "0.9rem",
    margin: 0,
  },
};

export default Holiday;
