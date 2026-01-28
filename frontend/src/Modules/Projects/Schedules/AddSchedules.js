import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FormTextInput from "../../../components/FormInput/FormInput";

const AddSchedule = ({ project = {},projectEmpList = [] }) => {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  const projectId = project.PROJ_ID;

  const queryClient = useQueryClient();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchEmp, setSearchEmp] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());

  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  /* ================= FETCH EMPLOYEES ================= */

  const fetchEmployees = async () => {
    const res = await fetch(
      `http://localhost:3001/api/getSchedule?projId=${projectId}&orgId=${companyId}`
    );
    const json = await res.json();
    return json.data || [];
  };



  /* ================= SEARCH ================= */

  const filteredEmployees = useMemo(() => {
    return projectEmpList.filter(
      (emp) =>
        emp.DISPLAY_NAME.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.EMP_ID.toString().includes(searchEmp)
    );
  }, [projectEmpList, searchEmp]);

  /* ================= MONTH DAYS ================= */

  const loadMonthDays = (month) => {
    const arr = [];
    let d = month.clone().startOf("month");
    const end = month.clone().endOf("month");

    while (d.isSameOrBefore(end)) {
      arr.push(d.clone());
      d.add(1, "day");
    }

    setDays(arr);
    setHours(Array(arr.length).fill(""));

    return arr;
  };

  /* ================= FETCH MONTH SCHEDULE ================= */

  const fetchMonthSchedule = async (empId, month, monthDays) => {
    const res = await fetch(
      `http://localhost:3001/api/getSchedulers?orgId=${companyId}&empId=${empId}&projId=${projectId}&month=${month}`
    );

    const json = await res.json();
    const scheduleArr = json?.data?.schedule || [];

    setIsEditMode(scheduleArr.length === 0);

    const filled = Array(monthDays.length).fill("");

    scheduleArr.forEach((item) => {
      const idx = monthDays.findIndex(
        (d) => d.format("YYYY-MM-DD") === item.date
      );
      if (idx !== -1) filled[idx] = item.hours;
    });

    setHours(filled);
  };

  /* ================= SAVE ================= */

  const saveScheduler = async (payload) => {
    const res = await fetch("http://localhost:3001/api/saveScheduler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.json();
  };

  const mutation = useMutation({
    mutationFn: saveScheduler,
    onSuccess: () => {
      queryClient.invalidateQueries(["projEmployees"]);
      setIsEditMode(false);
    },
  });

  const handleSave = () => {
    const payload = {
      proj_id: projectId,
      emp_id: selectedEmployee.EMP_ID,
      org_id: companyId,
      email,
      month_year: currentMonth.format("YYYY-MM"),
      startDate: days[0]?.format("YYYY-MM-DD"),
      endDate: days[days.length - 1]?.format("YYYY-MM-DD"),
      hours,
      total_hours: hours.reduce((s, h) => s + (parseInt(h) || 0), 0),
    };

    mutation.mutate(payload);
  };

  /* ================= SELECT EMPLOYEE ================= */

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setSearchEmp(emp.DISPLAY_NAME);
    setShowDropdown(false);

    const startMonth = moment(emp.CONTRACT_START_DATE).startOf("month");
    setCurrentMonth(startMonth);

    const generatedDays = loadMonthDays(startMonth);

    fetchMonthSchedule(
      emp.EMP_ID,
      startMonth.format("YYYY-MM"),
      generatedDays
    );
  };

  /* ================= INIT CURRENT MONTH ================= */

  useEffect(() => {
    loadMonthDays(currentMonth);
  }, []);

  /* ================= CONTRACT LIMITS ================= */

  const contractStartMonth = selectedEmployee
    ? moment(selectedEmployee.CONTRACT_START_DATE).startOf("month")
    : null;

  const contractEndMonth = selectedEmployee
    ? moment(selectedEmployee.CONTRACT_END_DATE).startOf("month")
    : null;

  const canGoPrev = () => {
    if (!selectedEmployee) return true;

    const prev = currentMonth.clone().subtract(1, "month");
    return !prev.isBefore(contractStartMonth);
  };

  const canGoNext = () => {
    if (!selectedEmployee) return true;

    const next = currentMonth.clone().add(1, "month");
    return !next.isAfter(contractEndMonth);
  };

  /* ================= MONTH NAVIGATION ================= */

  const handleNextMonth = () => {
    if (!canGoNext()) return;

    const newMonth = currentMonth.clone().add(1, "month");

    setCurrentMonth(newMonth);

    const generatedDays = loadMonthDays(newMonth);

    if (selectedEmployee) {
      fetchMonthSchedule(
        selectedEmployee.EMP_ID,
        newMonth.format("YYYY-MM"),
        generatedDays
      );
    }
  };

  const handlePrevMonth = () => {
    if (!canGoPrev()) return;

    const newMonth = currentMonth.clone().subtract(1, "month");

    setCurrentMonth(newMonth);

    const generatedDays = loadMonthDays(newMonth);

    if (selectedEmployee) {
      fetchMonthSchedule(
        selectedEmployee.EMP_ID,
        newMonth.format("YYYY-MM"),
        generatedDays
      );
    }
  };

  /* ================= BLOCK LOGIC ================= */

  const isBlocked = (date) => {
    if (!selectedEmployee) return false;

    const start = moment(selectedEmployee.CONTRACT_START_DATE);
    const end = moment(selectedEmployee.CONTRACT_END_DATE);

    return date.isBefore(start, "day") || date.isAfter(end, "day");
  };

  /* ================= UI ================= */

  return (
    <div className="relative space-y-6">

      {/* SEARCH */}
      <div className="relative max-w-xl">
        <FormTextInput
          value={searchEmp}
          placeholder="Search project employee..."
          onChange={(val) => {
            setSearchEmp(val);
            setShowDropdown(true);
          }}
        />

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">

            {filteredEmployees.length === 0 && (
              <p className="p-4 text-sm text-gray-500 text-center">
                No employees found
              </p>
            )}

            {filteredEmployees.map((emp) => (
              <div
                key={emp.EMP_ID}
                onClick={() => handleSelectEmployee(emp)}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm transition"
              >
                {emp.DISPLAY_NAME}
              </div>
            ))}
          </div>
        )}
      </div>

