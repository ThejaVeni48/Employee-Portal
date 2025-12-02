import { loadUserFromLocalStorage } from "../loadUser";

const savedUser = loadUserFromLocalStorage();

const initialState = savedUser || {
    email: '',
    userId: '',
    profileImage: '',
    firstName: '',
    lastName: '',
    middleName: '',
    Role: '',
    companyId: '',
    empId: '',
    fullName: '',
    companyName: '',
    timesheetCode: '',
    deptId: '',
    pStatus: '',
    createdBy: '',
    searchQuery: '',
    domain: "",
    projectId: "",
    loginAttempts: '',
    accessCode: [],
};

// Helper function to save to localStorage after every update
const saveState = (state) => {
    console.log("Saving to LS:", state);   // <-- ADD THIS
    localStorage.setItem("userState", JSON.stringify(state));
};


const ReducerFunction = (state = initialState, action) => {
    let updatedState = state;

    switch (action.type) {

        case 'GET_EMAIL':
            updatedState = { ...state, email: action.payload };
            break;

        case 'GET_USERID':
            updatedState = { ...state, userId: action.payload };
            break;

        case 'GET_FIRSTNAME':
            updatedState = { ...state, firstName: action.payload };
            break;

        case 'GET_FULLNAME':
            updatedState = { ...state, fullName: action.payload };
            break;

        case 'GET_LASTNAME':
            updatedState = { ...state, lastName: action.payload };
            break;

        case 'GET_MIDDLENAME':
            updatedState = { ...state, middleName: action.payload };
            break;

        case 'GET_PROFILE':
            updatedState = { ...state, profileImage: action.payload };
            break;

        case 'GET_ROLE':
            updatedState = { ...state, Role: action.payload };
            break;

        case 'GET_COMPANYID':
            updatedState = { ...state, companyId: action.payload };
            break;

        case 'GET_EMPLOYEEID':
            updatedState = { ...state, empId: action.payload };
            break;

        case 'GET_COMPANYNAME':
            updatedState = { ...state, companyName: action.payload };
            break;

        case 'GET_TIMESHEETCODE':
            updatedState = { ...state, timesheetCode: action.payload };
            break;

        case 'GET_DEPTID':
            updatedState = { ...state, deptId: action.payload };
            break;

        case 'GET_PROJECTSTATUS':
            updatedState = { ...state, pStatus: action.payload };
            break;

        case 'GET_CREATEDBY':
            updatedState = { ...state, createdBy: action.payload };
            break;

        case 'GET_SEARCHQUERY':
            updatedState = { ...state, searchQuery: action.payload };
            break;

        case 'GET_DOMAIN':
            updatedState = { ...state, domain: action.payload };
            break;

        case 'GET_PROJECTID':
            updatedState = { ...state, projectId: action.payload };
            break;

        case 'GET_LOGINATTEMPTS':
            updatedState = { ...state, loginAttempts: action.payload };
            break;

        case 'GET_ACCESSCODE':
            updatedState = { ...state, accessCode: action.payload };
            break;

        default:
            return state;
    }

    // Save updated state to localStorage after every action
    saveState(updatedState);

    return updatedState;
};

export default ReducerFunction;
