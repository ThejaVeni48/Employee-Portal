


export const getBranch = async (orgId)=>{


    try {


        const data = await fetch(`http://localhost:3001/api/getBranch?orgId=${orgId}`);


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


