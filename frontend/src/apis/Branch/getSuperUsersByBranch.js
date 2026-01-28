


export const getSuperUsersByBranch = async (companyId,branchId)=>{


    console.log("getSuperUsersByBranch orgId",companyId);
    console.log("getSuperUsersByBranch branchId",branchId);
    
    try {


        const data = await fetch(`http://localhost:3001/api/getSuperUsersByBranch?orgId=${companyId}&branchId=${branchId}`);


        if(!data.ok)
        {
            throw new Error("Network response was not ok");
            
        }

        const res = await data.json();
console.log("getSuperUsersByBranch",res);


 return res;        
        
    } catch (error) {
        console.error("Error occured",error);
        
    }



}


