

export const fetchRoles = (companyId)=>{
    return async(dispatch) =>{
        try {
             const data = await fetch(`http://localhost:3001/api/getOrgRole?companyId=${companyId}`);
        const res = await data.json();
        console.log("res for roles",res);
        

        dispatch({
            type:'GET_ROLES',
            payload:res.data
        })
        } catch (error) {
            console.error("Error occured",error);
            
        }
       
    }
}