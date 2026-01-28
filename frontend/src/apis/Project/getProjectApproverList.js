


export const getProjectApprovers = async (companyId,projId)=>{


    console.log("companyId getProjectApprovers",companyId);
    console.log("projId getProjectApprovers",projId);
   
    


    try {


        const data = await fetch(`http://localhost:3001/api/getProjectApprovers?projId=${projId}&orgId=${companyId}`);


        if(!data.ok)
        {
            throw new Error("Network response was not ok");
            
        }

        const res = await data.json();


     console.log("getProjectApprovers",res);


 return res;  
 

 
        
    } catch (error) {
        console.error("Error occured",error);
        
    }



}


