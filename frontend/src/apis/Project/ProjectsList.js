


export const ProjectsList = async (companyId,empId,role)=>{


    console.log("companyId",companyId);
    console.log("empId",empId);
    console.log("role",role);
    


    try {


        const data = await fetch(`http://localhost:3001/api/getProject?companyId=${companyId}&empId=${empId}&role=${role}`);


        if(!data.ok)
        {
            throw new Error("Network response was not ok");
            
        }

        const res = await data.json();

    


 return res;        
        
    } catch (error) {
        console.error("Error occured",error);
        
    }



}


