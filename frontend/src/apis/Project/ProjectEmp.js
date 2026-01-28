


export const ProjectEmp = async (companyId,projId)=>{


    console.log("companyId ProjectEmp",companyId);

    console.log("PROJID ProjectEmp",projId);
    

    


    try {


        const data = await fetch(`http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${projId}`);


        if(!data.ok)
        {
            throw new Error("Network response was not ok");
            
        }

        const res = await data.json();

        console.log("res for projectEmp",res);
        
    


 return res;        
        
    } catch (error) {
        console.error("Error occured",error);
        
    }



}


