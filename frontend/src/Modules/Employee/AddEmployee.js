import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SlCalender } from "react-icons/sl";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

import { ActiveSubscription } from "../../Redux/actions/subscriptionAction";
import { addEmp } from "../../apis/Employee/addEmp";
import { getBranch } from "../../apis/Branch/getBranch";

import FormLabel from "../../components/FormLabel/FormLabel";
import FormTextInput from "../../components/FormInput/FormInput";

const AddEmp = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const createdBy = location.state?.createdBy || "";

  const orgId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  const activeSubscription = useSelector(
    (state) => state.activeSubscription.activeSubscription
  );

  // =====================================
  // STATE
  // =====================================
  const [activeIndex, setActiveIndex] = useState(0);

  const [basicDetails, setBasicDetails] = useState([
    {
      firstName: "",
      lastName: "",
      middleName: "",
      displayName: "",
      gender: "",
      phnNumber: "",
      emailID: "",
      empId: "",
      branchId: "",
      empType:'',
      hireDate: null,
    },
  ]);

  const [education, setEducation] = useState([
    { degree: "", university: "", year: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  
    const { mutate, isPending } = useMutation({
    mutationFn: addEmp,

    // ---- optimistic update
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: ["employees", orgId],
      });

      const previousEmployees =
        queryClient.getQueryData(["employees", orgId]);

      queryClient.setQueryData(
        ["employees", orgId],
        (old = []) => [
          ...old,
          {
            ...payload.employees[0],
            id: Date.now(),
            optimistic: true,
          },
        ]
      );

      return { previousEmployees };
    },

    onError: (err, payload, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(
          ["employees", orgId],
          context.previousEmployees
        );
      }

      if (err?.status === 403) {
        setShowUpgradeModal(true);
        toast.error("Employee limit reached. Upgrade required.");
      } else {
        toast.error(err?.message || "Failed to add employee");
      }
    },

    onSuccess: (data) => {
      toast.success(data.message || "Employee added successfully!");

      queryClient.invalidateQueries({
        queryKey: ["employees", orgId],
      });

      setBasicDetails([
        {
          firstName: "",
          lastName: "",
          middleName: "",
          displayName: "",
          gender: "",
          phnNumber: "",
          emailID: "",
          empId: "",
          branchId: "",
          hireDate: null,
        },
      ]);

      setEducation([{ degree: "", university: "", year: "" }]);
      setActiveIndex(0);
      setErrors({});
    },
  });
  // =====================================
  // FETCH SUBSCRIPTION
  // =====================================
  useEffect(() => {
    if (orgId) {
      dispatch(ActiveSubscription(orgId));
    }
  }, [dispatch, orgId]);

  // =====================================
  // FETCH BRANCHES
  // =====================================
  const {
    data: branches = [],
    isLoading: branchLoading,
  } = useQuery({
    queryKey: ["branches", orgId],
    queryFn: () => getBranch(orgId),
    enabled: !!orgId,
  });


  const branchList = branches.data || [];

  console.log("branchlist",branchList);
  
  if (!activeSubscription) return null;



  // =====================================
  // HELPERS
  // =====================================
  const updateBasic = (field, value) => {
    setBasicDetails((prev) => {
      const updated = [...prev];
      updated[0] = { ...updated[0], [field]: value };
      return updated;
    });
  };

  // =====================================
  // VALIDATION
  // =====================================
  const validateStepOne = () => {
    const emp = basicDetails[0];
    const e = {};

    if (!emp.firstName.trim()) e.firstName = "First name required";
    if (!emp.lastName.trim()) e.lastName = "Last name required";
    if (!emp.emailID.trim()) e.emailID = "Email required";
    if (!emp.empId.trim()) e.empId = "Employee ID required";
    if (!emp.gender) e.gender = "Select gender";
    if (!emp.phnNumber.trim()) e.phnNumber = "Phone required";
    if (!emp.hireDate) e.hireDate = "Hire date required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStepTwo = () => {
    const edu = education[0];
    const e = {};

    if (!edu.degree.trim()) e.degree = "Degree required";
    if (!edu.university.trim()) e.university = "University required";
    if (!edu.year.trim()) e.year = "Year required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // =====================================
  // MUTATION
  // =====================================


  // =====================================
  // SUBMIT
  // =====================================
  const handleCreateEmployee = () => {
    const payload = {
      employees: [
        {
          ...basicDetails[0],
          hireDate: basicDetails[0].hireDate
            ? moment(basicDetails[0].hireDate).format("YYYY-MM-DD")
            : null,
          orgId,
          email,
          education,
        },
      ],
      orgId,
      email,
    };

    mutate(payload);
  };

  // =====================================
  // UI
  // =====================================
  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-xl">
        <h1 className="text-2xl font-semibold">
          Add New Employee
        </h1>
        <p className="mt-1 text-indigo-100 text-sm">
          Create and onboard employees into your organization.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-3xl shadow-lg border p-8">

        {/* STEPPER */}
        <div className="flex items-center gap-8 mb-10">
          {[1, 2].map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${
                  activeIndex >= idx
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              <span className="font-medium">
                {step === 1 ? "Basic Info" : "Education"}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1 */}
{/* STEP 1 */}
{activeIndex === 0 && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* FIRST NAME */}
    <Input
  label="First Name"
  value={basicDetails[0].firstName}
  onChange={(val) =>
    updateBasic("firstName", val)
  }
/>


    {/* LAST NAME */}
    <Input
      label="Last Name"
      value={basicDetails[0].lastName}
      error={errors.lastName}
      onChange={(val) =>
        updateBasic("lastName",val)
      }
    />

    {/* MIDDLE NAME */}
    <Input
      label="Middle Name"
      value={basicDetails[0].middleName}
      onChange={(val) =>
        updateBasic("middleName", val)
      }
    />

    {/* DISPLAY NAME */}
    <Input
      label="Display Name"
      value={basicDetails[0].displayName}
      onChange={(val) =>
        updateBasic("displayName",val)
      }
    />

    {/* PHONE */}
    <Input
      label="Phone"
      value={basicDetails[0].phnNumber}
      error={errors.phnNumber}
      onChange={(val) =>
        updateBasic("phnNumber", val)
      }
    />

    {/* EMAIL */}
    <Input
      label="Email"
      type="email"
      value={basicDetails[0].emailID}
      error={errors.emailID}
      onChange={(val) =>
        updateBasic("emailID",val)
      }
    />

    {/* EMPLOYEE ID */}
    <Input
      label="Employee ID"
      value={basicDetails[0].empId}
      error={errors.empId}
      onChange={(val) =>
        updateBasic("empId",val)
      }
    />

    {/* GENDER */}
    <div>
      <FormLabel text="Gender" />
      <select
        value={basicDetails[0].gender}
        onChange={(e) =>
          updateBasic("gender", e.target.value)
        }
        className={`mt-1 w-full rounded-xl px-4 py-3 border
        ${errors.gender ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Select Gender</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Others">Others</option>
      </select>
      {errors.gender && (
        <p className="text-xs text-red-600 mt-1">
          {errors.gender}
        </p>
      )}
    </div>

    {/* EMPLOYMENT TYPE */}
    <div>
      <FormLabel text="Employment Type" />
      <select
        value={basicDetails[0].empType}
        onChange={(e) =>
          updateBasic("empType", e.target.value)
        }
        className="mt-1 w-full rounded-xl px-4 py-3 border border-gray-300"
      >
        <option value="">Select Type</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="CONTRACTOR">Contractor</option>
        <option value="INTERN">Intern</option>
      </select>
    </div>

    {/* BRANCH */}
    <div>
      <FormLabel text="Branch" />
      <select
        value={basicDetails[0].branchId}
        onChange={(e) =>
          updateBasic("branchId", e.target.value)
        }
        className={`mt-1 w-full rounded-xl px-4 py-3 border
        ${errors.branchId ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Select Branch</option>

        {branchLoading && (
          <option disabled>Loading...</option>
        )}

        {branchList?.map((branch) => (
          <option key={branch.branch_id} value={branch.branch_id}>
            {branch.branch_name}
          </option>
        ))}
      </select>

      {errors.branchId && (
        <p className="text-xs text-red-600 mt-1">
          {errors.branchId}
        </p>
      )}
    </div>

    {/* HIRE DATE */}
    <div>
      <FormLabel text="Hire Date" />
      <div className="relative mt-1">
        <DatePicker
          selected={basicDetails[0].hireDate}
          onChange={(date) =>
            updateBasic("hireDate", date)
          }
          className="w-full rounded-xl border px-4 py-3"
        />
        <SlCalender className="absolute right-4 top-4 text-gray-400" />
      </div>

      {errors.hireDate && (
        <p className="text-xs text-red-600 mt-1">
          {errors.hireDate}
        </p>
      )}
    </div>

  </div>
)}

{/* STEP 2 — EDUCATION */}
{activeIndex === 1 && (
  <div>

    <h3 className="text-lg font-semibold text-gray-800 mb-6">
      Education Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* DEGREE */}
      <div>
        <FormLabel text="Degree" />
        <FormTextInput
          value={education[0].degree}
          onChange={(val) => {
            const updated = [...education];
            updated[0].degree = val;
            setEducation(updated);
          }}
          className={`mt-1 w-full rounded-xl px-4 py-3 border
            ${
              errors.degree
                ? "border-red-500"
                : "border-gray-300"
            }`}
        />

        {errors.degree && (
          <p className="text-xs text-red-600 mt-1">
            {errors.degree}
          </p>
        )}
      </div>

      {/* UNIVERSITY */}
      <div>
        <FormLabel text="University / College" />
        <FormTextInput
          value={education[0].university}
          onChange={(val) => {
            const updated = [...education];
            updated[0].university = val;
            setEducation(updated);
          }}
          className={`mt-1 w-full rounded-xl px-4 py-3 border
            ${
              errors.university
                ? "border-red-500"
                : "border-gray-300"
            }`}
        />

        {errors.university && (
          <p className="text-xs text-red-600 mt-1">
            {errors.university}
          </p>
        )}
      </div>

      {/* YEAR */}
      <div>
        <FormLabel text="Year of Passing" />
        <FormTextInput
          value={education[0].year}
          onChange={(val) => {
            const updated = [...education];
            updated[0].year = val;
            setEducation(updated);
          }}
          className={`mt-1 w-full rounded-xl px-4 py-3 border
            ${
              errors.year
                ? "border-red-500"
                : "border-gray-300"
            }`}
        />

        {errors.year && (
          <p className="text-xs text-red-600 mt-1">
            {errors.year}
          </p>
        )}
      </div>

    </div>
  </div>
)}



        {/* ACTIONS */}
        <div className="mt-10 flex justify-between">

          {activeIndex > 0 && (
            <button
              className="px-6 py-2 rounded-xl border"
              onClick={() => setActiveIndex(0)}
            >
              Back
            </button>
          )}

          {activeIndex < 1 ? (
            <button
              className="ml-auto bg-indigo-600 text-white px-8 py-3 rounded-xl"
              onClick={() => {
                if (validateStepOne()) {
                  setActiveIndex(1);
                } else {
                  toast.error("Please fix errors before continuing");
                }
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              disabled={isPending}
              className="ml-auto bg-indigo-600 text-white px-8 py-3 rounded-xl"
              onClick={() => {
                if (validateStepTwo()) {
                  handleCreateEmployee();
                } else {
                  toast.error("Please complete education details");
                }
              }}
            >
              {isPending ? "Saving..." : "Save Employee"}
            </button>
          )}

        </div>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">

            <h3 className="text-xl font-semibold">
              Upgrade Required
            </h3>

            <p className="mt-2 text-gray-600">
              Your plan reached the employee limit.
            </p>

            <div className="mt-6 flex justify-end gap-4">

              <button
                className="border px-6 py-2 rounded-xl"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>

              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
                onClick={() =>
                  navigate("/subscriptionplans", {
                    state: { activeSubscription },
                  })
                }
              >
                Upgrade Now
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ---------------- INPUT COMPONENT ---------------- */

const Input = ({
  label,
  value,
  onChange,
  error,
  type = "text",
}) => (
  <div>
    <FormLabel text={label} />
    <FormTextInput
      type={type}
      value={value}
      onChange={onChange}
      className={`mt-1 w-full rounded-xl px-4 py-3 border
      ${
        error
          ? "border-red-500"
          : "border-gray-300"
      }`}
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">
        {error}
      </p>
    )}
  </div>
);

export default AddEmp;
