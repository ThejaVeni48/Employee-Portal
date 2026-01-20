import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Plans = ({ onNext, onBack, selectedPlan, setSelectedPlan }) => {
  const companyId = useSelector(state => state.user.companyId);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch(`http://localhost:3001/api/GetPlans?orgId=${companyId}`);
      const data = await res.json();
      setPlans(data.data || []);
    };
    fetchPlans();
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm px-10 py-12">

      <h2 className="text-2xl font-semibold text-[#1c3681] text-center mb-10">
        Choose Your Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => {
          const isSelected = selectedPlan?.PLAN_ID === plan.PLAN_ID;

          return (
            <div
              key={plan.PLAN_ID}
              onClick={() => setSelectedPlan(plan)}
              className={`
                rounded-2xl border p-6 cursor-pointer transition
                ${isSelected
                  ? "border-indigo-600 bg-indigo-50 shadow-lg scale-105"
                  : "border-gray-200 hover:shadow-md"}
              `}
            >
              <h3 className="text-lg font-semibold text-[#1c3681] mb-1">
                {plan.PLAN_NAME}
              </h3>

              <p className="text-3xl font-bold text-indigo-600">
                {plan.PRICE === 0 ? "Free" : `₹${plan.PRICE}`}
              </p>

              <p className="text-sm text-gray-500 mb-4">monthly</p>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {plan.DESCRIPTION}
              </p>

              <p className="text-xs text-gray-500 mb-6">
                👤 {plan.MAX_EMPLOYEES} users · ⌛ {plan.DURATION_DAYS} days
              </p>

              <button
                className={`w-full py-2 rounded-full text-sm font-medium
                  ${isSelected ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {isSelected ? "Selected" : "Choose"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={onBack} className="px-6 py-2.5 border rounded-md text-sm">
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!selectedPlan}
          className="px-10 py-2.5 bg-[#1c3681] text-white rounded-md text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Plans;
