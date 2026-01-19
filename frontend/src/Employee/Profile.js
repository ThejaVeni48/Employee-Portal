import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from 'primereact/inputswitch';

const Profile = () => {
  const location = useLocation();
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
  const empId = location?.state?.empId || "";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [roles, setRoles] = useState([]);
  const [desgn, setDesgn] = useState([]);
  const [access, setAccess] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employees,setEmployees] = useState([]);

  const [selectedRoleCode, setSelectedRoleCode] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDesgn, setSelectedDesgn] = useState("");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [selectedShift,setSelectedShift] = useState('');
  const [selectedRM,setSelectedRM] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [shiftDVisible,setShiftDVisible] = useState(false);
  const [reportingD,setReportingD] = useState(false);
  const [acessDialog,setAccessDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

      const [toggle,setToggle] = useState(false);
      const [checked, setChecked] = useState(false);
  
  // ------------------- Load Data -------------------
  useEffect(() => {
    if (empId && companyId) {
      getProfile();
    }
    getRoles();
    getAccess();
    getShifts();
    getReportingManagers();
  }, [empId, companyId]);


  useEffect(() => {
    if (selectedRoleCode && roles.length > 0) {
      const role = roles.find((r) => r.ROLE_CODE === selectedRoleCode);
      setSelectedRole(role?.ROLE_ID || "");
    } else {
      setSelectedRole("");
    }
  }, [selectedRoleCode, roles]);

  // Fetch designations when role changes
  useEffect(() => {
    if (selectedRole) getDesgn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  // Set form values when profile loads
  useEffect(() => {
    if (profile) {
      setSelectedRoleCode(profile.ROLE_CODE || "");
      setSelectedDesgn(profile.DESGN_CODE || "");

      const accessCodes = profile.ACCESS_CODES

        ? profile.ACCESS_CODES.split(",").map((c) => c.trim()).filter(Boolean)
        : [];
      setSelectedAccess(accessCodes);
    }
  }, [profile]);


  console.log("selectedAccess",selectedAccess);


  console.log("profle",profile);
  
  

  // ------------------- API Calls -------------------
  const getProfile = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/empProfile?empId=${empId}&orgId=${companyId}`
      );
      const data = await res.json();

      console.log("data for profolr",data);
      

      const rows = data?.data || [];
      if (rows.length === 0) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const grouped = {
  ...rows[0],

  ACCESS_CODE: [...new Set(rows
    .filter(r => r.STATUS === "A")
    .map(r => r.ACCESS_CODE)
    .filter(Boolean)
  )].join(", "),

  ACCESS_NAME: [...new Set(rows
    .filter(r => r.STATUS === "A")
    .map(r => r.ACCESS_NAME)
    .filter(Boolean)
  )].join(", "),
};


      setProfile(grouped);

      const xy = rows[0].TIMESHEET_EXIST ;
      setToggle(xy===1  )
     console.log("rows",rows);
     
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getOrgRole?companyId=${companyId}`
      );
      const data = await res.json();
      setRoles(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getShifts = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getShifts?orgId=${companyId}`
      );
      const data = await res.json();
      setShifts(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getDesgn = async () => {
    console.log("SELECTEDROLE",selectedRole);
    
    try {
      const res = await fetch(
        `http://localhost:3001/api/getDesignation?companyId=${companyId}&roleId=${selectedRole}`
      );
      const data = await res.json();
      console.log("data",data);
      
      setDesgn(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getAccess = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getOrgAccess?companyId=${companyId}`
      );
      const data = await res.json();
      setAccess(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  const getReportingManagers = async()=>{
    try {
      
      const data = await fetch(`http://localhost:3001/api/getEmployees?companyId=${companyId}`);


      if(!data.ok)
      {
        throw new Error("Network was not good");
        
      }

      const res = await data.json();
      setEmployees(res.data || []);

      
    } catch (error) {
      console.error("Error occured",error);
      
    }
  }



  // ------------------- Save api -------------------
  const saveBasicDetails = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/updateDetails", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          orgId:companyId,
          mobile: profile.MOBILE_NUMBER,
          status:profile.STATUS
        }),
      });
      const data = await res.json();
      alert(data.message || "Basic details updated successfully");
      setIsEditing(false);
      getProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update basic details");
    }
  };

  const saveResponsibilities = async () => {
    if (!selectedRoleCode) {
      alert("Please select a Role");
      return;
    }
    console.log("selectedRoleCode",selectedRoleCode);
    console.log("selectedDesgn",selectedDesgn);
    // console.log("selectedAccess",selectedAccess);
    

    try {
      const res = await fetch("http://localhost:3001/api/assignRes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          email,
          companyId,
          selectedRoleCode,
          selectedDesgn,
          // selectedAccess,
        }),
      });
      const data = await res.json();
      alert(data.message || "Responsibilities assigned successfully!");
      setDialogVisible(false);
      setIsEditMode(false);
      getProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to assign responsibilities");
    }
  };

    const saveAccess = async () => {
    if (!selectedAccess) {
      alert("Please select a Role");
      return;
    }

    console.log("selectedAccess",selectedAccess);
    

    try {
      const res = await fetch("http://localhost:3001/api/assignAccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          email,
          companyId,

          selectedAccess,
        }),
      });
      const data = await res.json();
      alert(data.message || "Responsibilities assigned successfully!");
      // setAccessDialog(false);
      setIsEditMode(false);
      getProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to assign responsibilities");
    }
  };

  // ================================= save shift ==========================================

 const saveShift = async () => {
    if (!selectedShift) {
      alert("Please select a Shift");
      return;
    }
    // console.log("selectedRoleCode",selectedRoleCode);
    // console.log("selectedDesgn",selectedDesgn);
    // console.log("selectedAccess",selectedAccess);


    console.log("selectd Shift",selectedShift);
    
    

    try {
      const res = await fetch("http://localhost:3001/api/assignShift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          email,
          orgId:companyId,
          shiftCode:selectedShift,
        }),
      });
      const data = await res.json();
      alert(data.message || "Responsibilities assigned successfully!");
      setDialogVisible(false);
      setIsEditMode(false);
      getProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to assign responsibilities");
    }
  };



  useEffect(() => {
  if (dialogVisible && profile && access.length > 0) {
    const accessCodes = profile.ACCESS_CODES
      ? profile.ACCESS_CODES.split(",").map(c => c.trim())
      : [];

    setSelectedAccess(accessCodes);
  }
}, [dialogVisible, access]);

  // ------------------- Dialog openers -------------------
  const openAddDialog = () => {
    setIsEditMode(false);
    setSelectedRoleCode("");
    setSelectedRole("");
    setSelectedDesgn("");
    setSelectedAccess([]);
    setDialogVisible(true);
  };

  const openEditDialog = () => {
  setIsEditMode(true);
  setSelectedRoleCode(profile.ROLE_CODE || "");
  setSelectedDesgn(profile.DESGN_CODE || "");
  setDialogVisible(true);
};


