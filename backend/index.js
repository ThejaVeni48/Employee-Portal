//installing the required libaries
const express = require('express');
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");


// creating an connection 
const app = express();

app.use(cors());

const upload = multer({ dest: "uploads/" });
app.use(express.json());

app.use("/PUBLIC/images", express.static(path.join(__dirname, "PUBLIC/images")));

// ---------------------------- Login APIs ------------------------------------------------------

// category Login

const categoryLogin = require('./routes/Login/categoryRoute');
app.use("/api/categoryLogin",categoryLogin)

// login api

const loginRoute = require('./routes/Login/loginRoute');
app.use("/api/login",loginRoute)


// change password api

const changePassword = require('./routes/Login/changePassword');
app.use('/api/changePassword',changePassword);


// login lookup

const LoginLookup = require('./routes/Login/loginlookup');
app.use('/api/LoginLookup',LoginLookup);

//  ------------------------------------------SSO Module ----------------------------------------------------

// sso shows companies list for 


const companiesList = require('./routes/SSO/companiesList');
app.use("/api/companiesList",companiesList);


// sso create default roles

const createDefaultRoles =  require('./routes/SSO/Roles');
app.use("/api/createDefaultRoles",createDefaultRoles);


// sso create default designations

const createDefaultDesgn =  require('./routes/SSO/Designation');
app.use("/api/createDefaultDesgn",createDefaultDesgn);

// sso create default jobs

const createDefaultJobs =  require('./routes/SSO/Jobs');
app.use("/api/createDefaultJobs",createDefaultJobs);



// sso for getting sso roles

const getDefaultRoles =  require('./routes/SSO/getRoles');
app.use("/api/getDefaultRoles",getDefaultRoles);


//sso for getting default designations

const getDefaultDesgn = require('./routes/SSO/getDesgn');
app.use("/api/getDefaultDesgn",getDefaultDesgn);


//sso for getting default jobs

const getDefaultJobs = require('./routes/SSO/getJobs');
app.use("/api/getDefaultJobs",getDefaultJobs);



// sso for uploading roles

const uploadRoles = require('./routes/SSO/uploadRole');
app.use("/api/uploadRoles",uploadRoles);


// sso for creating leaves

const createLeaves = require('./routes/SSO/leaves');
app.use("/api/createLeaves",createLeaves);

// sso for getting leaves


const getSSOLeaves = require('./routes/SSO/getLeaves');
app.use("/api/getSSOLeaves",getSSOLeaves);


// api for posting the timesheets into timesheet table

const postTimeSheet = require('./routes/postTimeSheetRoute');
app.use("/api/postTimesheet",postTimeSheet);


// api is used for accepting and rejecting the timesheet approval



// api is used for accepting and rejecting the leave approval
const acceptRejectLeave = require("./routes/Leaves/acceptRejectLeave");


// api for knowing the status of the timesheet
const getStatus = require('./routes/getStatusRoute');
app.use("/api/getStatus",getStatus);



// api for getting timesheet entries based on timesheetid

const getTimesheetEntries = require('./routes/getTimesheetEntriesRoute');
app.use("/api/getTimesheetEntries",getTimesheetEntries);












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


const getSubmittedTimesheets = require('./routes/Timesheet/getPendingTimesheets');
app.use('/api/getSubmittedTimesheets',getSubmittedTimesheets);


// api for accepting the timesheet (api for manager)

const acceptTimesheet = require("./routes/Timesheet/approveRejectTimesheet");
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





// api is used for getting the pending leave approvals (Manager module api)

const getPendingLeaves = require('./routes/Leaves/leaveRequest');
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

const createEmployee = require('./routes/Employees/postRoute');
app.use('/api/createEmployee',createEmployee);



// this api is used for getting all the employees

const getEmp = require('./routes/Employees/getEmployeesRoute');
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

const getNotifications = require('./routes/Notifications/getRoute');
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

// const createProject = require('./routes/createProjectRoute');
// app.use('/api/createProject',createProject)


// this api is used to show projects in admin Dashboard



const showProjects = require('./routes/showProjectsRoute');

app.use('/api/showProjects',showProjects)


// this api is used to show emp of same dept

const showDeptEmp = require('./routes/showDeptEmpRoute');
app.use('/api/showDeptEmp',showDeptEmp)


// this api used fpr the assigning projects for the employees

// const assignProject = require('./routes/assignProjectRoute');
// app.use('/api/assignProject',assignProject);


// this api is used for the displaying the list of employees who are not assigned leaves

const showEmployeesL = require('./routes/showEmployeesLRoute');
app.use('/api/showEmployeesL',showEmployeesL)


// this pai is used for displaying the employees assigned for an project


const assignedEmpP = require('./routes/assignedEmpPRoute');
app.use('/api/assignedEmpP',assignedEmpP);



// this api is used for showing the projects for the employyes in timesheet

const getProjects = require('./routes/getProjectsRoute');
app.use('/api/getProjects',getProjects)



