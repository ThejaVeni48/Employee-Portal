// this api is used to update the branch




const db = require('../../config/db');
const { formatDateToLocal } = require('../../helpers/functions');



const updateBranch = (req,res)=>{



    const {orgId,branchId,email} = req.body;


    const now = formatDateToLocal(new Date());

    console.log("orgId",orgId);
    console.log("branchId",branchId);
    console.log("email",email);
    


    const updateSql = `UPDATE TC_BRANCH
    SET STATUS = 'I', END_DATE=?,LAST_UPDATED_BY = ?
     WHERE ORG_ID = ? 
    AND BRANCH_ID = ? `;


    db.query(updateSql,[now,email,orgId,branchId],(updateErr,updateRes)=>{
        if(updateErr)
        {
             console.log("updateErr",updateErr)
            return res.status(500).json({data:updateErr,status:500});
        }
             console.log("updateRes",updateRes)

        return res.status(200).json({message:'Branch Updated Successfully',status:200})
    })





}


module.exports = {updateBranch}