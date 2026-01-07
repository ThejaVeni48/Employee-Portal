


const initialState = {
    activeSubscription : null
};



export const activeSubscriptionReducer = (state = initialState, action)=>{
    switch(action.type)
    {
        case 'GET_ACTIVESUBSCRIPTION' : return {...state, activeSubscription :action.payload};

        default : return state;
    }
}