// this api is used for getting the  employees leaves count per day


const getAbsenteesCount = require('./routes/getAbsenteesCountRoute');
app.use('/api/getAbsenteesCount',getAbsenteesCount)



// this api is used for getting all count(emp,projects,dept,projecst emp)

const getCount = require('./routes/getCountRoute');
app.use('/api/getCount',getCount)





// this api is used to get the project manager to the projectiD


const getProjectId = require('./routes/getProjectIdRoute');
app.use('/api/getProjectId',getProjectId);


const addTask = require('./routes/addTaskRoute');
app.use('/api/addTask',addTask);


// const getTask = require('./routes/getTaskaRoute');

// app.use('/api/getTask',getTask);



const getProjectsPM = require('./routes/getPMProjects');
app.use('/api/getProjectsPM',getProjectsPM);

// for mails

const email = require('./controllers/emailconfig');
app.use('/api/email',email)

// --------------------------------new apis----------------------
// this api is used for admin viewing timesheets

const getAllTimesheets = require('./routes/getAllTimesheetsRoute');
app.use('/api/getAllTimesheets',getAllTimesheets);


// this api is used for admin viewing leaves

const getAdminLeaves = require('./routes/getAdminLeavesRoute');
app.use('/api/getAdminLeaves',getAdminLeaves);



// this api is used for updating the employee status

const updateStatus = require('./routes/updateEmpStatusRoute');
app.use('/api/updateStatus',updateStatus)


const createOrgRole = require('./routes/Roles/createRoute');
app.use('/api/createOrgRole',createOrgRole);

const getOrgRole = require('./routes/Roles/getRoute');
app.use('/api/getOrgRole',getOrgRole);


const createProject1 = require('./routes/Project/createRoute');
app.use('/api/createProject1',createProject1)


// const getEmployees = require('./routes/Employees/getRoute');
// app.use('/api/getEmployees',getEmployees);


const getProject = require('./routes/Project/getRoute');
app.use('/api/getProject',getProject);


const getProjectEmployee = require('./routes/Project/getEmpRoute');
app.use('/api/getProjectEmployee',getProjectEmployee);

// this api is used for updating the status of the project

const updatePStatus = require('./routes/Project/updateStatusRoute');
app.use('/api/updateStatus',updatePStatus);





const activeProject = require('./routes/Project/activeProjectRoute');
app.use('/api/activeProject',activeProject);


// const createTask = require('./routes/Tasks/createRoute');
// app.use('/api/createTask',createTask);

const getTasks = require('./routes/Tasks/getRoute');
app.use('/api/getTasks', getTasks);


const EmpTask = require('./routes/Tasks/empTaskRoute');
app.use('/api/EmpTask',EmpTask);


const getTProjects = require('./routes/Timesheet/getRoute');
app.use('/api/getTProjects',getTProjects);

// // api for  save button
// const saveTimeSheets = require('./routes/Timesheet/saveTimesheetsRoute');
// app.use("/api/saveTimeSheets",saveTimeSheets);

// api for getting the  timesheetId
const getTimesheetId = require('./routes/Timesheet/getTimesheetId');
app.use('/api/getTimesheetId',getTimesheetId);

// api for getting the saved timesheet entries

const getSavedTimeSheetEntries = require('./routes/Timesheet/getSavedTimesheetEntriesRoute');
app.use('/api/getSavedTimeSheetEntries',getSavedTimeSheetEntries);

// api for getting the submit timesheet entries

const submitTimeSheet = require('./routes/Timesheet/submitTimesheet');
app.use('/api/submitTimeSheet',submitTimeSheet);



// api for getting the employees leaves history

const leaveHistory = require('./routes/Leaves/leaveHistory');
app.use('/api/leaveHistory',leaveHistory);



// api for getting the employees leaves summary
const leavesummary = require('./routes/Leaves/leavesummary');
app.use('/api/leavesummary',leavesummary);


// this api is used for showing the leaves types  (leaves management)


const leaveTypes = require('./routes/Leaves/leaveTypes');
app.use('/api/leaveTypes',leaveTypes)


// api is used for submitting the leave request

const submitLeave = require('./routes/Leaves/submitLeave');
app.use('/api/submitLeave',submitLeave); 


const weeklyTimesheetCSV = require('./routes/Timesheet/weeklyTimesheetCSV');
app.use('/api/weeklyTimesheetCSV',weeklyTimesheetCSV); 





// Designations

const CreateDesignation = require('./routes/Designation/createRoute');
app.use('/api/CreateDesignation',CreateDesignation)


const getDesignation = require('./routes/Designation/getRoute');
app.use('/api/getDesignation',getDesignation)




// COMPANIES ACCEPT /REJECT API

const ApproveRejectOrg = require('./routes/SSO/ApproveRejectOrg');
app.use('/api/ApproveRejectOrg',ApproveRejectOrg)



// adding employees

const addEmp = require('./routes/Employees/addEmp');
app.use('/api/addEmp',addEmp)


// updating user details

