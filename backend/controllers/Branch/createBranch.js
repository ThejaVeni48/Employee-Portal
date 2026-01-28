


const db = require('../../config/db');
const { formatDateToLocal } = require('../../helpers/functions');



const createBranch = (req,res)=>{


    const {branchName,branchCode,startDate,
        state,
        city,
        addressLine,
        fiscalStartMonth,
        fiscalEndMonth,
        finacialStartMonth,
        finacialEndMonth,
        orgId,
        email
    }

    = req.body;


    console.log("req,body",req.body);
    

    const now = formatDateToLocal(new Date());


     // step1:check branchname or branch code exists

     const checkSql = `SELECT * FROM TC_BRANCH 
     WHERE  BRANCH_CODE = ? AND ORG_ID = ?`;



     db.query(checkSql,[branchCode,orgId],(checkError,checkResult)=>{

        if(checkError)
        {
            console.log("Error occured",checkError);
            return res.status(500).json({data:checkError})
            
        }

        if(checkResult.length > 0)
        {
            return res.status(400).json({message:"Branch Code already exists",status:400});
        }


        //step2: no exists insert then

        const insertSql = `INSERT INTO TC_BRANCH 
        (branch_code, branch_name, org_id, start_date,   state, city, Address_line1,  fiscal_start_month, fiscal_end_month, finacial_start_month, finacial_end_month, assigned_date, CREATED_BY)
        values (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      db.query(insertSql,[branchCode,branchName,orgId,startDate,state,city,addressLine,fiscalStartMonth,fiscalEndMonth,finacialStartMonth,finacialEndMonth,now,email],(insertError,insertResult)=>{

        if(insertError)
        {
            console.log("InsertError",insertError);
            return res.status(500).json({data:insertError})
            
        }
        return res.status(201).json({message:'Branch added successfully',status:201})
      })
     })
















}



module.exports = {createBranch}