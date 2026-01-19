import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Plans.module.css";
import { useSelector } from "react-redux";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  // Get active subscription from redux or location state
  const activeSubscription = location?.state?.activeSubscription || null;


  //9025924325

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/GetPlans?orgId=${companyId}`);
        const data = await res.json();
        setPlans(data.data || []);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);

    // If no active subscription, navigate directly to register page
    if (!activeSubscription) {
      navigate("/register", { state: { selectedPlan: plan } });
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) {
      alert("Please select a plan to upgrade.");
      return;
    }

    console.log("selected plan",selectedPlan);
    

    try {
      const res = await fetch(`http://localhost:3001/api/upgradeSubscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: activeSubscription.ORG_ID,
          newPlanId: selectedPlan.PLAN_ID,
          email
        })
      });

      const data = await res.json();
      if (res.status === 200) {
        alert(data.message || "Plan upgraded successfully!");
        navigate("/");
      } else {
        alert(data.message || "Failed to upgrade plan");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while upgrading the plan.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose Your Plan</h2>

      {activeSubscription && activeSubscription.PLAN_ID && (
        <div className={styles.currentPlanBanner}>
          <h3>Current Plan</h3>
          <p>
            {`Plan: ${activeSubscription.PLAN_ID} | Max Employees: ${activeSubscription.MAX_EMPLOYEES} | Ends on: ${activeSubscription.END_DATE}`}
          </p>
        </div>
      )}

      <div className={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.PLAN_ID}
            className={`${styles.card} ${
              selectedPlan?.PLAN_ID === plan.PLAN_ID ? styles.selected : ""
            }`}
            onClick={() => handleSelectPlan(plan)}
          >
            <h3 className={styles.planName}>{plan.PLAN_NAME}</h3>
            <p className={styles.planPrice}>
              {plan.PRICE === 0 ? "Free" : `₹${plan.PRICE}`}
            </p>
            <p className={styles.planDesc}>{plan.DESCRIPTION}</p>
            <ul className={styles.features}>
              {plan.FEATURE_TEXT && <li key={plan.FEATURE_ORDER}>{plan.FEATURE_TEXT}</li>}
            </ul>
            <p className={styles.planMeta}>
              👤 Up to {plan.MAX_EMPLOYEES} employees .
               ⌛ {plan.DURATION_DAYS} days
            </p>
          </div>
        ))}
      </div>

      {/* show upgrade only if active subscription exists */}

      {activeSubscription && activeSubscription.PLAN_ID && (
        <button className={styles.upgradeBtn} onClick={handleUpgrade}>
          Upgrade Plan
        </button>
      )}
    </div>
  );
};

export default Plans;
