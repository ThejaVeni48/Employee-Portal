// this api is used for listing all employees in a organization.





export const employeeList = async (orgId)=>{


    console.log("orgId",orgId);
    

    try {


        const data = await fetch(`http://localhost:3001/api/getAllEmployees?companyId=${orgId}`);


        if(!data.ok)
        {
            throw new Error("Network response was not ok");
            
        }

        const res = await data.json();

        console.log("res for empoyees",res);
        


 return res;        
        
    } catch (error) {
        console.error("Error occured",error);
        
    }



}


