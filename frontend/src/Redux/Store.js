import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; 
import ReducerFunction from "./Reducer/ReducerFunctions";
import { rolesReducer } from "./Reducer/roleReducer";
import { taskReducer } from "./Reducer/tasksReducer";
import { activeProjectsReducer } from "./Reducer/activeProjectsReducer";
import { getHierarchyReducer } from "./Reducer/gethierarchyReducer";

const rootReducer = combineReducers({
    user: ReducerFunction,
    roles: rolesReducer,
    tasks:taskReducer,
    activeprojects:activeProjectsReducer,
    Hierarchy:getHierarchyReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)   
);

export default store;
