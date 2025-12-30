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

  const [selectedRoleCode, setSelectedRoleCode] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDesgn, setSelectedDesgn] = useState("");
  const [selectedAccess, setSelectedAccess] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setToggle(xy===1)
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

  // ------------------- Save Handlers -------------------
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
    console.log("selectedAccess",selectedAccess);
    

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
          selectedAccess,
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
          <label>Access:</label>
          <span>{ profile.ACCESS_CODES || "No Access Assigned"}</span>
        </div>

         <div className="profile-row">
          <label>Timesheet Customization:</label>
                 <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)}  disabled={toggle}/>
        </div>
      </div>
      

      {/* Manage Dialog */}
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
          <button className="save-btn" onClick={saveResponsibilities}>
            Save
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
