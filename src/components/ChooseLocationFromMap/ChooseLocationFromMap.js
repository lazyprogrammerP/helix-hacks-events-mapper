import "mapbox-gl/dist/mapbox-gl.css";

import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";

import CustomButton from "../CustomButton/CustomButton";
import { Link } from "react-router-dom";
import SearchLocationAndGetCoords from "../SearchLocationAndGetCoords/SearchLocationAndGetCoords";
import useGeoLocation from "../helpers/useGeoLocation";

const useStyles = makeStyles((theme) => ({
  nextButton: {
    left: "20px",
    bottom: "20px",
    position: "absolute",
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  geoLocateControl: {
    right: "30px",
    bottom: "30px",
    position: "absolute",
  },
}));

const ChooseLocationFromMap = ({ onNext }) => {
  const classes = useStyles();

  const { latitude, longitude } = useGeoLocation();

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    zoom: 18,
  });

  const [locationForEvent, setLocationForEvent] = useState(null);

  const [markerLngLat, setMarkerLngLat] = useState(null);

  useEffect(() => {
    setViewport((prevState) => ({
      ...prevState,
      latitude,
      longitude,
    }));

    setLocationForEvent({
      geometry: {
        coordinates: [longitude, latitude],
      },
    });

    setMarkerLngLat([longitude, latitude]);
  }, [latitude, longitude]);

  const setSelectedLocation = (item) => {
    setViewport((prev) => ({
      ...prev,
      longitude: item.geometry.coordinates[0],
      latitude: item.geometry.coordinates[1],
    }));

    setLocationForEvent(item);

    setMarkerLngLat(item.geometry.coordinates);
  };

  return (
    <div>
      {viewport.latitude && viewport.longitude && (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={
            "pk.eyJ1IjoibGF6eXByb2dyYW1tZXJwIiwiYSI6ImNrcnMzY2w3aTBmcjMycnFlZnp5OHcydGIifQ.MO0UdMhfYmmB4jKqVfLQNg"
          }
          mapStyle={"mapbox://styles/mapbox/dark-v10"}
          onViewportChange={(newViewport) => setViewport(newViewport)}
        >
          <SearchLocationAndGetCoords onSelect={setSelectedLocation} />

          <Box
            position={"absolute"}
            bottom={30}
            left={30}
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            <CustomButton
              label={"Continue"}
              small
              onClick={() => {
                if (!locationForEvent) {
                  alert("Please select a location for your event");
                  return;
                }
                onNext(locationForEvent);
              }}
            ></CustomButton>

            <Link to="/" style={{ marginLeft: "10px" }}>
              <CustomButton label={"Cancel"} small></CustomButton>
            </Link>
          </Box>

          <GeolocateControl className={classes.geoLocateControl} />

          {markerLngLat[0] && markerLngLat[1] && (
            <Marker
              latitude={markerLngLat[1]}
              longitude={markerLngLat[0]}
              draggable
              onDrag={(event) => setMarkerLngLat(event.lngLat)}
            >
              <svg
                width={"20px"}
                height={"auto"}
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 365 560"
                enableBackground="new 0 0 365 560"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    fill="#00AEEF"
                    d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9   C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"
                  />
                </g>
              </svg>
            </Marker>
          )}
        </ReactMapGL>
      )}
    </div>
  );
};

export default ChooseLocationFromMap;
