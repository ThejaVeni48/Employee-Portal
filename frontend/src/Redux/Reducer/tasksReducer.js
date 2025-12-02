


const initialState = {
    tasksList :[]
};


export const taskReducer = (state = initialState, action)=>{
    switch(action.type)
    {
        case 'GET_TASKS' : return{
            ...state,
            tasksList:action.payload
        };
        default: return state;
    }
}