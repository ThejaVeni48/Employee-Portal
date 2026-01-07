import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; 
import ReducerFunction from "./Reducer/ReducerFunctions";
import { rolesReducer } from "./Reducer/roleReducer";
import { taskReducer } from "./Reducer/tasksReducer";
import { activeProjectsReducer } from "./Reducer/activeProjectsReducer";
import { getHierarchyReducer } from "./Reducer/gethierarchyReducer";
import { activeSubscriptionReducer } from "./Reducer/subscriptionReducer";

const rootReducer = combineReducers({
    user: ReducerFunction,
    roles: rolesReducer,
    tasks:taskReducer,
    activeprojects:activeProjectsReducer,
    Hierarchy:getHierarchyReducer,
    activeSubscription:activeSubscriptionReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)   
);

export default store;
