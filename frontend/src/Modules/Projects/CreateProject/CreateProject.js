import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineFileUpload } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import HierarchyBuilder from "../../../utility/HierarchyBuilder";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../../apis/Project/CreateProject";

import toast from "react-hot-toast";

import useModal from "../../../components/hooks/useModal";
import AppModal from "../../../components/Modals/AddModal";

import { Button } from "flowbite-react";
import {EmpList} from '../../../apis/Employee/EmpList';
import FormLabel from "../../../components/FormLabel/FormLabel";
import FormTextInput from "../../../components/FormInput/FormInput";
import DateFormat from "../../../utility/dateFormat";

const CreateProject = () => {
  const email = useSelector((state) => state.user.email);
  const companyId = useSelector((state) => state.user.companyId);

  const queryClient = useQueryClient();
  const { open, openModal, closeModal } = useModal();
  const [employeeSearch, setEmployeeSearch] = useState("");
const [selectedApprover, setSelectedApprover] = useState(null);


  const [approvalLevels, setApprovalLevels] = useState([]);

const [pmSearch, setPmSearch] = useState("");

  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    projectCode: "",
    clientName: "",
    startDate: null,
    endDate: null,
    status: "",
    billable: "",
    projDesc: "",
    hierarchyRequired: "",
    projectManager: "",
    hierarchyCustom: "",
  });


  // post api

    const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects", companyId]);
      toast.success("Project Created Successfully");
      resetForm();
      closeModal();
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });


  // get api

   const {data,isPending:isEmployee,isError,error} = useQuery({

    queryKey:["employeesList",companyId],
    queryFn:()=> EmpList(companyId),
    enabled: !!companyId
   }) 


   if(isEmployee) return<p>Loading Employees</p>

   if(isError)
    return <p className="text-red-500">{error.message}</p>;


   const employeesList = data.data || [] ;

   const filteredPMEmployees = employeesList.filter((emp) =>
  emp.DISPLAY_NAME
    .toLowerCase()
    .includes(pmSearch.toLowerCase())
);




   console.log("employeesList",employeesList);
   

  const handleChange = (field, value) => {
    setProjectDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHierarchyToggle = (value) => {
    handleChange("hierarchyRequired", value);

    if (value === "no") {
      setApprovalLevels([]);
      handleChange("hierarchyCustom", "");
    }
  };


  const validateForm = () => {
  const newErrors = {};

  if (!projectDetails.projectName.trim()) {
    newErrors.projectName = "Project Name is required";
  }

  if (!projectDetails.projectCode.trim()) {
    newErrors.projectCode = "Project Code is required";
  }

  if (!projectDetails.clientName.trim()) {
    newErrors.clientName = "Client Name is required";
  }

  if (!projectDetails.startDate) {
    newErrors.startDate = "Start Date is required";
  }

  if (!projectDetails.endDate) {
    newErrors.endDate = "End Date is required";
  }

  // 🔔 show each error in toast
  Object.values(newErrors).forEach((msg) => {
    toast.error(msg);
  });

  return Object.keys(newErrors).length === 0;
};


  const resetForm = () => {
    setProjectDetails({
      projectName: "",
      projectCode: "",
      clientName: "",
      startDate: null,
      endDate: null,
      status: "",
      billable: "",
      projDesc: "",
      hierarchyRequired: "",
      projectManager: "",
      hierarchyCustom: "",
    });

    setApprovalLevels([]);
  };

  // ------------------ SUBMIT ------------------

  const handleSubmit = (e) => {
    e.preventDefault();

  //  if (!validateForm()) return;

    // VALIDATION
    if (
      projectDetails.hierarchyRequired === "yes" &&
      approvalLevels.length === 0
    ) {
      toast.error("Please configure approval hierarchy");
      return;
    }

    if (
      projectDetails.hierarchyRequired === "yes" &&
      !projectDetails.hierarchyCustom
    ) {
      toast.error("Please choose hierarchy type");
      return;
    }

    if (
      projectDetails.hierarchyRequired === "no" &&
      !projectDetails.projectManager
    ) {
      toast.error("Project Manager is required");
      return;
    }


    const payload = {
  ...projectDetails,
  companyId,
  email,
  startDate: DateFormat(projectDetails.startDate),
  endDate: DateFormat(projectDetails.endDate),

  approvalLevels: approvalLevels.map((lvl) => ({
    levelNo: lvl.levelNo,
    approverId: lvl.approver?.EMP_ID || null,
  })),
};


    console.log("PAYLOAD",payload);
    
    mutate(payload);
  };

  // ------------------ UI ------------------

  return (
    <>
      {/* TOP ACTION BAR */}
      <div className="flex items-center gap-3 flex-wrap border-2">
        <button
          onClick={openModal}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Create Project
        </button>

        <button className="px-4 py-2 rounded-md bg-blue-100 text-blue-800 text-sm flex items-center gap-2">
          <MdOutlineFileUpload size={18} />
          Upload File
        </button>
      </div>

      {/* MODAL */}
      <AppModal
        isOpen={open}
        onClose={closeModal}
        size="lg"
        title="Create Project"
        footer={
          <>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              className="bg-[#1c3681]"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* BASIC INFO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel text = "Project Name" required/>
                <FormTextInput
                  value={projectDetails.projectName}
                  onChange={(val) =>
                    handleChange("projectName",val)
                  }
                  required
                />
              </div>

              <div>
                <FormLabel text = "ProjectCode" required/>
                <FormTextInput
                  value={projectDetails.projectCode}
                  onChange={(val) =>
                    handleChange("projectCode", val)
                  }
                  required
                />
              </div>

              <div className="col-span-2">
                <FormLabel text="Client Name" required/>
                <FormTextInput
                  value={projectDetails.clientName}
                  onChange={(val) =>
                    handleChange("clientName",val)
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* DATES */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Project Duration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel text='Start Date' required/>
                <DatePicker
                  selected={projectDetails.startDate}
                  onChange={(date) => handleChange("startDate", date)}
                    className="input"
                />
              </div>

              <div>
                <FormLabel text="End Date" required/>
                <DatePicker
                  selected={projectDetails.endDate}
                  onChange={(date) => handleChange("endDate", date)}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel text="Status" required/>
              <select
                className="input"
                value={projectDetails.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Select</option>
                <option value="A">Active</option>
                <option value="H">On Hold</option>
                <option value="C">Closed</option>
              </select>
            </div>

            <div>
              <FormLabel text='Billable Type' required/>
              <select
                className="input"
                value={projectDetails.billable}
                onChange={(e) => handleChange("billable", e.target.value)}
              >
                <option value="">Select</option>
                <option value="Y">Billable</option>
                <option value="N">Non-Billable</option>
              </select>
            </div>
          </div>

          {/* projDesc */}
          <div>
            <FormLabel text='Description' required/>
            <textarea
              rows="3"
              className="input"
              value={projectDetails.projDesc}
              onChange={(e) => handleChange("projDesc", e.target.value)}
            />
          </div>

          {/* APPROVAL CONFIG */}
          <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Approval Configuration
            </h3>

            {/* YES / NO */}
            <div>
              <FormLabel text="Hierarchy Required" required/>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value="yes"
                    checked={projectDetails.hierarchyRequired === "yes"}
                    onChange={(e) =>
                      handleHierarchyToggle(e.target.value)
                    }
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value="no"
                    checked={projectDetails.hierarchyRequired === "no"}
                    onChange={(e) =>
                      handleHierarchyToggle(e.target.value)
                    }
                  />
                  No
                </label>
              </div>
            </div>

            {/* NON HIERARCHY */}
            {projectDetails.hierarchyRequired === "no" && (
           <div className="relative">
  <FormTextInput
    value={
      projectDetails.projectManager?.DISPLAY_NAME ||
      pmSearch
    }
    placeholder="Search Project Manager"
    onChange={(val) => setPmSearch(val)}
  />

  {pmSearch && (
    <div className="absolute z-20 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
      {filteredPMEmployees.length === 0 && (
        <p className="p-2 text-sm text-gray-500">
          No employees found
        </p>
      )}

      {filteredPMEmployees.map((emp) => (
        <div
          key={emp.EMP_ID}
          onClick={() => {
            handleChange("projectManager", emp);
            setPmSearch("");
          }}
          className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
        >
          {emp.DISPLAY_NAME}
        </div>
      ))}
    </div>
  )}
</div>

            )}


            


            {/* HIERARCHY BUILDER */}
            {projectDetails.hierarchyRequired === "yes" && (
              <>
<HierarchyBuilder
  levels={approvalLevels}
  onChange={setApprovalLevels}
  employeesList={employeesList}
/>


                <div>
                  <FormLabel text="Choose Hierarchy Type" required />
                  <select
                    className="input max-w-xs"
                    value={projectDetails.hierarchyCustom}
                    onChange={(e) =>
                      handleChange("hierarchyCustom", e.target.value)
                    }
                  >
                    <option value="">Select Option</option>
                    <option value="Y">Customization</option>
                    <option value="N">Apply for All</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default CreateProject;
