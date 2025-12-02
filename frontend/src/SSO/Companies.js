import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { IoIosCheckmark } from "react-icons/io";
import { useSelector } from "react-redux";

import moment from "moment";







const CompaniesList = ()=>{


  const userId = useSelector((state) => state.userId);
  const companyId = useSelector((state) => state.companyId);






  

 const styles = {
    container: { minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
    card: { borderRadius: "12px", backgroundColor: "transparent" },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "1rem",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    buttonGroup: { display: "flex", gap: "0.75rem" },
    button: {
      padding: "0.5rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "white",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "background 0.2s ease-in-out",
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
  };



     const [companies,setCompanies] = useState([]);
       const [filterStatus, setFilterStatus] = useState("All");
       const [filteredData, setFilteredData] = useState([]);
     


    useEffect(()=>{
        getAllCompanies();

    },[]);


  
   

    const getAllCompanies = async()=>{
        try {

            const data = await fetch('http://localhost:3001/api/CompaniesList');
            if(!data)
            {
                throw new Error("Network resposne was not ok");
                
            }
            
            const resposne = await data.json();

            // console.log("resposne",resposne);

            setCompanies(resposne.data)
            setFilteredData(resposne.data)
            
        } catch (error) {
            console.error("Error occured",error);
            
        }
    }


    const handleStatusFilter = (status) => {
  setFilterStatus(status);

  if (status === "All") {
    setFilteredData(companies);
    return;
  }

  const statusMap = {
    Approved: "A",
    Pending: "P",
    Rejected: "R"
  };

  const dbStatus = statusMap[status]; 

  setFilteredData(companies.filter((item) => item.STATUS === dbStatus));
};


   const actionTemplate = (rowData) => {
    const companyId = rowData.ORG_ID
    return(
<>


    <button onClick={()=>handleAcceptOrg(companyId)}>
     <IoIosCheckmark size={30} />

    </button>
     
    <button onClick={()=>handleRejectOrg(companyId)}>

<IoIosClose size={30} />
</button>
     
     
        </>
    )
  
  };




    const handleAcceptOrg = async(companyId)=>{

      // console.log("COMPANYiD",companyId);
      try {
const data = await fetch("http://localhost:3001/api/approveRejectOrg", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          status: "A",
          userId,
          
        }),
      });

      if (!data.ok) throw new Error("Network response was not ok");

      const result = await data.json();
      // console.log("result", result);
getAllCompanies();
        
      } catch (error) {
        console.error("Error occured",error);
        
      }

      
    }

       const handleRejectOrg = async(companyId)=>{

      // console.log("COMPANYiD",companyId);
      try {
const data = await fetch("http://localhost:3001/api/approveRejectOrg", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          status: "R",
          userId,
          
        }),
      });

      if (!data.ok) throw new Error("Network response was not ok");

      const result = await data.json();
      // console.log("result", result);

      getAllCompanies();
        
      } catch (error) {
        console.error("Error occured",error);
        
      }

      
    }


    const days = new Date();


    

    let week =[];



    for(let i=1;i<=7;i++)
    {
      let first = days.getDate() - days.getDay() +i;

      let day = new Date(days.setDate(first)).toISOString().slice(0,10);

      week.push(day)
    }

    // console.log("week",week);

    const startOfWeek = moment().startOf('month')
    // const startOfWeek = moment().startOf('week').add(1,'days').subtract(1,'week')


    console.log("startOfWeek",moment(startOfWeek));



    
    
    

    return(
        <>
      <div style={styles.toolbar}>
          <div style={styles.buttonGroup}>
            {["All", "Approved", "Pending", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                style={{
                  ...styles.button,
                  backgroundColor:
                    filterStatus === status ? "#1c3681" : "#cfdaf1",
                  color: filterStatus === status ? "white" : "#1c3681",
                  fontWeight: filterStatus === status ? "600" : "500",
                  transition: "all 0.3s ease",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
         <DataTable
                  value={filteredData}
                  paginator
                  rows={8}
                  stripedRows
                  responsiveLayout="scroll"
                  emptyMessage="No timesheets found."
                  style={styles.tableStyle}
                >
                 
                  
                  <Column
                    field="ORG_NAME"
                    header="Organization"
                    headerStyle={styles.headerStyle}
                    bodyStyle={styles.cellStyle}
                  />
                 
                   <Column
                    field="STATUS"
                    header="Status"
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
                    field="A_R_BY"
                    header="Approved/Rejected By"
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
       
        
        
        </>
    )





}

export default CompaniesList