import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT,
  TRANSFER_ERROR,
  TRANSFER_PENDING_ON,
  TRANSFER_PENDING_OFF,
  TRANSFER_COMPLETE,
  TRANSFER_FAILED
} from "../actions/types";

const INITIAL_STATE = {
  amount: "",
  amountWei: "",
  error: "",
  type: "",
  name: "",
  symbol: "",
  pending: false,
  completed: false,
  show: false,
  success: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSFER_FAILED:
      return { ...state, pending: false, completed: true, success: false };
    case TRANSFER_COMPLETE:
      return { ...state, pending: false, completed: true, success: true };
    case TRANSFER_PENDING_OFF:
      return { ...state, pending: false };
    case TRANSFER_PENDING_ON:
      return { ...state, pending: true };
    case TRANSFER_ERROR:
      return { ...state, error: action.payload.error, pending: false };
    case TRANSFER_AMOUNT_INPUT:
      return {
        ...state,
        amount: action.payload.amount,
        amountWei: action.payload.amountWei
      };
    case TRANSFER_HIDE:
      return { ...state, show: false };
    case TRANSFER_SHOW:
      return {
        ...INITIAL_STATE,
        show: true,
        type: action.payload.type,
        name: action.payload.name,
        symbol: action.payload.symbol
      };
    default:
      return state;
  }
};
