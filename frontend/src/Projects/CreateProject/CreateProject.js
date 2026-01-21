import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineFileUpload } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import HierarchyBuilder from "../../utility/HierarchyBuilder";
import DateFormat from "../../utility/dateFormat";

const CreateProject = () => {
  const email = useSelector((state) => state.user.email);
  const companyId = useSelector((state) => state.user.companyId);

  const [isOpen, setIsOpen] = useState(false);

  //  const [approvalLevels, setApprovalLevels] = useState([]);


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
  supportIdentifier:''
});



  const handleChange = (field, value) => {
    setProjectDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("payload",{
      ...projectDetails,
      startDate:DateFormat(projectDetails.startDate),
      endDate:DateFormat(projectDetails.endDate),
      companyId,
      email,
    });
 try {
        const res = await fetch
        ("http://localhost:3001/api/addProject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
           ...projectDetails,
           startDate:DateFormat(projectDetails.startDate),
      endDate:DateFormat(projectDetails.endDate),
      companyId,
      email,
          }),
        });
  
        const data = await res.json();
        console.log("DATA",data);
        if(data.status ===200)
        {
          alert("Project created successfully");
          setIsOpen(false);
          resetForm();
        }
        
      
      } catch (err) {
        console.error(err);
      }


    
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
    supportIdentifier: "",
  });
};



  return (
    <>
      {/* TOP ACTION BAR */}
 <div className="flex items-center gap-3 flex-wrap border-2">
          <button
          onClick={() => setIsOpen(true)}
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
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-xl font-semibold text-[#1c3681] border-b pb-3">
              Create Project
            <DateFormat/>
            </DialogTitle>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* BASIC INFO */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Project Name *</label>
                    <input
                      className="input"
                      value={projectDetails.projectName}
                      onChange={(e) =>
                        handleChange("projectName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Project Code *</label>
                    <input
                      className="input"
                      value={projectDetails.projectCode}
                      onChange={(e) =>
                        handleChange("projectCode", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="label">Client Name *</label>
                    <input
                      className="input"
                      value={projectDetails.clientName}
                      onChange={(e) =>
                        handleChange("clientName", e.target.value)
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
                    <label className="label">Start Date *</label>
                    <DatePicker
                      selected={DateFormat(projectDetails.startDate)}
                      onChange={(date) => handleChange("startDate", date)}
                      className="input"
                      // minDate={new Date()}
                      placeholderText="Select start date"
                    />
                  </div>

                  <div>
                    <label className="label">End Date *</label>
                    <DatePicker
                      selected={projectDetails.endDate}
                      onChange={(date) => handleChange("endDate", date)}
                      className="input"
                      // minDate={projectDetails.startDate || new Date()}
                      placeholderText="Select end date"
                    />
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input"
                    value={projectDetails.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>



                <div>
                  <label className="label">Billing Type</label>
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
 {/* HIERARCHY YES / NO */}
  <div>
    <label className="label mb-2">Hierarchy Required *</label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="radio"
          value="yes"
          checked={projectDetails.hierarchyRequired === "yes"}
          onChange={(e) => handleChange("hierarchyRequired", e.target.value)}
        />
        Yes
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="radio"
          value="no"
          checked={projectDetails.hierarchyRequired === "no"}
          onChange={(e) => handleChange("hierarchyRequired", e.target.value)}
        />
        No
      </label>
    </div>
  </div>


  {/* support identifier */}
   <div>
                <label  className="label">Support Identifier</label>
                <input
                  id="supportIdentifier"
                  value={projectDetails.supportIdentifier}
                  onChange={(e) => setProjectDetails({ ...projectDetails, supportIdentifier: e.target.value })}
                  placeholder="e.g., JIRA-TS-001 / SUP-APAC-23"
                     className="input"
                />
              </div>
            

              {/* NOTES */}
              <div>
                <label className="label">Description</label>
                <textarea
                  rows="3"
                  className="input"
                  value={projectDetails.projDesc}
                  onChange={(e) => handleChange("projDesc", e.target.value)}
                />
              </div>



 

 



              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm border rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md bg-[#1c3681] text-white"
                >
                  Create Project
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default CreateProject;
