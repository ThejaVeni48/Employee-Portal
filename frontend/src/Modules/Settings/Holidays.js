import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import DatePicker from "react-datepicker";
import moment from "moment";
import * as XLSX from 'xlsx';

const Holidays = () => {
  const [name, setName] = useState('');
  const [days, setDays] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const companyId = useSelector((state) => state.companyId);
  const createdBy = useSelector((state) => state.createdBy);
  const [visible, setVisible] = useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      borderRadius: "12px",
      backgroundColor: "transparent",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "1rem",
    },
    toolbar: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "#1c3681",
      fontSize: "0.9rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease-in-out",
    },
    tableStyle: {
      width: "100%",
      fontSize: "0.9rem",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    headerStyle: {
      backgroundColor: "#cfdaf1",
      color: "#1c3681",
      fontSize: "13px",
    },
    cellStyle: {
        textAlign: "left",
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
    dialogBody: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      padding: "10px",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    dialogButton: {
      alignSelf: "flex-end",
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      padding: "0.6rem 1.2rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

 useEffect(() => {
    if (startDate && endDate) {
      setDays(calculateWorkingDays(startDate, endDate));
    }
  }, [startDate, endDate]);

  const calculateWorkingDays = (startDate, endDate) => {
    const arr = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        arr.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return arr.length;
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/createHolidays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          days,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          endDate: moment(endDate).format("YYYY-MM-DD"),
          companyId,
          createdBy,
        }),
      });
      const response = await res.json();
      console.log("response", response);
      if (res.ok) {
        alert(`${name} has been successfully created.`);
        setHolidays([...holidays, response.data]);
        setName('');
        setDays('');
        setStartDate(null);
        setEndDate(null);
        setVisible(false);
        getHolidays();
      }
    } catch (error) {
      console.error("error occurred", error);
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

const getHolidays = async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/getHolidays?companyId=${companyId}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const response = await res.json();
    console.log("response", response);
    setHolidays(response.data || []);
  } catch (error) {
    console.error("Error occurred while fetching holidays:", error);
  }
};
   const actionTemplate = (rowData) => (
      <button
        // onClick={() => handleActionClick(rowData)}
        style={{
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
      >
        <HiOutlineDotsHorizontal />
      </button>
    );
  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    let rows = [];

    if (file.name.endsWith(".csv")) {
      const text = await file.text();
      const workbook = XLSX.read(text, { type: "string" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { raw: false }); // <-- important
    } else {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { raw: false }); // <-- important
    }

    if (rows.length === 0) {
      alert("No data found in file!");
      return;
    }

    let successCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Convert dates to YYYY-MM-DD strings
      const start = moment(row.startDate).format("YYYY-MM-DD");
      const end = moment(row.endDate).format("YYYY-MM-DD");

      try {
        const res = await fetch("http://localhost:3001/api/createHolidays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            days: row.days,
            startDate: start,
            endDate: end,
            createdBy,
            companyId,
          }),
        });

        if (res.ok) {
          successCount++;
        } else {
          const errorData = await res.json();
          console.error(`Row ${i + 1} failed:`, errorData);
        }
      } catch (err) {
        console.error(`Row ${i + 1} failed:`, err);
      }
    }

    alert(`Uploaded ${successCount} out of ${rows.length} holidays successfully!`);
    getHolidays();
  } catch (error) {
    console.error("Failed to read file:", error);
    alert("Failed to read file!");
  }
};




  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Holidays</div>

        <div style={styles.toolbar}>
          <button
            style={styles.button}
            onClick={() => setVisible(true)}
          >
            <IoIosAdd size={20} /> Add Holiday
          </button>
         <input
  type="file"
  accept=".xlsx,.xls,.csv"
  style={{ display: 'none' }}
  id="holidayFileInput"
  onChange={handleFileChange}
/>

<label htmlFor="holidayFileInput" style={styles.button}>
  <MdOutlineFileUpload size={20} /> Uploade File
</label>

        </div>

        <DataTable
          value={holidays}
          paginator
          rows={8}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No holidays found."
          style={styles.tableStyle}
        >
          <Column
            field="NAME"
            header="Holiday Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="START_DATE"
            header="Start Date"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
           <Column
            field="END_DATE"
            header="End Date"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
           <Column
            field="DAYS"
            header="Days"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
           <Column
                      header="Action"
                      body={actionTemplate}
                      headerStyle={styles.headerStyle}
                      bodyStyle={styles.cellStyle}
                    />
        </DataTable>
      </Card>

      <Dialog
        header="Add Holiday"
        visible={visible}
        style={{ width: "40vw", borderRadius: "12px", maxWidth: "500px" }}
        onHide={() => setVisible(false)}
        contentStyle={styles.dialogBody}
      >
        <div>
          <label style={styles.label}>Name of the Festival</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder="Enter festival name"
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
            required
          />
        </div>
        <div>
          <label style={styles.label}>Days</label>
          <input
            type="text"
            value={days}
            readOnly
            style={{ ...styles.input, backgroundColor: "#e0e0e0", cursor: "not-allowed" }}
          />
        </div>
        <div>
          <label style={styles.label}>From Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Choose Date"
            className="custom-date-picker"
            calendarClassName="custom-calendar"
            wrapperClassName="date-picker-wrapper"
          />
        </div>
        <div>
          <label style={styles.label}>To Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Choose Date"
            className="custom-date-picker"
            calendarClassName="custom-calendar"
            wrapperClassName="date-picker-wrapper"
          />
        </div>
        <button
          style={styles.dialogButton}
          onMouseOver={(e) => Object.assign(e.target.style, styles.dialogButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, styles.dialogButton)}
         onClick={handleCreate}
        >
          Add Holiday
        </button>
      </Dialog>
    </div>
  );
};

export default Holidays;
