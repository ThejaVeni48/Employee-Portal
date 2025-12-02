import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./ProfilePage.css";

import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const userEmail = useSelector((state) => state.email);
  const userId = useSelector((state) => state.userId);
  console.log("userEmail",userEmail);
  console.log("userId",userId);
  console.log("firstName",firstName);
  console.log("lastName",lastName);
  const nav = useNavigate();
  // const dispatch = useDispatch();

  const EmpId = useSelector((state) => state.EmpId);
    const companyId = useSelector((state) => state.companyId);

  // const [firstName,setFirstName] = useState("");
  // const [lastName,setLastName] = useState("");
  // const [middleName,setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [gender, setGender] = useState("");
  const [image,setImage] = useState(null);
  const [preview,setPreview] = useState('');
   console.log("firstName",firstName);
   console.log("lastName",lastName);


  useEffect(() => {
    fetchUserDetails();
  }, []);

   const fetchUserDetails = async () => {
  try {
    const res = await fetch(
      `http://localhost:3001/api/getUserDetails?EmpId=${EmpId}&companyId=${companyId}`
    );
    const data = await res.json();
    console.log("data",data);

    if (data.data && data.data.length > 0) {
      const result = data.data[0];

      setPhone(result.PHONE_NUMBER );
      setCity(result.CITY);
      setState(result.STATE);
      setPincode(result.PINCODE);
      setGender(result.GENDER);
      setImage(result.IMAGE);
      // dispatch(getProfileImage(result.IMAGE));
    } else {
      setPhone(0);
      setCity("");
      setState("");
      setPincode(0);
      setGender("");
      setImage(null);
      console.warn("No user found for this userId");
    }
  } catch (err) {
    console.error(err);
  }
};

const handleSave = async (e) => {
    e.preventDefault();

  if(!phone || !state || !city || !gender || !pincode || !image)
  {
    alert("enter all fields");
    return;
  }


  const formData = new FormData();
  formData.append("lastName", lastName);
  formData.append("firstName", firstName);
  formData.append("EmpId", EmpId);
  formData.append("companyId", companyId);

  formData.append("phone",phone);
  formData.append("state", state);
  formData.append("city", city);
  formData.append("gender", gender);
  formData.append("pincode", pincode);

  if (image) {
    formData.append("image", image);
  }
console.log("EmpId",EmpId);
console.log("phone",phone);
console.log("state",state);
console.log("city",city);
console.log("gender",gender);
console.log("pincode",pincode);
console.log("image",image);
console.log("companyId",companyId);
console.log("formData",formData);

  try {
    const res = await fetch('http://localhost:3001/api/postUserDetails', {
      method: 'POST',
      body: formData
      // Do NOT set Content-Type manually; fetch will handle it
    });
    console.log("formData",formData);
    

    const result = await res.json();
    console.log(result);

    if (result.success) {
      fetchUserDetails(); // Refresh profile info / image
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const handleSelectImage = (e) => {
  const file = e.target.files[0];
  if(file) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }
};

const handleNav = ()=>{
  nav('/employeedashboard')
}


  return (
    <div className="dashboard-container">
      <main className="main-content">
        <div className="profile-card">
          <h3>Edit Profile {userId}</h3>

          <div className="profile-pic-container">
           <img src={preview || image} alt="Profile" className="profile-pic"/>
<input type="file" accept="image/*" onChange={handleSelectImage}/>

          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={firstName} readOnly />
            </div>
            
             <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={lastName}  readOnly/>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={userEmail}  readOnly/>
            </div>

            <div className="form-group">
              <label>Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>

            <div className="button-row">
              <button type="button" className="back-btn" onClick={handleNav}>
                Back To Home
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