{/* ================= SCHEDULER ================= */}
<div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

  {/* TOP BAR */}
  <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b">

    <div>
      <h3 className="text-lg font-semibold text-slate-900">
        {currentMonth.format("MMMM YYYY")}
      </h3>
      {selectedEmployee && (
        <p className="text-xs text-slate-500 mt-0.5">
          Contract:{" "}
          {moment(selectedEmployee.CONTRACT_START_DATE).format("DD MMM YYYY")}
          {" – "}
          {moment(selectedEmployee.CONTRACT_END_DATE).format("DD MMM YYYY")}
        </p>
      )}
    </div>

    <div className="flex gap-2">
      <button
        onClick={handlePrevMonth}
        disabled={!canGoPrev()}
        className={`h-9 w-9 rounded-full flex items-center justify-center border
          ${
            canGoPrev()
              ? "bg-white hover:bg-indigo-50 hover:border-indigo-300"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
      >
        ◀
      </button>

      <button
        onClick={handleNextMonth}
        disabled={!canGoNext()}
        className={`h-9 w-9 rounded-full flex items-center justify-center border
          ${
            canGoNext()
              ? "bg-white hover:bg-indigo-50 hover:border-indigo-300"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
      >
        ▶
      </button>
    </div>
  </div>

  {/* SCROLLER */}
  <div className="relative">

    {/* FADE EDGES */}
    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10" />
    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10" />

    <div className="overflow-x-auto scroll-smooth px-4 py-5">

      <div className="flex gap-3 min-w-max">

        {days.map((day, idx) => {
          const blocked = isBlocked(day);
          const isToday = day.isSame(moment(), "day");
          const isWeekend = [0, 6].includes(day.day());

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className={`w-[88px] shrink-0 rounded-2xl border p-3 text-center transition
                ${
                  blocked
                    ? "bg-slate-50 border-slate-200 text-slate-400"
                    : "bg-white hover:shadow-md hover:border-indigo-300"
                }
                ${isToday ? "ring-2 ring-indigo-400" : ""}
                ${isWeekend && !blocked ? "bg-indigo-50/40" : ""}
              `}
            >

              {/* DAY HEADER */}
              <div className="text-[11px] uppercase tracking-wide text-slate-500">
                {day.format("ddd")}
              </div>

              <div className="text-base font-semibold text-slate-900">
                {day.format("DD")}
              </div>

              {/* INPUT */}
              <div
                className={`mt-3 h-11 rounded-lg border flex items-center justify-center
                  ${
                    blocked
                      ? "bg-slate-100 border-slate-200"
                      : "bg-indigo-50 border-indigo-200"
                  }`}
              >
                {!blocked ? (
                  <input
                    type="number"
                    min="0"
                    max="24"
                    disabled={!isEditMode}
                    value={hours[idx] || ""}
                    onChange={(e) => {
                      if (!isEditMode) return;
                      const copy = [...hours];
                      copy[idx] = e.target.value;
                      setHours(copy);
                    }}
                    className="w-full h-full bg-transparent text-center text-sm font-medium outline-none disabled:text-slate-400"
                  />
                ) : (
                  <span className="text-sm">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>



      {/* ACTIONS */}
      {selectedEmployee && (
        <div className="flex justify-end gap-4">

          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-6 py-3 rounded-xl bg-slate-600 text-white hover:bg-slate-700"
            >
              Edit
            </button>
          )}

          {isEditMode && (
            <button
              onClick={handleSave}
              className="px-7 py-3 rounded-xl bg-indigo-700 text-white hover:bg-indigo-800 shadow"
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default AddSchedule;
