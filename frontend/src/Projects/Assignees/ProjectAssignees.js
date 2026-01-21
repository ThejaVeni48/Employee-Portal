import React,{useEffect, useState} from "react";
import AddAssignees from "./AddAssignees";
import { 
 
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import { Card } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";



const ProjectAssignees =  ({ rowData = {} }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
 const [statusFilter, setStatusFilter] = useState('all');
  const companyId = useSelector((state) => state.user.companyId);
  const [projEmployees, setProjEmployees] = useState([]);


  console.log("project assignees");
  
   const getProjectEmployee = async () => {
    console.log("getProjectEmployeee");

    const projectId = rowData.PROJ_ID;

    console.log("projectId",projectId);

    try {
      const res = await fetch(
        `http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${projectId}`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log("data",data);
      
      setProjEmployees(data.data);

      // console.log("data for project assignmnet",data);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  useEffect(()=>{
    if(rowData)
      getProjectEmployee();
  },[companyId])
 

  const filteredEmployees = projEmployees.filter((emp) => {
  const matchesSearch =
    emp.DISPLAY_NAME?.toLowerCase().includes(searchTerm.toLowerCase())||
    emp.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus =
    statusFilter === "" || statusFilter === "all"
      ? true
      : emp.STATUS === statusFilter;

  return matchesSearch && matchesStatus;
});


    return(
        <div className="w-auto   p-[1px]">
<div className="flex items-center gap-3 rounded-lg p-2">

  {/* Search input*/}
  <div className="flex-1">
   <TextInput
  placeholder="Search employee"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full py-0.5 text-sm"
 />


  </div>
  <div>
   <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="
          w-[160px]
          border border-gray-300 rounded-md
          px-3 py-2 text-sm text-gray-700
          bg-white shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        "
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="On Hold">On Hold</option>
        <option value="Closed">Closed</option>
      </select>
  </div>

  <AddAssignees />

</div>

{/* employees list */}
<div className="mt-4 max-h-[500px] overflow-y-auto border p-4">
   <div className="overflow-x-auto">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {filteredEmployees
    .filter((emp) =>
      emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((emp) => (
      <Card key={emp.EMP_ID} className="rounded-xl">

        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <img
            src={emp.PROFILE_IMG || "https://ui-avatars.com/api/?name=" + emp.DISPLAY_NAME}
            alt={emp.DISPLAY_NAME}
            className="h-12 w-12 rounded-full object-cover"
          />

          {/* Name & Role */}
          <div className="flex-1">
            <h5 className="text-base font-semibold text-gray-900">
              {emp.DISPLAY_NAME}
            </h5>
            <p className="text-sm text-gray-500">
              {emp.DESIGNATION || "Designation"}
            </p>
          </div>

          {/* Status dot */}
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              emp.STATUS === "Yes" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-gray-200" />

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600">
          

          <div className="flex justify-between">
            <span className="font-medium">Role</span>
            <span>{emp.ROLE_NAME || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Start Date</span>
            <span>{emp.START_DATE || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Approve Access</span>
            {/* <span>{emp.TS_APPROVE_ACCESS || "-"}</span> */}
            <span  className="font-medium">{emp.TS_APPROVE_ACCESS ==="0" ? 'NO' :'YES'}</span>
          </div>
        </div>

  
        

        {/* Contact */}

        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            Email: {emp.EMAIL}
          </p>
          <p className="flex items-center gap-2">
            Mobile: {emp.MOBILE_NUMBER}
          </p>
        </div>

      </Card>
    ))}
</div>

    </div>

</div>

       
        
        </div>
    )


}


export default ProjectAssignees