const updateDetails = require('./routes/Employees/updateDetails');
app.use('/api/updateDetails',updateDetails);



const uploadOrgRoles = require('./routes/Roles/uploadRoles');
app.use('/api/uploadOrgRoles',uploadOrgRoles)


const uploadOrgDesignations = require('./routes/Designation/uploadFile');
app.use('/api/uploadOrgDesignations',uploadOrgDesignations)


const createOrgAccess = require('./routes/Accessmodule/createRoute');
app.use('/api/createOrgAccess',createOrgAccess)


const getOrgAccess = require('./routes/Accessmodule/getRoute');
app.use('/api/getOrgAccess',getOrgAccess)


const empProfile = require('./routes/Employees/getProfile');
app.use('/api/empProfile',empProfile);



const assignRes = require('./routes/Employees/assignRes');
app.use('/api/assignRes',assignRes);


// api is used for displaying the emplouyees except super users

const getEmployees = require('./routes/Employees/getEmp');
app.use('/api/getEmployees',getEmployees);


// api for creating project (new api)

const addProject = require('./routes/Project/addProject');
app.use('/api/addProject',addProject)



// api for assigning project

const assignProject = require('./routes/Employees/assignProjects');
app.use('/api/assignProject',assignProject);


// api for creating task

const createTask = require('./routes/Tasks/createTask');
app.use('/api/createTask',createTask);

const getTask = require('./routes/Tasks/getTask');
app.use('/api/getTask',getTask);


const empProjects = require('./routes/Employees/empProjects');
app.use('/api/empProjects',empProjects);


const showApproveAccess = require('./routes/Project/showApproveAccess');
app.use('/api/showApproveAccess',showApproveAccess);


const approvalHierarchy = require('./routes/Project/approvalHierarchy');
app.use('/api/approvalHierarchy',approvalHierarchy);


const getApproveHierarchy = require('./routes/Project/getApproveHierarchy');
app.use('/api/getApproveHierarchy',getApproveHierarchy);


const hierarchyforAll = require('./routes/Project/HierarchyForAll');
app.use('/api/hierarchyforAll',hierarchyforAll)

// ------------------------------Timesheets------------------------------------------ 


const currentWeek = require('./routes/Timesheet/getCurrentWeek');
app.use('/api/currentWeek',currentWeek);



const saveTimesheet = require('./routes/Timesheet/saveTimesheet');
app.use('/api/saveTimesheet',saveTimesheet);


const getPendingTimesheets  = require('./routes/Timesheet/getPendingTimesheets');
app.use('/api/getPendingTimesheets',getPendingTimesheets);


const getHierarchy = require('./routes/Timesheet/getHierarchy');
app.use('/api/getHierarchy',getHierarchy);


const getAllEmpTimesheets = require('./routes/Timesheet/getAllTimesheets');
app.use('/api/getAllEmpTimesheets',getAllEmpTimesheets); 

const empTimesheetSummary = require('./routes/Timesheet/empTimesheetSummary');
app.use('/api/empTimesheetSummary',empTimesheetSummary);



// -----------------------------------Project Holidays --------------------------------------


const createPHolidays = require('./routes/Project/Holidays/post');
app.use('/api/createPHolidays',createPHolidays);


const getPHolidays = require('./routes/Project/Holidays/get');
app.use('/api/getPHolidays',getPHolidays);


const checkPHolidays = require('./routes/Project/Holidays/checkPHolidays');
app.use('/api/checkPHolidays',checkPHolidays)



// -----------------------project scheduler-----------------------

const saveScheduler = require('./routes/Project/Schedule/Schedule');
app.use('/api/saveScheduler',saveScheduler);


const getSchedule = require('./routes/Project/Schedule/getSchedule');
app.use('/api/getSchedule',getSchedule);


const getSchedulers = require('./routes/Project/Schedule/getSchedulers');
app.use('/api/getSchedulers',getSchedulers);


const getScheduleHours = require('./routes/Project/Schedule/getScheduledHours');
app.use('/api/getScheduleHours',getScheduleHours);



// ------------------------- organization holidays ---------------------------------------



// this api is used for creating holidays by the hr

const createHolidays = require('./routes/Holidays/createRoute');
app.use('/api/createHolidays',createHolidays);


// this api is used for checking the holidays 

const checkHolidays = require('./routes/Holidays/checkHoliday');
app.use('/api/checkHolidays',checkHolidays)


// this api used for showing holidays in hr,employees and admin

const getHolidays = require('./routes/Holidays/getHolidays');
app.use('/api/getHolidays',getHolidays);



// ====================================Timesheet Customization =========================================

const TimesheetCustomization = require('./routes/Settings/timesheetcustomization');
app.use('/api/TimesheetCustomization',TimesheetCustomization);



// schedules


require('./controllers/Schedules//timesheetGenerate');
// require('./controllers/Schedules/dummyApi');


// to listen on port

app.listen(3001,()=>{
    console.log("Server running on 3001");
})


// module.exports = db;

