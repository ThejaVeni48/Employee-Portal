import moment from "moment";
import { useMemo, useState } from "react";

/* ---------------- MOCK DATA ---------------- */

const employeesMock = [
  {
    id: 1,
    name: "Theja Sree",
    status: "Draft",
    contractStart: "2026-01-05",
    contractEnd: "2026-02-04",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    status: "Approved",
    contractStart: "2026-02-01",
    contractEnd: "2026-03-15",
  },
  {
    id: 3,
    name: "Priya Sharma",
    status: "Submitted",
    contractStart: "2026-01-10",
    contractEnd: "2026-01-28",
  },
];

const holidaysMock = ["2026-01-14", "2026-01-26"];

/* ---------------- MAIN COMPONENT ---------------- */

const AddSchedule = ()=> {
  const [search, setSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [month, setMonth] = useState(moment());

  const filteredEmployees = useMemo(() => {
    return employeesMock.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* -------- MONTH DAYS -------- */

  const days = useMemo(() => {
    const arr = [];
    let d = month.clone().startOf("month");
    const end = month.clone().endOf("month");

    while (d.isSameOrBefore(end)) {
      arr.push(d.clone());
      d.add(1, "day");
    }

    return arr;
  }, [month]);

  /* -------- BLOCK LOGIC -------- */

  const isBlocked = (date) => {
    if (!selectedEmp) return true;

    const start = moment(selectedEmp.contractStart);
    const end = moment(selectedEmp.contractEnd);

    return (
      date.isBefore(start, "day") ||
      date.isAfter(end, "day") ||
      holidaysMock.includes(date.format("YYYY-MM-DD"))
    );
  };

  /* -------- MONTH NAV -------- */

  const canPrev =
    selectedEmp &&
    month.isAfter(moment(selectedEmp.contractStart), "month");

  const canNext =
    selectedEmp &&
    month.isBefore(moment(selectedEmp.contractEnd), "month");

return (
  <div className="space-y-8">

    {/* PAGE TITLE */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Project Allocation Schedule
      </h2>
      <p className="text-sm text-gray-500">
        Plan monthly hours for selected project employee
      </p>
    </div>

    {/* SEARCH */}
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <input
        placeholder="Search project employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* EMPLOYEE SCROLLER */}
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {filteredEmployees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => {
              setSelectedEmp(emp);
              setMonth(moment(emp.contractStart));
            }}
            className={`min-w-[240px] p-4 rounded-lg border text-left transition
              ${
                selectedEmp?.id === emp.id
                  ? "bg-indigo-50 border-indigo-400 shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
          >
            <div className="font-semibold text-gray-900">
              {emp.name}
            </div>

            <span
              className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full
                ${
                  emp.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : emp.status === "Submitted"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-200 text-gray-700"
                }`}
            >
              {emp.status}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* SELECTED HEADER */}
    {selectedEmp && (
      <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            {selectedEmp.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Contract: {selectedEmp.contractStart} →{" "}
            {selectedEmp.contractEnd}
          </div>
        </div>

        <span className="px-3 py-1 text-xs rounded-full bg-gray-200">
          {selectedEmp.status}
        </span>
      </div>
    )}

    {/* MONTH NAV */}
    {selectedEmp && (
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <button
            disabled={!canPrev}
            onClick={() =>
              setMonth((m) => m.clone().subtract(1, "month"))
            }
            className="p-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            ◀
          </button>

          <span className="font-medium text-gray-800">
            {month.format("MMMM YYYY")}
          </span>

          <button
            disabled={!canNext}
            onClick={() =>
              setMonth((m) => m.clone().add(1, "month"))
            }
            className="p-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            ▶
          </button>
        </div>

      </div>
    )}

    {/* INFO */}
    {selectedEmp && (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-5 py-3 rounded-xl text-sm">
        <b>Note:</b> Only contract period dates are editable.
        Holidays are blocked automatically.
      </div>
    )}

    {/* CALENDAR */}
    {selectedEmp && (
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          {/* HEADER ROW */}
          <div className="flex min-w-max border-b bg-gray-50">
            {days.map((day) => (
              <div
                key={day.format("YYYY-MM-DD")}
                className="w-20 px-3 py-3 text-center text-xs font-semibold text-gray-600"
              >
                <div>{day.format("DD")}</div>
                <div>{day.format("ddd").toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* HOURS ROW */}
          <div className="flex min-w-max">
            {days.map((day) => {
              const blocked = isBlocked(day);

              return (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`w-20 px-3 py-4 text-center border-r
                    ${
                      blocked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-indigo-50"
                    }`}
                >
                  {!blocked ? (
                    <input
                      type="number"
                      min="0"
                      max="24"
                      className="w-12 h-9 border rounded-md text-center bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    )}

    {/* ACTIONS */}
    {selectedEmp && (
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500">
          Save Draft
        </button>

        <button className="px-6 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800">
          Submit
        </button>
      </div>
    )}

  </div>
);

}


export default AddSchedule
