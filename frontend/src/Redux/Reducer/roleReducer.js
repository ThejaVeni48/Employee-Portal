


const initialState = {
    roleList : []
};



export const rolesReducer = (state = initialState, action)=>{
    switch(action.type)
    {
        case 'GET_ROLES' : return {...state, roleList :action.payload};

        default : return state;
    }
}