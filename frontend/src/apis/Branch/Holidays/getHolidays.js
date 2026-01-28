


export const getBranchHolidays = async (orgId,branchId)=>{


    try {


        const data = await fetch(`http://localhost:3001/api/getBranchHolidays?orgId=${orgId}&branchId=${branchId}`);


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


