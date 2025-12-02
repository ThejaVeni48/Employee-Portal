


const initialState = {
    activeProjectsList : []
};



export const activeProjectsReducer = (state = initialState, action)=>{
    switch(action.type)
    {
        case 'GET_ACTIVEPROJECTS' : return {...state, activeProjectsList :action.payload};

        default : return state;
    }
}