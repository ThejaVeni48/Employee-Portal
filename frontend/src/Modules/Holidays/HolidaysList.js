import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import styles from '../Projects/ProjectHolidays/PHolidays.module.css';
import { useSelector } from "react-redux";

export default function HolidaysList({ projectId }) {
  const [holidays, setHolidays] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const companyId = useSelector((state) => state.user.companyId);
    const [projId,setProjectId] = useState('');
    
    

  

  useEffect(() => {

    const fetchHolidays = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/getHolidays?orgId=${companyId}`
        );
        const data = await res.json();
        console.log("data",data.data);

        // if(!data && data.data.length >0)
        // {

          setHolidays(data.data);
          setFilteredData(data.data)
        // }

      
      } catch (err) {
        console.error("Error fetching holidays:", err);
      }
    };

    fetchHolidays();
  },  [companyId]);

  const actionTemplate = (rowData) => (
    <button
      style={{
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
      onClick={() => console.log("Action clicked for", rowData)}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );

  return (
    <Card>
      <DataTable
        value={filteredData}
        paginator
        rows={8}
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="No holidays found."
        className={styles.tableStyle}
      >
        <Column
          field="HOL_NAME"
          header="Holiday Name"
          headerClassName={styles.headerStyle}
          bodyClassName={styles.cellStyle}
        />
        <Column
          field="START_DATE"
          header="Start Date"
          headerClassName={styles.headerStyle}
          bodyClassName={styles.cellStyle}
        />
        <Column
          field="END_DATE"
          header="End Date"
            headerClassName={styles.headerStyle}
          bodyClassName={styles.cellStyle}
        />
        <Column
          field="DAYS"
          header="Days"
          headerClassName={styles.headerStyle}
          bodyClassName={styles.cellStyle}
        />
        <Column
          header="Action"
          body={actionTemplate}
           headerClassName={styles.headerStyle}
          bodyClassName={styles.cellStyle}
        />
      </DataTable>
    </Card>
  );
}
