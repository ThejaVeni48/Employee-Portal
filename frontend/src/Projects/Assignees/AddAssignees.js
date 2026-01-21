

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState,useEffect } from "react";
import { 
 
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {fetchRoles} from '../../Redux/actions/roleActions';



const  AddAssignees = ({ rowData = {}, roles = []})=> {
  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const companyId = useSelector((state) => state.user.companyId);

  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
    const [projEmployees, setProjEmployees] = useState([]);

const [formData, setFormData] = useState({
  selectedEmp: null,
  roleId: "",
  isActive: "Yes",
  startDate: null,
  contractStartDate: null,
  contractEndDate: null,
  approveAccess:null
});
  const dispatch = useDispatch();


  useEffect(() => {
    if (companyId) {
      dispatch(fetchRoles(companyId));
    }
  }, [companyId]);


  const Hierachy = false; // adjust based on your logic


   const filteredEmployees = employees.filter((emp) =>
    emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadData = async () => {
  const projectId = rowData.PROJ_ID;

  const results = await Promise.allSettled([
    fetch(`http://localhost:3001/api/getEmployees?companyId=${companyId}`),
    fetch(`http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${projectId}`),
  ]);

  if (results[0].status === "fulfilled") {
    const data = await results[0].value.json();
    setEmployees(data.data);
  } else {
    console.error("Employees API failed");
  }

  if (results[1].status === "fulfilled") {
    const data = await results[1].value.json();
    setProjEmployees(data.data);
  } else {
    console.error("Project Employees API failed");
  }
};


const updateForm = (key,value)=>{
    setFormData((prev)=>({
  ...prev,
        [key]:value
}))
      
    
}

// ------------------- HANDLERS -------------------- */
//   const handleSelectEmp = (emp) => {
//     setSelectedEmp(emp);
//   };

  const handleAssignProject = () => {
    // const payload = {
    //   projectId: rowData.PROJ_ID,
    //   empId: formData.selectedEmp?.EMP_ID,
    //   roleId: formData.selectedRoleId,
    //   isActive,
    //   formData.startDate,
    //   contractStartDate,
    //   contractEndDate,
    //   approveAccess,
    // };

    // console.log("Assign Payload:", payload);
    setVisible(false);
  };

  return (
    <>
      <button onClick={() => setOpenModal(true)}
      className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Add Assignee</button>
     <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
  <ModalHeader>Add Assignee</ModalHeader>

  <ModalBody>
    <div className="space-y-6">

      {/* SECTION: EMPLOYEE */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Employee Details
        </h3>

        <div>
          <Label value="Search Assignee *" />
          <TextInput
            placeholder="Search employee by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && filteredEmployees.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-sm">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.EMP_ID}
                  onClick={() => {
  updateForm("selectedEmp", emp);
  setSearchTerm("");
}}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {emp.DISPLAY_NAME}
                </div>
              ))}
            </div>
          )}
        </div>

        {formData.selectedEmp && (
          <div className="mt-3 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900">
            Selected Employee: {formData.selectedEmp.DISPLAY_NAME}
          </div>
        )}
      </div>

      {/* SECTION: ROLE & STATUS */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Assignment Details
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label value="Role *" />
            <Select
              value={formData.selectedRoleId}
              onChange={(e)=>updateForm("roleId",e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.ROLE_ID} value={r.ROLE_ID}>
                  {r.ROLE_NAME}
                </option>
              ))}
            </Select>
          </div>

 <div>
            <Label value="Designation *" />
            <Select
              value={formData.selectedRoleId}
              onChange={(e) => updateForm("designid",e.target.value)}
            >
              <option value="">Select Designation</option>
              {roles.map((r) => (
                <option key={r.ROLE_ID} value={r.ROLE_ID}>
                  {r.ROLE_NAME}
                </option>
              ))}
            </Select>
          </div>


        
        </div>
      </div>
      {/* active status */}
        <div>
            <Label value="Active Status *" />
            <Select
              value={formData.isActive}
              onChange={(e) => updateForm("setIsActive",e.target.value)}
            >
              <option value="Yes">Active</option>
              <option value="No">Inactive</option>
            </Select>
          </div>
{/* start period */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Start Period
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label value="Start Date *" />
            <DatePicker
              selected={formData.startDate}
              onChange={(date)=>updateForm("startDate",date)}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
</div>
</div>

 <div className="rounded-lg border border-gray-200 p-4">
  <h3 className="mb-3 text-sm font-semibold text-gray-700">
    Contract Period
  </h3>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    
    <div>
      <Label value="Contract Start *" />
      <DatePicker
        selected={formData.contractStartDate}
              onChange={(date)=>updateForm("contractStartDate",date)}
        dateFormat="yyyy-MM-dd"
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </div>

    <div>
      <Label value="Contract End *" />
      <DatePicker
        selected={formData.contractEndDate}
              onChange={(date)=>updateForm("contractEndDate",date)}
        dateFormat="yyyy-MM-dd"
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </div>

  </div>
</div>

     
     
     




      {/* SECTION: ACCESS */}
      {!Hierachy && (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
          <Checkbox
            checked={formData.approveAccess}
            onChange={(e) => updateForm("setApproveAccess",e.target.checked)}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              Approval Access
            </p>
            <p className="text-xs text-gray-500">
              Allows assignee to approve related tasks or timesheets
            </p>
          </div>
        </div>
      )}

    </div>
  </ModalBody>

  <ModalFooter className="flex justify-end gap-3">
    <Button color="gray" onClick={() => setOpenModal(false)}>
      Cancel
    </Button>

    <Button className="bg-[#1c3681]" onClick={handleAssignProject}>
      Assign to Project
    </Button>
  </ModalFooter>
</Modal>

    </>
  );
}



export default AddAssignees


