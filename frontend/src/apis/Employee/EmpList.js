// this api is used for listing all employees(except super users) in a organization.





export const EmpList = async (orgId)=>{


    console.log("orgId",orgId);
    

    try {


        const data = await fetch(`http://localhost:3001/api/getEmpList?companyId=${orgId}`);


        console.log("data",data);
        
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


