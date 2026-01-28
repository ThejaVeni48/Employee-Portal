import { Button} from "flowbite-react";
import { useState,useEffect } from "react";
import { 
 
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import FormTextInput from "../../components/FormInput/FormInput";
import FormDatePicker from "../../components/DatePicker/DatePicker";
import AppModal from "../../components/Modals/AddModal";
import useModal from "../../components/hooks/useModal";
import DateFormat from "../../utility/dateFormat";
import FormLabel from "../../components/FormInput/FormInput";







const AddBranch = ()=>{

  const companyId = useSelector((state) => state.user.companyId);
   const email = useSelector((state) => state.user.email);
   const [branchList,setBranchList] = useState([]);
  const [branchData,setBranchData] = useState({
    branchName:'',
    branchCode:'',
    startDate:'',
    location:'',
    state:'',
    city:'',
    addressLine:'',
    fiscalStartMonth:"",
    fiscalEndMonth:"",
    finacialStartMonth:"",
    finacialEndMonth:"",
  })


  const {open,openModal,closeModal} =  useModal();

  const handleData = (key,value)=>{
    setBranchData((prev)=>({
        ...prev,


        [key]:value
    }))
  }


 const handleAddBranch = async () => {
  const payload = {
    ...branchData,
    email,
    orgId: companyId,
    startDate: DateFormat(branchData.startDate),
  };

  if (!branchData.branchCode || !branchData.branchName) {
    alert("Fill all fields");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3001/api/createBranch`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const res = await response.json();

    if (!response.ok) {
      alert(res.message || "Something went wrong");
      return;
    }

    alert(res.message);
    closeModal();
    resetForm();

  } catch (error) {
    console.error("error occurred", error);
  }
};


  const resetForm = ()=>{
    setBranchData({
branchName:'',
    branchCode:'',
    startDate:'',
    location:'',
    state:'',
    city:'',
    addressLine:'',
    fiscalStartMonth:"",
    fiscalEndMonth:"",
    finacialStartMonth:"",
    finacialEndMonth:"",
    })
  }



    return(
        <>
        
<button onClick={openModal}
      className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">New Branch</button>
     <AppModal
     isOpen={open} onClose={closeModal} size="xl"
      title ="Add Assignee"
      footer={
    <>
      <Button color="gray" onClick={closeModal}>
        Cancel
      </Button>

      <Button className="bg-[#1c3681]" onClick={handleAddBranch}>
        Add Branch
      </Button>
    </>
  } 
  >
      
      
       <div className="space-y-6">


{/* branch name */}
      <div className="relative">

       <FormLabel text="Branch Name" required/>
         <FormTextInput
  required
  placeholder="Enter Branch Name"
  value={branchData.branchName}
  onChange={(val) => handleData("branchName", val)}/>

       
</div>

{/* branch code */}
 <div className="relative">

 <FormLabel text="Branch Code" required/>
  <FormTextInput
    placeholder="Search employee"
    value={branchData.branchCode}
    onChange={(val) => handleData("branchCode",val)}
  />

</div>


{/* state city */}
<div className="grid grid-cols-2 gap-4 md:grid-cols-2">
    <div>

    <FormLabel text="State" required/>
    <FormTextInput
  required
  placeholder="Enter Branch"
  value={branchData.state}
    onChange={(val) => handleData("state",val)}
/>
    </div>

    <div>
 <FormLabel text="City" required/>
     <TextInput
    placeholder="Enter City"
    value={branchData.city}
    onChange={(e) => handleData("city",e.target.value)}
  />
    </div>
</div>


{/* start date */}

<div className="relative">
   <FormLabel text="Start Date" required/>
   <FormDatePicker
   value={branchData.startDate}
     onChange={(date)=>handleData("startDate",date)}/>
                </div>


{/* address */}
<div className="relative">
 <FormLabel text="Address" required/>
          <FormTextInput
    placeholder="Search employee"
    value={branchData.addressLine}
    onChange={(val) => handleData("addressLine",val)}
  />

</div>

{/* fisiacl */}

<div className="grid grid-cols-2 gap-4 md:grid-cols-2">
    <div>

    <FormLabel text="Fiscal Start Date" required/>
     {/* <FormDatePicker
   value={branchData.fiscalStartMonth}
     onChange={(date)=>handleData("fiscalStartMonth",date)}/> */}


      <TextInput
    placeholder="Enter fiscalStartMonth"
    value={branchData.fiscalStartMonth}
    onChange={(e) => handleData("fiscalStartMonth",e.target.value)}
  />
                </div>

   
               
    <div>

    <FormLabel text="Fiscal End Date" required/>


      <TextInput
    placeholder="Enter fiscalEndMonth"
    value={branchData.fiscalEndMonth}
    onChange={(e) => handleData("fiscalEndMonth",e.target.value)}
  />
     
                </div>
</div>
   
                

{/* financial */}
<div className="grid grid-cols-2 gap-4 md:grid-cols-2">
    <div>

    <FormLabel text="Financial Start Date" required/>

      <TextInput
    placeholder="Enter finacialStartMonth"
    value={branchData.finacialStartMonth}
    onChange={(e) => handleData("finacialStartMonth",e.target.value)}
  />
     
                 </div>

    <div>

    <FormLabel text="Fiscal End Date" required/>


      <TextInput
    placeholder="Enter finacialEndMonth"
    value={branchData.finacialEndMonth}
    onChange={(e) => handleData("finacialEndMonth",e.target.value)}
  />
    
                 </div>
                </div>


</div>


      </AppModal>
  
        
        
        </>
    )




}


export default AddBranch