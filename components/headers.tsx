import actions from "@/redux/actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@mui/material/Button';

type Props = {};

const Header = (props: Props) => {
  const authenReducer = useSelector(({ authenReducer }) => authenReducer);
  const dispatch = useDispatch();
  return (
    <div>
      <Button variant="contained">Hello world</Button>
      {/* Header{" "}
      <button
        onClick={() => {
          dispatch<any>(actions.clear());
        }}
      >
        Reset
      </button>
      <br />
      <span>{authenReducer.token ? authenReducer.token : ""}</span>
      <span>{authenReducer.token ? authenReducer.user.username : ""}</span> */}
    </div>
  );
};

export default Header;
