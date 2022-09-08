const initialState = {
  user: {},
  userToken: null,
  signInMethod: '',
  refered_by: '',
  userRole: '',
  carts: [],
  showAnimation: false
};

export default function (state = initialState, action) {
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
    case "GET_CARTS_ITEMS":
      return {
        ...state,
        carts: [...action.payload]
      }
    case "ADD_CART":
      return {
        ...state,
        carts: [...state.carts, action.payload]
      }
    case "REMOVE_CART":
      return {
        ...state,
        carts: state.carts.filter(cart => cart.productID !== action.payload)
      }
    case "SET_SHOW_ANIMATION":
      console.log('animation action.payload ', action.payload)
      return {
        ...state,
        showAnimation: action.payload
      }
    default:
      return state;
  }
}
