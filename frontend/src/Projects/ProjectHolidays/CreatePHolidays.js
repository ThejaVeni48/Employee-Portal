import React, { useState, useEffect } from "react";
import styles from './PHolidays.module.css';
import { IoIosAdd } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import {  useSelector } from "react-redux";




const CreateHolidays = ({ projectId }) => {

  const [visible, setVisible] = useState(false);
  const [holidayName,setHolidayName] = useState('');
  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);
  const [days,setDays] = useState('');
  const [status,setStatus] = useState('');
 const email = useSelector((state) => state.user.email);
  const companyId = useSelector((state) => state.user.companyId);
  const [projId,setProjectId] = useState('');
  
  
useEffect(() => {
    if (projectId) {
        setProjectId(projectId);
    }
}, [projectId]);


  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0;

    const arr = [];
    let current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        arr.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return arr.length;
  };

  useEffect(() => {
    if (startDate && endDate) {
      setDays(calculateWorkingDays(startDate, endDate));
    }
  }, [startDate, endDate]);


     const handleAddProject = async () => {
       if (!holidayName || !startDate || !endDate ) {
         alert("Please fill required details");
         return;
       }

        
   
       try {
         const res = await fetch
         ("http://localhost:3001/api/createPHolidays", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             holidayName,
             startDate: moment(startDate).format("YYYY-MM-DD"),
             endDate: moment(endDate).format("YYYY-MM-DD"),
              days,
             status,
           projId: projId,
            orgId: companyId,
             email,
           }),
         });
   
         const data = await res.json();
         console.log("DATA",data);

        if(data.status === 201){
    alert("Created Successfully");
}

if(data.status === 404){
    alert("Holiday exists");
}

       
       } catch (err) {
         console.error(err);
       }
     };
 

    return(
        <>
        
        <div className={styles.toolbar}>
                        <button className={styles.button} onClick={() => setVisible(true)}>
                          <IoIosAdd size={20} /> Add New Holiday
                        </button>
                        <button className={styles.button}>
                          <MdOutlineFileUpload size={20} /> Upload File
                        </button>
                      </div>
        

           <Dialog
          header="Add Holiday"
          visible={visible}
          style={{ width: "500px", borderRadius: "8px" }}
          onHide={() => setVisible(false)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "10px 0",
            }}
          >
            {/* Project Name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
                Holiday Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>
        
            {/* Start Date */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
                Start Date <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select start date"
              />
            </div>
        
            {/* End Date */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
                End Date <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
              />
            </div>
    
           {/* Days */}

            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
                Days <span style={{ color: "red" }}>*</span>
              </label>
               <input
                type="text"
                placeholder="Days"
                value={days}
                disabled
                onChange={(e) => setDays(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              </div>

              {/* Status */}
               <div style={{ display: "flex", alignItems: "center" }}>
                    <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
                      Current Status <span style={{ color: "red" }}>*</span>
                    </label>
              
                    <Dropdown
                      value={status}
                      options={[
                        { label: "Active", value: "A" },
                        { label: "Inactive", value: "I" },
                      ]}
                      onChange={(e) => setStatus(e.value)}
                      placeholder="Select status"
                      style={{ flex: 1 }}
                    />
                  </div>
        
            {/* Submit Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  padding: "10px 25px",
                  backgroundColor: "#1c3681",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onClick={handleAddProject}
                 type="button"
              >
                Create Project
              </button>
            </div>
          </div>
        </Dialog>
        </>
    )




}


export default CreateHolidays