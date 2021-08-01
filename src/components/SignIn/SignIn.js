import { Box, Typography } from "@material-ui/core";
import { LockOutlined, MailOutlineRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { signIn, signUp } from "../../firebase/firebase";

import CustomButton from "../CustomButton/CustomButton";
import CustomInput from "../CustomInput/CustomInput";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  logo: {
    width: "70%",
    margin: "0 auto",
    display: "block",
  },
}));

const SignIn = ({ isSignUp }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();

    let { email, password, confPassword } = e.target;
    email = email.value;
    password = password.value;
    confPassword = confPassword.value;

    if (password !== confPassword) {
      alert("Please recheck the password and confirm password!");
      return;
    }

    setLoading(true);
    signUp(email, password)
      .then(() => {
        email.value = "";
        password.value = "";

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    let { email, password } = e.target;
    email = email.value;
    password = password.value;

    setLoading(true);
    signIn(email, password)
      .then(() => {
        email.value = "";
        password.value = "";

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      style={{
        backgroundColor: "#f5f9f5",
      }}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={"90%"}
        maxWidth={"500px"}
        paddingY={4}
        paddingX={5}
        style={{ backgroundColor: "#ffffff" }}
        margin={"0px auto"}
        boxShadow={"0px 0px 20px 0px rgba(30, 30, 30, 0.04)"}
        borderRadius={"20px"}
      >
        <img
          className={classes.logo}
          width={"70%"}
          src={
            "https://media.discordapp.net/attachments/871073066908794970/871261285654863942/image-removebg-preview_6_1.png"
          }
          alt={"logo"}
        />
        <Box marginBottom={2}>
          <Typography variant={"h6"} align={"center"}>
            We outcast loneliness!
          </Typography>
        </Box>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <CustomInput
            placeholder={"Username Or Email"}
            name={"email"}
            Icon={MailOutlineRounded}
            required
          />
          <CustomInput
            placeholder={"Password"}
            name={"password"}
            Icon={LockOutlined}
            required
            type={"password"}
          />
          {isSignUp ? (
            <CustomInput
              placeholder={"Retype Password"}
              name={"confPassword"}
              Icon={LockOutlined}
              required
              type={"password"}
            />
          ) : (
            <></>
          )}
          <CustomButton
            label={`Sign ${isSignUp ? "Up" : "In"}`}
            loading={loading}
            type={"submit"}
          />
          <Box
            marginY={2}
            display={"flex"}
            flexWrap={"wrap"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {isSignUp ? (
              <Link to={"/sign-in"}>Already have an account?</Link>
            ) : (
              <Link to={"/sign-up"}>Don't have an account!</Link>
            )}
            {!isSignUp && <Link to={"/forgot-password"}>Forgot Password?</Link>}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SignIn;
