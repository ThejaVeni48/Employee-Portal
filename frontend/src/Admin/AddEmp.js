import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "primereact/button";
import { SlCalender } from "react-icons/sl";
import { useLocation } from "react-router-dom";
import "./AddEmpStyles.css";
import moment from 'moment';

const AddEmp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [phnNumber, setPhnNumber] = useState("");
  const [empStatus, setEmpStatus] = useState("");
  const [emailID, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [hireDate, setHireDate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [depts, setDepts] = useState([]);
  const [empId,setEmpId] = useState('');
  const [education, setEducation] = useState([{ degree: "", university: "", year: "" }]);
;
 const email = useSelector((state) => state.user.email);


  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const companyId = useSelector((state) => state.user.companyId);
  const location = useLocation();
  const createdBy = location.state?.createdBy || "";

  console.log("companyId",companyId);

  

  const handleDateChange = (date) => setHireDate(date);

  console.log("selectedROle", selectedRole);

const handleCreateEmployee = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/addEmp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employees: [
          {
            firstName,
            lastName,
            emailID,
            gender,
            empId,
            empStatus,
            companyId,
            hireDate:moment(hireDate).format('YYYY-MM-DD'),
            // selectedRole,
            middleName,
            phnNumber,
            displayName,
            createdBy,
            education,
          },
        ],
        companyId,
        email,
      }),
    });

    

    const data = await res.json();

    if (res.status === 201) { // check HTTP status code, not data.status
      alert(data.message); // show message from backend

      // Reset all fields
      setFirstName("");
      setLastName("");
      setMiddleName("");
      setDisplayName("");
      setGender("");
      setPhnNumber("");
      setEmpStatus("");
      setEmail("");
      setEmpId("");
      setSelectedRole("");
      setDept("");
      setHireDate(null);
      setEducation({ degree: "", university: "", year: "" });

      // Reset to first tab if using multi-step form
      setActiveIndex(0);
    } else {
      // Show backend error message
      alert(data.message || "Failed to create employee");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while creating employee.");
  }
};


 

  console.log("roles", roles);

  return (
    <div className="addemployee-wrapper">
      <div className="addemployee-header">
        <h4>Add Employee</h4>
      </div>

      {/* Step Indicators */}
      <div className="addemployee-section-headers">
        <Button
          rounded
          outlined={activeIndex !== 0}
          label="1"
          className="addemployee-buttons"
          onClick={() => setActiveIndex(0)}
        />
        <Button
          rounded
          outlined={activeIndex !== 1}
          label="2"
          className="addemployee-buttons"
          onClick={() => setActiveIndex(1)}
        />
      </div>

      <div className="addemployee-section-forms-container">
        {/* Step 1: Basic Info */}
        {activeIndex === 0 && (
          <div className="addemployee-section-one">
            <h4>Basic Information</h4>
            <form className="addemployee-section-form">
              <div className="addemployee-input-containers">
                <label>First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Display Name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Start Date *</label>
                <div className="addemployee-date-container">
                  <DatePicker
                    selected={hireDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Choose Date"
                    className="custom-date-picker addemployee-datepicker"
                  />
                  <SlCalender />
                </div>
              </div>
              <div className="addemployee-input-containers">
                <label>Employee Id *</label>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  value={phnNumber}
                  onChange={(e) => setPhnNumber(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={emailID}
                  onChange={(e) => setEmail(e.target.value)}
                  className="addemployee-input-fields"
                />
              </div>

              <div className="addemployee-input-containers">
                <label>Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="addemployee-input-fields"
                >
                  <option>---Select Gender---</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Others</option>
                </select>
              </div>


                      {/* aDD HERE AS ACTIVE AND IN ACTIVE */}
              {/* <div className="addemployee-input-containers">
                <label>Employee Status *</label>
                <select
                  value={empStatus}
                  onChange={(e) => setEmpStatus(e.target.value)}
                  className="addemployee-input-fields"
                >
                  <option>---Select---</option>
                  <option></option>
                  <option>Internship</option>
                </select>
              </div> */}

             

             
            </form>
          </div>
        )}

        {/* Step 2: Education Details */}
        {activeIndex === 1 && (
          <div className="addemployee-section-two">
            <h4>Education Details</h4>
            <form className="addemployee-section-form">
              <div className="addemployee-input-containers">
                <label>Degree</label>
                <input
                  type="text"
                  value={education[0].degree}
onChange={(e) => {
    const updated = [...education];
    updated[0].degree = e.target.value;
    setEducation(updated);
}}
                  className="addemployee-input-fields"
                  

                />
              </div>
              <div className="addemployee-input-containers">
                <label>University/College</label>
                <input
                  type="text"
                 value={education[0].university}
onChange={(e) => {
    const updated = [...education];
    updated[0].university = e.target.value;
    setEducation(updated);
}}
                  className="addemployee-input-fields"
                />
              </div>
              <div className="addemployee-input-containers">
                <label>Year of Passing</label>
                <input
                  type="text"
                  value={education[0].year}
onChange={(e) => {
    const updated = [...education];
    updated[0].year = e.target.value;
    setEducation(updated);
}}
                  className="addemployee-input-fields"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="addemployee-buttons-container">
        {activeIndex > 0 && (
          <button onClick={() => setActiveIndex(activeIndex - 1)}>
            Previous
          </button>
        )}
        {activeIndex < 1 ? (
          <>
            <button onClick={() => setActiveIndex(activeIndex + 1)}>
              Next
            </button>
            {/* <button className="previous-btn" onClick={handleCreateEmployee}>
              Save
            </button> */}
          </>
        ) : (
          <button className="previous-btn" onClick={handleCreateEmployee}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default AddEmp;
