import {    
    SET_LOGIN,
    SET_TOKEN,
    LOGOUT,
    SET_PUSH_REFRESH,
    LEAVE_CHANNEL
} from '../actions/loginAction';

const initialState = {
    loginstate:'',
    apptoken:'',
    refreshcheck:false,
    leave:{}
};

export default function LoginReducer(state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
      case SET_LOGIN:
        return {
          ...state,
          loginstate:payload
        }
      case SET_TOKEN:
        return {
          ...state,
          apptoken:payload.token
        }
      case LOGOUT:
        return{
          ...state,
          loginstate:''
        }
      case SET_PUSH_REFRESH:
        return{
          ...state,
          refreshcheck:payload.refreshcheck
        }
      case LEAVE_CHANNEL:
        return{
          ...state,
          leave:payload
        }
      default:
        return state;
    }
  }
