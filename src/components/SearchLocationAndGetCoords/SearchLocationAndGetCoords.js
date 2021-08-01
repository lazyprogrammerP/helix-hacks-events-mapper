import { Box, ClickAwayListener, Typography } from "@material-ui/core";
import React, { useState } from "react";

import Autocomplete from "react-autocomplete";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inputField: {
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "40px",
    outline: "none",
  },
}));

const SearchLocationAndGetCoords = ({
  onSelect,
  inputStyle,
  wrapperStyles,
  menuStyles,
}) => {
  const classes = useStyles();

  const [what, setWhat] = useState("");
  const [whatResults, setWhatResults] = useState([]);

  const getResultsForPlacesAPI = (e) => {
    e.preventDefault();
    setWhatResults([]);

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${what}.json?access_token=pk.eyJ1IjoibGF6eXByb2dyYW1tZXJwIiwiYSI6ImNrcnMzY2w3aTBmcjMycnFlZnp5OHcydGIifQ.MO0UdMhfYmmB4jKqVfLQNg`
    ).then((response) => {
      response.json().then((data) => setWhatResults(data.features));
    });
  };

  const closeAutocompleteDropdown = () => {
    setWhatResults([]);
  };

  const handleSelect = (val, item) => {
    setWhat(val);
    onSelect(item);
  };

  return (
    <form onSubmit={getResultsForPlacesAPI}>
      <ClickAwayListener onClickAway={closeAutocompleteDropdown}>
        <Autocomplete
          wrapperStyle={{
            padding: "20px",
            width: "100%",
            maxWidth: "450px",
            ...wrapperStyles,
          }}
          inputProps={{
            className: classes.inputField,
            placeholder: "Search for an event venue...",
            style: inputStyle || {},
          }}
          menuStyle={{
            marginTop: "10px",
            width: "100%",
            maxWidth: "450px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
          }}
          autoHighlight
          getItemValue={(item) => item.place_name}
          items={whatResults}
          renderItem={(item, isHighlighted) => (
            <Box
              padding={2}
              style={{
                backgroundColor: isHighlighted ? "#f5f9f5" : "#ffffff",
              }}
            >
              <Typography noWrap>{item.place_name}</Typography>
            </Box>
          )}
          value={what}
          open={Boolean(whatResults.length)}
          onChange={(e) => setWhat(e.target.value)}
          onSelect={handleSelect}
        />
      </ClickAwayListener>
    </form>
  );
};

export default SearchLocationAndGetCoords;
