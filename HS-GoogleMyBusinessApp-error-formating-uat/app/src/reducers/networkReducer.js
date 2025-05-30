import { REQUEST, SUCCESS, ERROR } from '@/constants/actionTypes';


const initialState = {
  isFetching: false,
  isSuccessful: false,
  error: null,
  requestType: null,
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccessful: false,
        error: null,
        requestType: action.type,
      };
    case SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSuccessful: true,
        error: null,
        requestType: action.type,
      };
    case ERROR:
      return {
        ...state,
        isFetching: false,
        isSuccessful: false,
        error: action.payload,
        requestType: action.type,
      };
    default:
      return state;
  }
}

export default networkReducer;