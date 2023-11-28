import Layout from "@/components/Layout";
import Header from "@/components/headers";
import actions from "@/redux/actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

const Login = (props: Props) => {
  const dispatch = useDispatch();
  const authenReducer = useSelector(({ authenReducer }) => authenReducer);

  return (
    <Layout>
      <div>
        Login
        <br />
        <button
          onClick={() => {
            dispatch<any>(
              actions.login({ username: "admin", password: "1234" })
            );
          }}
        >
          Login
        </button>
        <br />
        <span>{authenReducer.token ? authenReducer.token : ""}</span>
        <span>{authenReducer.token ? authenReducer.user.username : ""}</span>
      </div>
    </Layout>
  );
};

export default Login;
