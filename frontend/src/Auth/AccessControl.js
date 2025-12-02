



const HasAccess = (userAccess =[],requiredAccess = []) =>{


    if(!requiredAccess || requiredAccess.length ===0)
    {
        return true;
    }

    return requiredAccess.some(access =>userAccess.includes(access))







}


export default  HasAccess