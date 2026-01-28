

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState,useEffect } from "react";
import { QueryCache, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { 
 
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {fetchRoles} from '../../../Redux/actions/roleActions';
import DateFormat from "../../../utility/dateFormat";
import { EmpList } from "../../../apis/Employee/EmpList";
import AppModal from "../../../components/Modals/AddModal";
import useModal from "../../../components/hooks/useModal";
import FormTextInput from "../../../components/FormInput/FormInput";
import FormLabel from "../../../components/FormLabel/FormLabel";
import FormDatePicker from "../../../components/DatePicker/DatePicker";
import toast from "react-hot-toast";
import { assignProject } from "../../../apis/Project/assignEmployee";
import {getProjectApprovers} from '../../../apis/Project/getProjectApproverList';


const  AddAssignees = ({ project = {},onSuccess,approvals = {},employeesList=[] } )=> {
  const companyId = useSelector((state) => state.user.companyId);
const [showDropdown, setShowDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const roles = useSelector((state) => state.roles.roleList);



  console.log("project",project);
  
  console.log("roles",roles);
  
   const [desgn,setDesgn] = useState([]);
   const email = useSelector((state) => state.user.email);
const [selectedRoleId, setSelectedRoleId] = useState("");
const [selectedRoleCode, setSelectedRoleCode] = useState("");
   const projId = project[0].PROJ_ID;

   console.log("projId",projId);
   
const [selectedEmp,setSelectedEmp] = useState('');

   const hierarchyCustom = project[0].Type;

  const [approvalLevels, setApprovalLevels] = useState([]);



   console.log("hierarchyCustom",hierarchyCustom);
   

  console.log("project",project);

  const Hierachy = project[0].HIERARCHY;
  

const [formData, setFormData] = useState({
  selectedEmp:'',
  isActive: "A",
  startDate: null,
  contractStartDate: null,
  contractEndDate: null,
  approveAccess:null,
  selectedRole:'',
  selectedDesgn:''
});
  const dispatch = useDispatch();

const {openModal,closeModal,open} = useModal();


 


  const queryClient = useQueryClient();
  // post api


  const {mutate,isPending} = useMutation({
    mutationFn:assignProject,
    onSuccess:()=>{
      queryClient.invalidateQueries(["assignees",companyId,projId]);
      toast.success("Assignee added successfully.");
      closeModal();
    },
onError:(error)=>{
  const status = error?.res?.status;
  const message = error?.res?.message;

  if(status === 400)
  {
    toast.error(message || "Employee already exists")
  }
  else{
    toast.error("Failed to add employee")
  }
}
  })

// for displaying employees

  
  // for displaying approvers list

  // const {data:approverList,isPending:isApprovers,isError:isApproverError,error:approverListError}  = useQuery({
  //   queryKey:["approverList",companyId,projId],
  //   queryFn:()=>getProjectApprovers(companyId,projId),
  //   enabled:!!companyId

  // })


  // const approvals = approverList?.data ||[];



  // console.log("approverList",approvals);
  
useEffect(() => {
  if (hierarchyCustom === "Y" && approvals.length > 0) {
    setApprovalLevels(approvals);
  }
}, [hierarchyCustom, approvals]);


 useEffect(() => {
    if (companyId) {
      dispatch(fetchRoles(companyId));
    }
  }, [companyId]);

  
useEffect(() => {
  if (selectedRoleId) {
    getDesgn(selectedRoleId);
  } else {
    setDesgn([]);
  }
}, [selectedRoleId]);


useEffect(() => {
  if (selectedRoleId && roles.length > 0) {

    const role = roles.find(
      r => String(r.ROLE_ID) === String(selectedRoleId)
    );

    console.log("FOUND ROLE =>", role);

    setSelectedRoleCode(role?.ROLE_CODE || "");
  } else {
    setSelectedRoleCode("");
  }
}, [selectedRoleId, roles]);


  


   



   const filteredEmployees = employeesList.filter((emp) =>
    emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );




  const resetForm = ()=>{
    setFormData({
       selectedEmp:'',
  isActive: "A",
  startDate: null,
  contractStartDate: null,
  contractEndDate: null,
  approveAccess:null,
  selectedRole:'',
  selectedDesgn:''
    })
  }






  
const getDesgn = async (roleId) => {
  console.log("SELECTED ROLE ID =>", roleId);

  try {
    const res = await fetch(
      `http://localhost:3001/api/getDesignation?companyId=${companyId}&roleId=${roleId}`
    );

    const data = await res.json();
    setDesgn(data.data || []);
  } catch (err) {
    console.error(err);
  }
};


const updateForm = (key,value)=>{
    setFormData((prev)=>({
  ...prev,
        [key]:value
}))
      
    
}


const empid = selectedEmp;

console.log("EMPID",empid);


const handleSubmit = (e)=>{
    e.preventDefault();
  console.log("formdata",formData);

const selectedApprovers = approvalLevels.map((lvl) => ({
  levelNo: lvl.LEVEL_NO,
  empId: formData[`approver_${lvl.LEVEL_NO}`],
}));

  const payload = {
    ...formData,
    projId,
    email,
    orgId:companyId,
    startDate:DateFormat(formData.startDate),
    contractStart:DateFormat(formData.contractStartDate),
    contractEnd:DateFormat(formData.contractEndDate),
    hierarchyCustom,
    selectedRole:selectedRoleCode,
 approvalLevels: selectedApprovers,
    Hierachy,
    
  }
  console.log("payload",payload);
  mutate(payload);
  
}





  


 
  return (
    <>
      <button onClick={openModal}
      className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Add Assignee</button>
     <AppModal  isOpen={open}
        onClose={closeModal}
        size="lg"
        title="Add Assignee"
         footer={
                  <>
                    <Button color="gray" onClick={closeModal}>
                      Cancel
                    </Button>
        
                    <Button
                      className="bg-[#1c3681]"
                      onClick={handleSubmit}
                      // disabled={isPending}
                    >
                      createProject
                      {/* {isPending ? "Creating..." : "Create Project"} */}
                    </Button>
                  </>
                }
                >

               
    <form className="mt-4 space-y-6">

  <div className="space-y-6">

      <div className="relative">


  <FormLabel text="Search Assignee" required />

  <FormTextInput
    value={searchTerm}
    placeholder="Search employee"
    onChange={(val) => {
      setSearchTerm(val);
      setShowDropdown(true);
    }}
  />

  {showDropdown && (
    <div className="absolute z-20 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
      {filteredEmployees.length === 0 && (
        <p className="p-2 text-sm text-gray-500">
          No employees found
        </p>
      )}

      {filteredEmployees.map((emp) => (
        <div
          key={emp.EMP_ID}
          onClick={() => {
            updateForm("selectedEmp", emp.EMP_ID);
            setSearchTerm(emp.DISPLAY_NAME);
            setShowDropdown(false);
          }}
          className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
        >
          {emp.DISPLAY_NAME}
        </div>
      ))}
    </div>
  )}
</div>

</div>
   
     

      {/* SECTION: ROLE & STATUS */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Assignment Details
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FormLabel text="Role" required />
           <Select
  value={selectedRoleId}
  onChange={(e) => setSelectedRoleId(e.target.value)}
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
              <FormLabel text="Designation" required />

            <Select
              value={formData.selectedDesgn}
              onChange={(e) => updateForm("selectedDesgn",e.target.value)}
            >
              <option value="">Select Designation</option>
              {desgn.map((r) => (
                <option key={r.DESGN_ID} value={r.DESGN_CODE}>
                  {r.DESGN_NAME}
                </option>
              ))}
            </Select>
          </div>


        
        </div>
      </div>
   
{/* start period */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Start Period
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <FormDatePicker
              selected={formData.startDate}
              onChange={(date)=>updateForm("startDate",date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder:text-xs text-xs"
            />
          </div>
</div>
</div>

{/* contract period */}
 <div className="rounded-lg border border-gray-200 p-4">
  <h3 className="mb-3 text-sm font-semibold text-gray-700">
    Contract Period
  </h3>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    
    <div>
                  <FormLabel text="Contract Start" required />

      <FormDatePicker
        selected={formData.contractStartDate}
              onChange={(date)=>updateForm("contractStartDate",date)}
      
              placeholderText="YYYY-MM-DD"

        className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder:text-xs text-xs"
      />
    </div>

    <div>
                  <FormLabel text="Contract End" required />

      <FormDatePicker
        selected={formData.contractEndDate}
              onChange={(date)=>updateForm("contractEndDate",date)}
        dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"

        className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder:text-xs text-xs"
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


     {hierarchyCustom === "Y" && (
  <div className="rounded-lg border p-4 space-y-4">
    <h3 className="text-sm font-semibold text-gray-700">
      Define Approval Hierarchy
    </h3>

    {approvalLevels.map((lvl, index) => (
      <div key={lvl.LEVEL_NO} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        <FormLabel text={`Approver Level ${lvl.LEVEL_NO}`} required />

        <Select
          value={formData[`approver_${lvl.LEVEL_NO}`] || ""}
          onChange={(e) =>
            updateForm(`approver_${lvl.LEVEL_NO}`, e.target.value)
          }
        >
          <option value="">Select Employee</option>

          {approvals.map((emp) => (
            <option key={emp.EMP_ID} value={emp.EMP_ID}>
              {emp.DISPLAY_NAME}
            </option>
          ))}
        </Select>

      </div>
    ))}
  </div>
)}

    
    </form>

  

 </AppModal>
    </>
  );
}



export default AddAssignees


