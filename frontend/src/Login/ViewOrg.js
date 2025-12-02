import React from "react";
import { useLocation } from "react-router-dom";

const ViewOrg = () => {
  const location = useLocation();
  const data = location.state || {};

  console.log("Received Data:", data);


//    const handleNext = () => {
//   const data = {
//     firstName,
//     lastName,
//     companyName,
//     email,
//     domain,
//     address,
//     branch
//   };

//   setFormData(data);
//   console.log("formData", data);

//   navigate('/vieworg', { state: data });
// };

  return (
    <>
      <p>View Company Details</p>
      <p><strong>Company Name:</strong> {data.companyName}</p>
      <p><strong>First Name:</strong> {data.firstName}</p>
      <p><strong>Last Name:</strong> {data.lastName}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Branch:</strong> {data.branch}</p>
      <p><strong>Domain:</strong> {data.domain}</p>
      <p><strong>Address:</strong> {data.address}</p>
    </>
  );
};

export default ViewOrg;
