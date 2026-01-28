import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState,useEffect } from "react";
import { 
 
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../Redux/actions/roleActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateFormat from "../../../utility/dateFormat";




const UpdateAssignee = ({project={}})=>{

  console.log("project",project);
  

  const dispatch = useDispatch();
const [selectedRoleCode, setSelectedRoleCode] = useState("");

  const [openModal, setOpenModal] = useState(false);
const [selectedRoleId, setSelectedRoleId] = useState("");

  console.log("project",project);
  const roles = useSelector((state) => state.roles.roleList);
  const companyId = useSelector((state) => state.user.companyId);
   const [desgn,setDesgn] = useState([]);

  const [formData,setFormData] = useState({
    checkedValue:'',
    extendStartDate:'',
    extendEndDate:'',
    role:'',
    desgn:'',
    newStartDate:null,
    newEndDate:null
  })
  

  const handleChange = (key,value)=>{
    setFormData((prev)=>({
        ...prev,
        [key]:value
    }))

  }

  useEffect(() => {
      if (companyId) {
        dispatch(fetchRoles(companyId));
        // getEmployees();
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


    const handleUpdate = async()=>{
        // console.log("formata",formData);
        const payload = {
            ...formData,
            empId:project.EMP_ID,
            role:selectedRoleCode,
            contractStart:DateFormat(formData.newStartDate),
            contractEnd:DateFormat(formData.newEndDate),
            orgId:companyId,
            projId:project.PROJ_ID

        }
        console.log("payload",payload);
        
        try {
      const response = await fetch("http://localhost:3001/api/changeStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) })


        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Network response was not ok: ${errText}`);
      }
const res = await response.json();
      console.log("res",res);
      
      if(res.status === 200)
      {
alert(res.message);
setOpenModal(false);
        // getProjectEmployee();
        // console.log("Assign project response:", res);
        // setVisible(false);
      }
    }
    catch(error)
    {
        console.error("error occured",error);
        
    }
}


     
    return(
        <>
        
         <button onClick={() => setOpenModal(true)}
      className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">edit Assignee</button>
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
  <ModalHeader>Update Assignee</ModalHeader>

  <ModalBody>
    <div className="space-y-6">

      {/* Employee Info */}
      <div className="rounded-lg bg-gray-50 p-4 border">
        <p className="font-semibold text-gray-800">{project.DISPLAY_NAME}</p>
        <p className="text-sm text-gray-600">
          Current Role: <span className="font-medium">{project.ROLE_CODE}</span>
        </p>
      </div>

      {/* Exit / Extend */}
      <div className="space-y-2">
        <Label value="Action *" />

        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="I"
              checked={formData.checkedValue === "I"}
              onChange={(e) =>
                handleChange("checkedValue", e.target.value)
              }
            />
            <span className="text-sm">Exit</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="E"
              checked={formData.checkedValue === "E"}
              onChange={(e) =>
                handleChange("checkedValue", e.target.value)
              }
            />
            <span className="text-sm">Extend</span>
          </label>
        </div>
      </div>

      {/* Extend Section */}
      {formData.checkedValue === "E" && (
        <div className="space-y-5 border rounded-lg p-5 bg-white">

          <h3 className="font-semibold text-gray-700">
            New Assignment Details
          </h3>

          {/* Role & Designation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label value="Role *" />
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
              <Label value="Designation *" />
              <Select
                value={formData.selectedDesgn}
                onChange={(e) =>
                  handleChange("selectedDesgn", e.target.value)
                }
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

          {/* Contract Period */}
          <div className="rounded-lg border p-4 bg-gray-50">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              Contract Period
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label value="Contract Start *" />
                <DatePicker
                  selected={formData.newStartDate}
                  onChange={(date) =>
                    handleChange("newStartDate", date)
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <Label value="Contract End *" />
                <DatePicker
                  selected={formData.newEndDate}
                  onChange={(date) =>
                    handleChange("newEndDate", date)
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  </ModalBody>

  <ModalFooter className="flex justify-end gap-3">
    <Button color="gray" onClick={() => setOpenModal(false)}>
      Cancel
    </Button>

    <Button color="blue" onClick={handleUpdate}>
      Update Assignee
    </Button>
  </ModalFooter>
</Modal>

        </>
    )







}



export default UpdateAssignee