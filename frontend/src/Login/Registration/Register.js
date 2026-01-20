import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../utility/Stepper";
import Plans from "../Plans/Plans";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    address1: "",
    contactno: "",
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
      const res = await fetch("http://localhost:3001/api/LoginLookup");
      const data = await res.json();
      if (data.success) {
        const allData = data.data;
        setLookupData({
          country: allData.filter(d => d.LOOKUP_GROUP === "CON"),
          city: allData.filter(d => ["IND", "USA", "AUS"].includes(d.LOOKUP_GROUP)),
          sector: allData.filter(d => d.LOOKUP_GROUP === "SEC"),
          timezone: allData.filter(d => d.LOOKUP_GROUP === "TZ")
        });
      }
    };
    getLookUp();
  }, []);

  const filteredCities = lookupData.city.filter(
    c => c.LOOKUP_GROUP === formData.country
  );

  const filteredTimezones = lookupData.timezone.filter(tz => {
    if (!formData.country) return false;
    return tz.LOOKUP_CODE.startsWith(formData.country);
  });

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const payload = { ...formData, planId: Number(selectedPlan.PLAN_ID) };

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

  const handleNext = () => setCurrentStep(s => s + 1);
  const handleBack = () => setCurrentStep(s => s - 1);

  const isStep1Valid = () => {
    return (
      formData.companyName &&
      formData.email &&
      formData.contactno &&
      formData.address1 &&
      formData.city &&
      formData.country &&
      formData.timezone
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-5xl mx-auto mb-8">
        <Stepper currentStep={currentStep} />
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Register Your Company
          </h2>

          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-10">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
              <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} required />
              <Input label="Contact Number" name="contactno" value={formData.contactno} onChange={handleChange} required />
              <Select label="Sector" name="sector" options={lookupData.sector} value={formData.sector} onChange={handleChange} required />
              <Input label="Address" name="address1" value={formData.address1} onChange={handleChange} required />
              <Select label="Country" name="country" options={lookupData.country} value={formData.country} onChange={handleChange} required />
              <Select label="City" name="city" options={filteredCities} value={formData.city} onChange={handleChange} required />
              <Select label="Timezone" name="timezone" options={filteredTimezones} value={formData.timezone} onChange={handleChange} required />

              <div className="col-span-full flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStep1Valid()}
                  className="
                    px-10 py-2.5 rounded-md text-sm font-medium
                    bg-[#1c3681] text-white
                    hover:bg-[#162c6b]
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                  "
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <Plans
          onNext={handleNext}
          onBack={handleBack}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-10">

          <p className="text-lg font-semibold text-gray-900 mb-6">Review</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm mb-8">
            <Info label="Organization Name" value={formData.companyName} />
            <Info label="Email" value={formData.email} />
            <Info label="Phone" value={formData.contactno} />
            <Info label="Address" value={formData.address1} />
            <Info label="Country" value={formData.country} />
            <Info label="Sector" value={formData.sector} />
          </div>

          <div className="border-t pt-6 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Selected Subscription Plan</h4>
            <p className="text-sm font-medium text-gray-900">{selectedPlan.PLAN_NAME}</p>
            <p className="text-sm text-gray-600">Price: {selectedPlan.PRICE}</p>
            <p className="text-sm text-gray-600">Users Limit: {selectedPlan.MAX_EMPLOYEES}</p>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1"
            />
            <p className="text-sm text-gray-700">
              I accept the <span className="text-blue-600">Terms & Conditions</span> and <span className="text-blue-600">Privacy Policy</span>
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-start gap-3">
                <div className="text-sm">
                  <p className="text-blue-900">
                    Your organization registration will be submitted for Global Admin approval.
                  </p>
                  <p className="text-blue-700 mt-1">
                    You will receive an email notification once your registration is reviewed.
                  </p>
                </div>
              </div>


          <div className="flex justify-between mt-[20px]">
            <button onClick={handleBack} className="px-6 py-2.5 border rounded-md text-sm">
              Back
            </button>

            <button
              onClick={handleCreateAccount}
              disabled={!termsAccepted}
              className="
                px-8 py-2.5 rounded-md text-sm font-medium
                bg-blue-600 text-white
                hover:bg-blue-700
                disabled:bg-gray-400 disabled:cursor-not-allowed
              "
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, value, onChange, required = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="
        w-full rounded-md border border-gray-300
        px-3 py-2 text-sm
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-[#1c3681]
      "
    />
  </div>
);

const Select = ({ label, name, options, value, onChange, required = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="
        w-full rounded-md border border-gray-300
        px-3 py-2 text-sm bg-white
        focus:outline-none focus:ring-2 focus:ring-[#1c3681]
      "
    >
      <option value="">Select {label}</option>
      {options.map(o => (
        <option key={o.LOOKUP_CODE} value={o.LOOKUP_CODE}>
          {o.LOOKUP_NAME}
        </option>
      ))}
    </select>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

export default Register;
