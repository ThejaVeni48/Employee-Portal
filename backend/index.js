//installing the required libaries
const express = require('express');
const cors = require("cors");
const path = require("path");


// api is used for accepting and rejecting the timesheet approval

const acceptTimesheet = require("./routes/acceptTimesheetRoute");

// api is used for accepting and rejecting the leave approval
const acceptRejectLeave = require("./routes/acceptRejectLeaveRoute");





// creating an connection between
const app = express();

app.use(cors());

app.use(express.json());

app.use("/PUBLIC/images", express.static(path.join(__dirname, "PUBLIC/images")));


// login api

const loginRoute = require('./routes/loginRoute');
app.use("/api/login",loginRoute)


// api for posting the timesheets into timesheet table

const postTimeSheet = require('./routes/postTimeSheetRoute');
app.use("/api/postTimesheet",postTimeSheet);




// api for knowing the status of the timesheet
const getStatus = require('./routes/getStatusRoute');
app.use("/api/getStatus",getStatus);



// api for getting timesheet entries based on timesheetid

const getTimesheetEntries = require('./routes/getTimesheetEntriesRoute');
app.use("/api/getTimesheetEntries",getTimesheetEntries);





// api for  save button
const saveTimeSheets = require('./routes/saveTimesheetEntriesRoute');
app.use("/api/saveTimeSheets",saveTimeSheets);



// api for getting the saved timesheet entries

const getSavedTimeSheetEntries = require('./routes/getSavedTimesheetEntriesRoute');
app.use('/api/getSavedTimeSheetEntries',getSavedTimeSheetEntries);


// api for getting the status (saved and submitted) for timesheet

const status = require('./routes/statusRoute');
app.use('/api/status',status);


// api for fetching user details

const getUserDetails = require('./routes/getUserDetailsRoute');

app.use('/api/getUserDetails',getUserDetails);






// api for getting profileimage

const profileImage = require('./routes/getProfilePicRoute');
app.use('/api/profileImage',profileImage);



// api for getting the submitted timesheets (api for manager)


const getSubmittedTimesheets = require('./routes/getSubmittedTimesheetsRoute');
app.use('/api/getSubmittedTimesheets',getSubmittedTimesheets);


// api for accepting the timesheet (api for manager)


// const acceptTimesheet = require('./routes/acceptTimesheet');
app.use('/api/acceptTimesheet',acceptTimesheet);





//api for getting the only approved timesheet (for manager)

const approvedTimeSheet = require('./routes/getApprovedTimesheetRoute');
app.use('/api/approvedTimeSheet',approvedTimeSheet);



// api used for getting the timesheetCode

const getTimeSheetCode = require('./routes/getTimesheetCodeRoute');
app.use('/api/getTimeSheetCode',getTimeSheetCode);



// api is used for getting the hours and daily hours in emp dashboard

const getHours = require('./routes/getHoursRoute');
app.use('/api/getHours',getHours);

// api is used for submitting the leave request

const submitLeave = require('./routes/submitLeaveRoute');
app.use('/api/submitLeave',submitLeave); 



// api is used for getting the pending leave approvals (Manager module api)

const getPendingLeaves = require('./routes/getPendingLeavesRoute');
app.use('/api/getPendingLeaves',getPendingLeaves);

// const acceptRejectLeave = require('./routes/acceptRejectLeave');
app.use('/api/acceptRejectLeave',acceptRejectLeave);

// this api is used for getting the available leaves

const getLeaves = require('./routes/getLeavesRoute');
app.use('/api/getLeaves',getLeaves);

// this api is used for getting the leaves taken by the employee

//leaves history for employee

const showAllLeaves = require('./routes/getAllLeavesRoute');
app.use('/api/showAllLeaves',showAllLeaves);



// this api is used to check whether the employee has taken then leave in this week

const checkLeaves = require('./routes/checkLeavesRoute');
app.use('/api/checkLeaves',checkLeaves);



// this api is used for registering the company by the admin of that particular company


const registerCompany = require('./routes/companyRegisterRoute');
app.use('/api/registerCompany',registerCompany);

// this api is used for creating the employees by the admin

const createEmp = require('./routes/createEmployeeRoute');
app.use('/api/createEmp',createEmp);



// this api is used for getting all the employees

const getEmp = require('./routes/getEmployeesRoute');
app.use('/api/getEmp',getEmp)


// this api is used for leaves creation by the admin


const leavesCreate = require('./routes/createLeavesRoute');
app.use('/api/leavesCreate',leavesCreate);



// this api is used for showing the leaves types in admin (leaves management)


const getLeaveTypes = require('./routes/getLeavesTypeRoute');
app.use('/api/getLeaveTypes',getLeaveTypes)

// this api is used for assigning leaves for the employee by the admin


const assignLeaves = require('./routes/assignLeavesRoute');
app.use('/api/assignLeaves',assignLeaves);


//this api is used for notifications in the employee dashboard

const getNotifications = require('./routes/getNotificationsRoute');
app.use('/api/getNotifications',getNotifications);


// this api is used for adding department by the admin


const addDept = require('./routes/addDeptRoute');
app.use('/api/addDept',addDept)


// this api is used for showing the departmenst


const showDept = require('./routes/showDeptsRoute');
app.use('/api/showDept',showDept)



// this api is used to get Project managers

const getPM = require('./routes/getProjectManagerRoute');

app.use('/api/getPM', getPM);


// this api is used to create projects by the Admin

const createProject = require('./routes/createProjectRoute');
app.use('/api/createProject',createProject)


// this api is used to show projects in admin Dashboard



const showProjects = require('./routes/showProjectsRoute');

app.use('/api/showProjects',showProjects)


// this api is used to show emp of same dept

const showDeptEmp = require('./routes/showDeptEmpRoute');
app.use('/api/showDeptEmp',showDeptEmp)


// this api used fpr the assigning projects for the employees

const assignProject = require('./routes/assignProjectRoute');
app.use('/api/assignProject',assignProject);


// this api is used for the displaying the list of employees who are not assigned leaves

const showEmployeesL = require('./routes/showEmployeesLRoute');
app.use('/api/showEmployeesL',showEmployeesL)


// this pai is used for displaying the employees assigned for an project


const assignedEmpP = require('./routes/assignedEmpPRoute');
app.use('/api/assignedEmpP',assignedEmpP);



// this api is used for showing the projects for the employyes in timesheet

const getProjects = require('./routes/getProjectsRoute');
app.use('/api/getProjects',getProjects)





























// to listen on port

app.listen(3001,()=>{
    console.log("Server running on 3001");
})


// module.exports = db;

