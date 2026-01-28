import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Menu } from "@headlessui/react";
import {
  MdAdd,
  MdMoreVert,
  MdEdit,
  MdVisibility,
  MdBlock,
} from "react-icons/md";

import { getBranch } from "../../apis/Branch/getBranch";

import { useSelector } from "react-redux";
import { employeeList } from "../../apis/Employee/employeeList";
import Badge from "../../components/Badge/Badge";
import TableComponent from "../../components/Table/Table";
import DropDownComponent from "../../components/Dropdown/Dropdown";

/* ------------------ COMPONENT ------------------ */

const Employees = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const orgId = useSelector((s) => s.user.companyId);

  /* ---------------- FILTER STATE ---------------- */

  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [empType, setEmpType] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- FETCH BRANCHES ---------------- */

  const { data: branches = {} } = useQuery({
    queryKey: ["branches", orgId],
    queryFn: () => getBranch(orgId),
    enabled: !!orgId,
  });

  const branchList = branches?.data || [];

  console.log("branchList",branchList);
  

  /* ---------------- FETCH EMPLOYEES ---------------- */

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "employees",
      orgId
    ],
    queryFn: () =>
      employeeList(
        orgId
      ),
    keepPreviousData: true,
    enabled: !!orgId,
  });

  const employees = data?.data || [];

  console.log("employees",employees);
  
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);


  const columns = [
    {
      header:'Emp Id', accessor:"EMP_ID"
    },
     { header: "Name", accessor: "DISPLAY_NAME" },

    { header: "Email", accessor: "EMAIL" },

    { header: "Branch", accessor: "BRANCH_ID" },

    {
  header: "Status",
  cell: (row) => {
    const isActive = row.STATUS === "A";

    return (
     <Badge variant={isActive ? "success" : "danger"}>
  {isActive ? "Active" : "Inactive"}
</Badge>

    );
  },
},

     {
      header:'Action',cell:(row)=>(
        <button onClick={()=>navigate('/dashboard/empProfile',{
          state: { empId: row.EMP_ID },
        })}>Edit</button>
      )
    }
  ]
  


  return (
    <div className="max-w-7xl mx-auto border-2 p-0 m-0">

      {/* HEADER */}
{/* ================= HEADER ================= */}
<div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm mb-5">

  <div>
    <h1 className="text-lg font-semibold text-gray-900">
      Employees
    </h1>
    <p className="text-xs text-gray-500">
      Manage workforce and assignments
    </p>
  </div>

  <button
    onClick={() => navigate("/addEmp")}
    className="bg-indigo-600 hover:bg-indigo-700 text-white
    px-4 py-2 rounded-lg text-sm font-medium
    flex items-center gap-2 shadow-sm"
  >
    <MdAdd size={16} />
    Add Employee
  </button>

</div>


     {/* ================= FILTER BAR ================= */}
<div className="bg-white border rounded-xl p-4 shadow-sm mb-8">

  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">

    {/* SEARCH */}
    <input
      placeholder="Search…"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      className="md:col-span-2 rounded-lg border px-3 py-2.5 text-sm
      focus:ring-2 focus:ring-indigo-500 outline-none"
    />

    {/* BRANCH */}
    <DropDownComponent
      value={branchId}
      onChange={(e) => {
        setBranchId(e.target.value);
        setPage(1);
      }}
      className="rounded-lg border px-3 py-2.5 text-sm"
    >
      <option value="">All Branches</option>
      {branchList.map((b) => (
        <option
          key={b.branch_id}
          value={b.branch_id}
        >
          {b.branch_name}
        </option>
      ))}
    </DropDownComponent>

    {/* TYPE */}
    <DropDownComponent
      value={empType}
      onChange={(e) => {
        setEmpType(e.target.value);
        setPage(1);
      }}
      className="rounded-lg border px-3 py-2.5 text-sm"
    >
      <option value="">All Types</option>
      <option value="FULL_TIME">Full Time</option>
      <option value="CONTRACTOR">Contractor</option>
      <option value="INTERN">Intern</option>
    </DropDownComponent>

    {/* STATUS */}
    <DropDownComponent
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        setPage(1);
      }}
      className="rounded-lg border px-3 py-2.5 text-sm"
    >
      <option value="">All Status</option>
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
    </DropDownComponent>

    {/* RESET */}
    <button
      onClick={() => {
        setSearch("");
        setBranchId("");
        setEmpType("");
        setStatus("");
        setPage(1);
      }}
      className="border rounded-lg px-4 py-2.5 text-sm
      hover:bg-gray-50 font-medium"
    >
      Reset
    </button>

  </div>
</div>


      {/* TABLE */}
    <TableComponent
    columns={columns}
    data={employees}
    >

    </TableComponent>
    
    </div>
  );
};










export default Employees;
