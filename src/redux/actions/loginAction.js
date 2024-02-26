export const SET_LOGIN = 'SET_LOGIN';
export const SET_TOKEN = 'SET_TOKEN';
export const LOGOUT = 'LOGOUT';
export const SET_PUSH_REFRESH = 'SET_PUSH_REFRESH';
export const LEAVE_CHANNEL = 'LEAVE_CHANNEL';
export const set_login = (props)=> ({ type: SET_LOGIN,payload: props  });
export const set_token = (props)=> ({ type: SET_TOKEN,payload: props  });
export const logout = ()=> ({ type: LOGOUT  });
export const set_push_refresh = (props) => ({type:SET_PUSH_REFRESH,payload:props})
export const leave_channel = (props) => ({type:LEAVE_CHANNEL,payload:props})