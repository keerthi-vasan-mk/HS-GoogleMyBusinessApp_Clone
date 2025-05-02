import { DEPOSIT, WITHDRAW } from '@/constants/actionTypes';


const initialState = {
  data: [],
};

const storageReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT:
      return {
        ...state,
        data: action.data,
      };
    case WITHDRAW:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

export default storageReducer;
