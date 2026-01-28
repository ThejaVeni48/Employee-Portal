


export const ProjectDetails = async (projId,companyId)=>{


    console.log("companyId",companyId);
    console.log("projId",projId);
   
    


    try {


        const data = await fetch(`http://localhost:3001/api/ProjectDetails?projId=${projId}&orgId=${companyId}`);


        if(!data.ok)
        {
            throw new Error("Network response was not ok");
            
        }

        const res = await data.json();


        // const res = abc.data;
    


 return res.data;        
        
    } catch (error) {
        console.error("Error occured",error);
        
    }



}


