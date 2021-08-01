import { InputAdornment, InputBase } from "@material-ui/core";

import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  input: {
    width: "100%",
    backgroundColor: "#f5f9f5",
    borderRadius: "10px",
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    color: "#8a8a8a !important",
  },
}));

const CustomInput = ({ placeholder, name, Icon, ...otherProps }) => {
  const classes = useStyles();

  return (
    <InputBase
      placeholder={placeholder}
      name={name}
      Icon={Icon}
      className={classes.input}
      startAdornment={
        <InputAdornment position={"start"}>
          <Icon />
        </InputAdornment>
      }
      {...otherProps}
    />
  );
};

export default CustomInput;
