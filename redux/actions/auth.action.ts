import { Account } from "@/types/Account";
import { CLEAR, LOGIN } from "../types";

const setLoginReducer = (payload: any) => ({
  type: LOGIN,
  payload,
});

const setClearReducer = () => ({
  type: CLEAR,
});

const login = ({ username, password }: Account) => {
  return (dispatch: any) => {
    setTimeout(() => {
      dispatch(
        setLoginReducer({ token: Math.random().toString(), user: { username } })
      );
    }, 500);
  };
};

const clear = () => {
  return (dispatch: any) => {
    dispatch(setClearReducer());
  };
};

export default {
  login,
  clear,
};
