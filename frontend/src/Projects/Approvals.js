
import React,{useState,useEffect} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


const styles = {
  mainContainer:{
    width:'70vw',
    display:'flex',
    flexDirection:'row'
  },
  leftContainer:{
    width:'50vw',
    height:'600px',
    border:'2px solid red'
  },
  rightContainer:{
    width:'80vw',
        height:'600px',
            border:'2px solid red'


  }
}




const Approvals = ({ employees = {} })=>{


  const [employee, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [projEmployees,setProjEmployees] = useState([]);
const [selectedEmp, setSelectedEmp] = useState(null);
const [searchApproverTerm,setSearchApproverTerm] = useState('');

    useEffect(() => {
    if (employees) {
      setEmployees(employees.employees);
      setProjEmployees(employees.projEmployees)
    }
  }, [employees]);

  const filteredEmployees = employee.filter((emp) =>
    emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );


  console.log("employees",employees);
  
const handleSelectEmp = (rowData) => {
  const emp = rowData.EMP_ID;
  console.log("Selected Employee:",typeof(emp));
    setSelectedEmp(emp);
  };

  console.log("Seecyed",selectedEmp);
  console.log("Seecyed",typeof(selectedEmp));
  

  return(
    <>
    <p>Approvals</p>
    
      <div style={styles.mainContainer}>
  <div style={styles.leftContainer}>
    <p>Left</p>

    <div>
      <input
        type="text"
        placeholder="Search employee..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginTop: "6px",
        }}
      />

       <DataTable
  value={projEmployees}
  paginator
  rows={8}
  stripedRows
  responsiveLayout="scroll"
  emptyMessage="No projects found."
  style={styles.tableStyle}
>
  <Column
    header="Select"
    body={(rowData) => (
      <input
        type="checkbox"
        checked={selectedEmp === rowData.EMP_ID}
 onChange={() => handleSelectEmp(rowData)}      />
    )}
    style={{ width: "80px", textAlign: "center" }}
  />

  <Column
    field="DISPLAY_NAME"
    header="Employee Name"
    headerStyle={styles.headerStyle}
    bodyStyle={styles.cellStyle}
  />
</DataTable>

    </div>
  </div>

  <div style={styles.rightContainer}>
    <p>Right</p>
   <input
        type="text"
        placeholder="Search Approver..."
        value={searchApproverTerm}
        onChange={(e) => setSearchApproverTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginTop: "6px",
        }}
      />
      {searchTerm && filteredEmployees.length > 0 && (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.EMP_ID}
                  onClick={() => {
                    handleSelectEmp(emp);
                    setSearchTerm("");
                  }}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                >
                  {emp.DISPLAY_NAME}
                </div>
              ))}
            </div>
          )}

          {/* SELECTED EMPLOYEE */}
          {selectedEmp && (
            <div
              style={{
                background: "#f1f5ff",
                padding: "10px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              Selected: {selectedEmp.DISPLAY_NAME}
            </div>
          )}

  </div>
</div>





    
    
    
    </>
  )















}


export default Approvals