import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Registration.module.css";

const Register = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const selectedPlan = location?.state?.selectedPlan.PLAN_ID || '';

  console.log("selectedpaln",selectedPlan);
  

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    address1: "",
    contactno:'',
    country: "",
    city: "",
    sector: "",
    timezone: ""
  });

  const [lookupData, setLookupData] = useState({
    country: [],
    city: [],
    sector: [],
    timezone: []
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setFormData(prev => ({ ...prev, country: value, city: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  useEffect(() => {
    const getLookUp = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/LoginLookup");
        const data = await res.json();


           
        if (data.success) {
          const allData = data.data;


          console.log("allData",allData);
          
          setLookupData({
            country: allData.filter(d => d.LOOKUP_GROUP === "CON"),
            city: allData.filter(d => ["IND", "USA", "AUS"].includes(d.LOOKUP_GROUP)),
            sector: allData.filter(d => d.LOOKUP_GROUP === "SEC"),
            timezone: allData.filter(d => d.LOOKUP_GROUP === "TZ")
          });
        }
      } catch (error) {
        console.error("Error fetching lookup data", error);
      }
    };

    getLookUp();
  }, []);




const filteredCities = lookupData.city.filter(c => c.LOOKUP_GROUP === formData.country);

const filteredTimezones = lookupData.timezone.filter(tz => {
  if (!formData.country) return false;
  if (formData.country === "IND") return tz.LOOKUP_CODE.startsWith("IND");
  if (formData.country === "USA") return tz.LOOKUP_CODE.startsWith("USA");
  if (formData.country === "AUS") return tz.LOOKUP_CODE.startsWith("AUS");
  return false;
});


  
  const handleCreateAccount = async (e) => {


    
    e.preventDefault();

    // console.log("formate",formData);
    const payload = { ...formData, planId: Number(selectedPlan) }
    

    try {
      const res = await fetch("http://localhost:3001/api/registerCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === 201) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className={styles["reg-container"]}>



      <div className={styles["reg-card"]}>
        <h2 className={styles["reg-title"]}>Register Your Company</h2>

        <form className={styles["reg-form"]} onSubmit={handleCreateAccount}>
          <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Contact Number" name="contactno" type="tel" value={formData.contactno} onChange={handleChange} />
          <Select label="Sector" name="sector" options={lookupData.sector} value={formData.sector} onChange={handleChange} />
          <Input label="Address1" name="address1" value={formData.address1} onChange={handleChange} />
          <Select label="Country" name="country" options={lookupData.country} value={formData.country} onChange={handleChange} />
          <Select label="City" name="city" options={filteredCities} value={formData.city} onChange={handleChange} disabled={!formData.country} />
          <Select label="Timezone" name="timezone" options={filteredTimezones} value={formData.timezone} onChange={handleChange} />

          <button type="submit" className={styles["reg-button"]}>Create Account</button>
        </form>
      </div>
    </div>
  );
};

const Input = React.memo(({ label, name, value, onChange, type = "text" }) => (
  <div className={styles["reg-field"]}>
    <label className={styles["reg-label"]}>{label}</label>
    <input type={type} name={name} value={value || ''} onChange={onChange} className={styles["reg-input"]} required />
  </div>
));

const Select = React.memo(({ label, name, options, value, onChange, disabled = false }) => (
  <div className={styles["reg-field"]}>
    <label className={styles["reg-label"]}>{label}</label>
    <select name={name} value={value} onChange={onChange} className={styles["reg-input"]} required disabled={disabled}>
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt.LOOKUP_CODE} value={opt.LOOKUP_CODE}>
          {opt.LOOKUP_NAME}
        </option>
      ))}
    </select>
  </div>
));

export default Register;
