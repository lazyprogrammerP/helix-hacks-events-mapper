import { Box, Button, CircularProgress } from "@material-ui/core";

import React from "react";

const CustomButton = ({ label, loading, small, ...otherProps }) => {
  return (
    <Box marginY={1}>
      <Button
        variant={"contained"}
        color={"secondary"}
        fullWidth
        size={"large"}
        disableElevation
        {...otherProps}
      >
        <Box fontSize={small ? 10 : 18}>
          {!loading ? (
            label
          ) : (
            <CircularProgress size={"18px"} color={"inherit"} />
          )}
        </Box>
      </Button>
    </Box>
  );
};

export default CustomButton;
