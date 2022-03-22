const initialState = {
  user: {},
  userToken: null,
  signInMethod: '',
  refered_by:'',
  userRole : ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        userToken: action.payload,
      };

    case 'SET_REFERER':
      return {
        ...state,
        refered_by: action.payload,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_USER_ROLE':
      return {
        ...state,
        userRole: action.payload
      }
    case 'SET_METHOD':
      return {
        ...state,
        signInMethod: action.payload,
      };
    default:
      return state;
  }
}
