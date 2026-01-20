import React, { useState, useEffect } from "react";
import {  useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'




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
      textAlign: "center",
    },
    cellStyle: {
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
  };





const CreateProject = ()=>{


 const email = useSelector((state) => state.user.email);
  const empId = useSelector((state) => state.user.empId);
const accessCode = useSelector((state) => state.user.accessCode) || [];
  const companyId = useSelector((state) => state.user.companyId);
  const [visible, setVisible] = useState(false);
const [projectCode,setProjectCode] = useState('');
  const [supportId,setSupportId] = useState('');
  const [projDesc,setProjDesc] = useState('');
  const [approverId,setApproverId] = useState('');
  const [status,setStatus] = useState('');
  const [clientId,setClientId] = useState('');
  const [clientName,setClientName] = useState('');
  const [billable,setBillable] = useState('');
  const [hierachy,setHierachy] = useState('');
const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes,setNotes] = useState('');
  const [managerId,setManagerId] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
   let [isOpen, setIsOpen] = useState(false)


  


    const handleCreateProject = async () => {
      if (!projectName || !startDate || !endDate ) {
        alert("Please fill required details");
        return;
      }
  
      console.log("billable",billable);
      console.log("hierachy",hierachy);
      console.log("notes",notes);
      
      try {
        const res = await fetch
        ("http://localhost:3001/api/addProject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName,
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
            projectCode,
            projDesc,
            supportId,
            status,
            clientId,
            clientName,
            billable,
            hierachy,
            companyId,
            email,
            notes
          }),
        });
  
        const data = await res.json();
        console.log("DATA",data);
        if(data.status ===200)
        {
          alert("Project created successfully");
          setVisible(false);
          resetForm();
        }
        
      
      } catch (err) {
        console.error(err);
      }
    };

    const resetForm = () => {
        setProjectName("");
        setStartDate(null);
        setEndDate(null);
        setBillable('');
        setClientName('');
        setClientId('');
        setHierachy('');setNotes('');
        setProjDesc('');
        setProjectCode('');
        setProjectName('');
        setStatus('');
        setSupportId('');
      
        // setSelectedPM("");
      };
    
    return(
        <>
      
 <div className="flex items-center gap-3 flex-wrap border-2">
          <button onClick={() => setIsOpen(true)}
             className="flex items-center gap-2 px-4 py-2 rounded-md
                 bg-blue-600 text-white text-sm font-medium
                 hover:bg-blue-700 transition">Create Project</button>
                
                 <button style={styles.button}>
                   <MdOutlineFileUpload size={20} /> Upload File
                 </button>
               </div>
       
        
        
     <Dialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  className="relative z-50"
>
  {/* 🔹 BLUR + DARK OVERLAY */}
  <div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm"
    aria-hidden="true"
  />

  {/* 🔹 MODAL CONTAINER */}
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="
      w-full max-w-lg
      rounded-lg
      bg-white
      p-6
      shadow-xl
    ">
      <DialogTitle className="text-lg font-semibold text-gray-900">
        Create Project
      </DialogTitle>

      <Description className="text-sm text-gray-500 mt-1">
        Fill the details to create a new project
      </Description>

      {/* CONTENT */}
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-700">
          Your form fields will go here
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>

        </>
    )








}


export default CreateProject