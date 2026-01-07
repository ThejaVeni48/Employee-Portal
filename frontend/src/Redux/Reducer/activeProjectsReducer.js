


const initialState = {
    activeProjectsList : []
};



export const activeProjectsReducer = (state = initialState, action)=>{
    switch(action.type)
    {
        case 'GET_ACTIVESUBSCRIPTION' : return {...state, activeProjectsList :action.payload};

        default : return state;
    }
}