const openAddShiftDialog = () => {
    setIsEditMode(false);
    
    setShiftDVisible(true);
  };



  const openEditShiftDialog = () => {
  setIsEditMode(true);
  
  setShiftDVisible(true);
};

const openAddAccessDialog = () => {
    setIsEditMode(false);
    
    setAccessDialog(true);
  };



  const openEditAccessDialog = () => {
  setIsEditMode(true);
  
  setAccessDialog(true);
};


const openAddReportingDialog = () => {
    setIsEditMode(false);
    
    setReportingD(true);
  };



  const openEditReportingDialog = () => {
  setIsEditMode(true);
  
  setReportingD(true);
};

  // const openEditDialog = () => {
  //   setIsEditMode(true);
  //   setSelectedRoleCode(profile.ROLE_CODE || "");
  //   setSelectedDesgn(profile.DESGN_CODE || "");

  //   const accessCodes = profile.ACCESS_CODE
  //     ? profile.ACCESS_CODE.split(",").map((c) => c.trim())
  //     : [];
  //   setSelectedAccess(accessCodes);

  //   setDialogVisible(true);
  // };

  if (loading) return <h3>Loading Profile...</h3>;
  if (!profile) return <h3>Profile not found</h3>;

  const noResponsibilities =
    (!profile.ROLE_CODE || profile.ROLE_CODE.trim() === "") &&
    (!profile.DESGN_CODE || profile.DESGN_CODE.trim() === "") &&
    (!profile.ACCESS_CODE || profile.ACCESS_CODE.trim() === "");


    const handleTimesheetToggle = (value) => {
  setChecked(value);

  if (value === true) {
    console.log("Toggle turned ON");
    generateTimesheets();
  }
};



 const generateTimesheets = async()=>{

   
try {
      const res = await fetch("http://localhost:3001/api/allocateTimesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          email,
          orgId:companyId,
          startDate:profile.START_DATE,
        
        }),
      });
      const data = await res.json();
      console.log("data",data);
      
    
    } catch (err) {
      console.error(err);
      alert("Failed to assign responsibilities");
    }


    
  
 }


 // api for saving reporting manager.
 

 const saveRM = async()=>{

  console.log("");
  
  try {
      const res = await fetch("http://localhost:3001/api/allocateRM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          email,
          orgId:companyId,
          managerId:selectedRM        
        }),
      });
      const data = await res.json();
      console.log("data",data);
      
    
    } catch (error) {
    console.error("Error occured",error);
    
  }
 }


  return (
    <div className="profile-wrapper">
      <h2>Employee Profile - {profile.EMP_ID}</h2>

      {/* ========== BASIC DETAILS ========== */}
      <div className="profile-section">
        <div>

        <h3>Basic Detailas</h3>

 <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
        <div className="profile-row">
          <label>First Name:</label>
        
            
            <span>
              {profile.FIRST_NAME}
            </span>
         
        </div>

        <div className="profile-row">
          <label>Last Name:</label>
        
            <span>
              {profile.LAST_NAME} 
            </span>
        
        </div>

        <div className="profile-row">
          <label>Email:</label>
          <span>{profile.EMAIL}</span>
        </div>

        <div className="profile-row">
          <label>Joinig Date:</label>
          <span>{profile.START_DATE}</span>
        </div>

        <div className="profile-row">
          <label>Contact:</label>
          {isEditing ? (
            <input
              value={profile.MOBILE_NUMBER || ""}
              onChange={(e) => setProfile({ ...profile, MOBILE_NUMBER: e.target.value })}
            />
          ) : (
            <span>
              {profile.MOBILE_NUMBER}
            </span>
          )}
        </div>

         <div className="profile-row">
  <label>Status:</label>

  {isEditing ? (
    <select
      value={profile.STATUS || ""}
      onChange={(e) =>
        setProfile({ ...profile, STATUS: e.target.value })
      }
    >
      <option value="">Select Status</option>
      <option value="A">Active</option>
      <option value="I">Inactive</option>
    </select>
  ) : (
    <span>
      {profile.STATUS === "A"
        ? "Active"
        : profile.STATUS === "I"
        ? "Inactive"
        : "-"}
    </span>
  )}
</div>


        {isEditing && (
          <div className="profile-actions">
            <button className="save-btn" onClick={saveBasicDetails}>
              Save Basic Details
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ========== RESPONSIBILITIES ========== */}
      <div className="profile-section">
        <h3>Responsibilities</h3>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          {noResponsibilities ? (
            <button className="save-btn" onClick={openAddDialog}>
              Add Responsibilities
            </button>
          ) : (
            <button className="save-btn" onClick={openEditDialog}>
              Edit Responsibilities
            </button>
          )}
        </div>

        <div className="profile-row">
          <label>Role:</label>
          <span>{profile.ROLE_NAME || "Not Assigned"}</span>
        </div>

        <div className="profile-row">
          <label>Designation:</label>
          <span>{profile.DESGN_NAME || "Not Assigned"}</span>
        </div>


         <div className="profile-row">
          <label>Timesheet Customization:</label>
                 <InputSwitch checked={checked} onChange={(e) => handleTimesheetToggle(e.value)}  disabled={toggle}/>
        </div>
      </div>

    {/* Access Allocation */}

     <div className="profile-section">
        <h3>Responsibilities</h3>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          {noResponsibilities ? (
            <button className="save-btn" onClick={openAddAccessDialog}>
              Add Responsibilities
            </button>
          ) : (
            <button className="save-btn" onClick={openEditAccessDialog}>
              Edit Responsibilities
            </button>
          )}
        </div>

        
        <div className="profile-row">
          <label>Access:</label>
          <span>{ profile.ACCESS_CODES || "No Access Assigned"}</span>
        </div>
      </div>

    {/* ======== Shift Allocation ========== */}


     <div className="profile-section">
        <h3>Shift Allocation</h3>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          {noResponsibilities ? (
            <button className="save-btn" onClick={openAddShiftDialog}>
              Add Shift
            </button>
          ) : (
            <button className="save-btn" onClick={openEditShiftDialog}>
              Modify Shift
            </button>
          )}
        </div>
 <div className="profile-row">
          <label>Shift Type:</label>
          <span>{ profile.SHIFT_CODE || "No Shift Assigned"}</span>
        </div>

        </div>
      


      {/* Assign Hr and Manager */}

        <div className="profile-section">
        <h3> Reporting Manager And HR Allocation</h3>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          {noResponsibilities ? (
            <button className="save-btn" onClick={openAddReportingDialog}>
              Add  Reporting manager
            </button>
          ) : (
            <button className="save-btn" onClick={openEditReportingDialog}>
              Modify Reporting Manager
            </button>
          )}
        </div>
 <div className="profile-row">
          <label>Reporting Manager :</label>
          <span>{ profile.SHIFT_CODE1 || "No Reporting Manager Assigned"}</span>
        </div>

        </div>

    {/* Dialog for responsibilities */}
      <Dialog
        header="Manage Responsibilities"
        visible={dialogVisible}
        style={{ width: "35vw" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="profile-row" style={{ marginBottom: 12 }}>
          <label>Role:</label>
          <select value={selectedRoleCode} onChange={(e) => setSelectedRoleCode(e.target.value)}>
            <option value="">-- Select Role --</option>
            {roles.map((r) => (
              <option key={r.ROLE_ID} value={r.ROLE_CODE}>
                {r.ROLE_NAME}
              </option>
            ))}
          </select>
        </div>


        <div className="profile-row" style={{ marginBottom: 12 }}>
          <label>Designation:</label>
          <select
            value={selectedDesgn}
            onChange={(e) => setSelectedDesgn(e.target.value)}
            disabled={!selectedRole}
          >
            <option value="">-- Select Designation --</option>
            {desgn.map((d) => (
              <option key={d.DESGN_ID} value={d.DESGN_CODE}>
                {d.DESGN_NAME}
              </option>
            ))}
          </select>
        </div>

      

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="save-btn" onClick={saveResponsibilities}>
            Save
          </button>
        </div>
      </Dialog>

      {/* Dialog for access controls */}

 <Dialog
        header="Manage Shift"
        visible={acessDialog}
        style={{ width: "35vw" }}
        onHide={() => setAccessDialog(false)}
      >
         <div className="profile-row" style={{ marginBottom: 12 }}>
          <label>Access Levels:</label>
          <MultiSelect
            value={selectedAccess}
            options={access}
            onChange={(e) => {setSelectedAccess(e.value); console.log("selected value",e.value)}
            }
            optionLabel="ACCESS_NAME"
            optionValue="ACCESS_CODE"
            display="chip"
            placeholder="Select Access Levels"
            style={{ width: "100%" }}
          />
        </div>

      
       

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="save-btn" onClick={saveAccess}>
            Save
          </button>
        </div>
      </Dialog>

{/* Dialog for Shift */}
       <Dialog
        header="Manage Shift"
        visible={shiftDVisible}
        style={{ width: "35vw" }}
        onHide={() => setShiftDVisible(false)}
      >
        <div className="profile-row" style={{ marginBottom: 12 }}>
          <label>Shift:</label>
          <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
            <option value="">-- Select Shift --</option>
            {shifts.map((r) => (
              <option key={r.SHIFT_ID} value={r.SHIFT_CODE}>
                {r.SHIFT_NAME} -{r.SHIFT_DETAIL_TYPE}
              </option>
            ))}
          </select>
        </div>

      
       

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="save-btn" onClick={saveShift}>
            Save
          </button>
        </div>
      </Dialog>




  {/* Dialog for assigning manager and hr */}

    <Dialog
        header="Manage Reporting Manager and HR"
        visible={reportingD}
        style={{ width: "35vw" }}
        onHide={() => setReportingD(false)}
      >
        <div className="profile-row" style={{ marginBottom: 12 }}>
          <label>Reporing Manager:</label>
          <select value={selectedRM} onChange={(e) => setSelectedRM(e.target.value)}>
            <option value="">-- Select Reporting Manager --</option>
            {employees.map((r) => (
              <option key={r.USER_ID} value={r.EMP_ID}>
                {r.DISPLAY_NAME}
              </option>
            ))}
          </select>
        </div>

      
       

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="save-btn" onClick={saveRM}>
            Save
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
