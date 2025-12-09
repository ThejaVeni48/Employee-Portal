// this api is used for user detils related t project and project shedulers, i.e scheduled_month,assigned date, start and end Dtses of Schedulers.





const  getSchedulers = (req,res)=>{



    const {projId,empId,orgId} = req.query;


    const getSql = `SELECT `

}


module.exports = {getSchedulers}