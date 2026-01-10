// this api is used for assigning the shifts to the employee.



const db  = require('../../config/db');
const moment = require('moment');


const assignShift = (req,res)=>{


    const {orgId,shiftId,empId,shiftCode,email}  = req.body;

     if (!orgId || !empId || !shiftCode) {
    return res.status(400).json({
      success: false,
      message: "ORG_ID, EMP_ID and Shift Code are required"
    });
  }


    const today = moment().format('YYYY-MM-DD');

     const ACTIVE = "A";
  const INACTIVE = "I";



  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json({
        success: false,
        message: "Transaction start failed"
      });
    }

 // step1 : Deactivate old shift
    const deactivateAssignSql = `
      UPDATE TC_SHIFT_ASSIGNMENT
      SET STATUS = ?, END_DATE = ?, LAST_UPDATED_BY = ?, LAST_UPDATED_DATE = NOW()
      WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ?
    `;

    db.query(
      deactivateAssignSql,
      [INACTIVE, today, email, orgId, empId, ACTIVE],
      (deactErr) => {
        if (deactErr) {
          return db.rollback(() =>
            res.status(500).json({ success: false, message: "Failed to deactivate shift" })
          );
        }

     

            // step 2 Insert new shift
 const insertAssignSql = `INSERT INTO TC_SHIFT_ASSIGNMENT (SHIFT_CODE,EMP_ID,ORG_ID,START_DATE,STATUS,CREATED_BY)
    VALUES (?,?,?,?,?,?)`;

            db.query(
              insertAssignSql,
              [
                 shiftCode,
                  empId,
                orgId,
                today,
                ACTIVE,
                email
              ],
              (insErr, insRes) => {
                if (insErr) {
                  return db.rollback(() =>
                    res.status(500).json({ success: false, message: "Assignment insert failed" })
                  );
                }


                res.status(200).json({
                  success: true,
                  message: "Shifts updated successfully",
                 
                });
               


                
               
                 
            }
                    
                
                  );
              
              }
            );

          
          }
        );


};

module.exports = { assignShift };


//    step1: fetch the shift id



//     const insertSql = `INSERT INTO TC_SHIFT_ASSIGNMENT (SHIFT_CODE,EMP_ID,ORG_ID,START_DATE,STATUS,CREATED_BY)
//     VALUES (?,?,?,?,?,?)`;

//     db.query(insertSql,[shiftCode,empId,orgId,today,status,email],(insertErr,insertRes)=>{
//         if(insertErr)
//         {
//             console.log("insertErr",insertErr);
//             return res.status(500).json({data:insertErr})
            
//         }

//         return res.status(201).json({
//             message:'Shift assigned successfully',
//             status:201
//         })
//     })




// }


// module.exports = {assignShift}