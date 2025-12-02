


const initialState = {
  hasHierarchy: false,
  levels: []   // always array in both cases
};



export const   getHierarchyReducer = (state = initialState, action)=>{
    switch (action.type) {
    case "GET_HIERARCHY":
      return {
        ...state,
        hasHierarchy: action.payload.hasHierarchy,
        levels: action.payload.levels
      };

    default:
      return state;
  }
}