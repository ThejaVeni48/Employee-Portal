import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Plans.module.css";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/GetPlans");
        const data = await res.json();
        setPlans(data.data || []);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.PLAN_ID);
    navigate("/register", { state: { selectedPlan: plan } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose Your Plan</h2>
      <div className={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.PLAN_ID}
            className={`${styles.card} ${
              selectedPlan === plan.PLAN_ID ? styles.selected : ""
            }`}
            onClick={() => handleSelectPlan(plan)}
          >
            <h3 className={styles.planName}>{plan.PLAN_NAME}</h3>
            <p className={styles.planPrice}>
              {plan.PRICE === 0 ? "Free" : `₹${plan.PRICE}`}
            </p>
            <p className={styles.planDesc}>{plan.DESCRIPTION}</p>
            <ul className={styles.features}>
              {plan.FEATURE_TEXT && (
                <li key={plan.FEATURE_ORDER}>{plan.FEATURE_TEXT}</li>
              )}
            </ul>
            <p className={styles.planMeta}>
              👥 Up to {plan.MAX_EMPLOYEES} employees • ⏳ {plan.DURATION_DAYS} days
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
