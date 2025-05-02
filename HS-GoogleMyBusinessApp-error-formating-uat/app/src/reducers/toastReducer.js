import { OPEN_TOAST, CLOSE_TOAST } from '@/constants/actionTypes';


const initialState = {
  isOpen: false,
  type: '',
  message: '',
};

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_TOAST:
      return {
        ...state,
        isOpen: true,
        type: action.payload.type,
        message: action.payload.message,
      };
    case CLOSE_TOAST:
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

export default toastReducer;
