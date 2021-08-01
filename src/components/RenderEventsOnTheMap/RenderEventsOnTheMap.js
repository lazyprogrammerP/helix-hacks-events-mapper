import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import { getEvents, signOut } from "../../firebase/firebase";
import { useEffect, useState } from "react";

import CustomButton from "../CustomButton/CustomButton";
import { FilterList } from "@material-ui/icons";
import { Link } from "react-router-dom";
import React from "react";
import SearchLocationAndGetCoords from "../SearchLocationAndGetCoords/SearchLocationAndGetCoords";
import useGeoLocation from "../helpers/useGeoLocation";

const useStyles = makeStyles(() => ({
  eventBox: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f9f5",
    },
  },
}));

const RenderEventsOnTheMap = () => {
  const classes = useStyles();

  const { latitude, longitude } = useGeoLocation();

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    zoom: 14,
  });

  const [events, setEvents] = useState([]);

  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [locationFetched, setLocationFetch] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [anchor, setAnchor] = useState();
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    getEvents()
      .then((allEvents) => {
        setEvents(allEvents);
        setEventsLoaded(true);
        console.log(allEvents);
      })
      .catch(() => {
        setEventsLoaded(true);
      });

    const cleanTimeout = setTimeout(() => setMapLoaded(true), 4000);

    return () => clearTimeout(cleanTimeout);
  }, []);

  useEffect(() => {
    setViewport((prevState) => ({
      ...prevState,
      latitude,
      longitude,
    }));

    setLocationFetch(true);
    console.log("Called 1");
  }, [latitude, longitude]);

  return eventsLoaded && locationFetched ? (
    <div>
      <Box>
        <Box
          width={"320px"}
          height={"calc(100vh - 70px)"}
          style={{
            backgroundColor: "#ffffff",
          }}
          zIndex={10000}
          position={"absolute"}
          top={30}
          left={30}
          borderRadius={"20px"}
          paddingX={3}
          paddingY={3}
        >
          <Box>
            <SearchLocationAndGetCoords
              inputStyle={{ border: "1px solid #8a8a8a" }}
              wrapperStyles={{ padding: "0px !important" }}
              menuStyles={{ marginTop: "0px" }}
              onSelect={(coords) =>
                setViewport((prevState) => ({
                  ...prevState,
                  longitude: coords.geometry.coordinates[0],
                  latitude: coords.geometry.coordinates[1],
                }))
              }
            />
          </Box>

          <Box marginY={2}>
            <Divider />
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant={"body1"}>Showing "All Events"</Typography>
            <IconButton>
              <FilterList
                onClick={() =>
                  alert("We have not implemented this due to lack of time!")
                }
              />
            </IconButton>
          </Box>

          <Box overflow={"auto"} maxHeight={"calc(100% - 163.1px)"}>
            {events.map((event) => {
              return (
                <Box
                  display={"flex"}
                  alignItems={"flex-start"}
                  marginY={2}
                  className={classes.eventBox}
                  padding={2}
                >
                  <Box marginRight={2}>
                    <img
                      width={"50px"}
                      height={"50px"}
                      style={{ objectFit: "cover" }}
                      src={event.eventCoverPhoto}
                      alt={"event-cover"}
                    />
                  </Box>
                  <Box>
                    <Typography variant={"body2"}>{event.eventName}</Typography>
                    <Box>
                      <Typography variant={"caption"}>
                        {event.startDate
                          .toDate()
                          .toString()
                          .split(" ")
                          .splice(1, 3)
                          .join(" ")}
                        &nbsp;-&nbsp;
                        {event.endDate
                          .toDate()
                          .toString()
                          .split(" ")
                          .splice(1, 3)
                          .join(" ")}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant={"caption"}>
                        {event.eventLocation.place_name
                          ? event.eventLocation.place_name
                          : "Latitude: " +
                            event.eventLocation.geometry.coordinates[1] +
                            ", Longitude: " +
                            event.eventLocation.geometry.coordinates[0]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box
            position={"absolute"}
            bottom={"24px"}
            right={"24px"}
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Link to="/create-an-event">
              <Box marginRight={1}>
                <CustomButton label={"Create An Event"} small={"small"} />
              </Box>
            </Link>
            <CustomButton label={"Logout"} small={"small"} onClick={signOut} />
          </Box>
        </Box>
      </Box>
      {viewport.latitude && viewport.longitude && (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={
            "pk.eyJ1IjoibGF6eXByb2dyYW1tZXJwIiwiYSI6ImNrcnMzY2w3aTBmcjMycnFlZnp5OHcydGIifQ.MO0UdMhfYmmB4jKqVfLQNg"
          }
          style={{ zIndex: "9999" }}
          mapStyle={"mapbox://styles/mapbox/dark-v10"}
          scrollZoom
          onViewportChange={(newViewport) => setViewport(newViewport)}
        >
          <Box position={"absolute"} bottom={40} right={40}>
            <GeolocateControl showUserLocation showAccuracyCircle auto />
          </Box>

          {events.map((event) => (
            <Marker
              key={event.eventCoverPhoto}
              longitude={event.eventLocation.geometry.coordinates[0]}
              latitude={event.eventLocation.geometry.coordinates[1]}
            >
              <Box
                onClick={(e) => {
                  setAnchor(e.currentTarget);
                  setSelectedEvent(event);
                }}
                width={"30px"}
                height={"30px"}
                borderRadius={"50%"}
                border={"2.5px solid #ffffff"}
                overflow={"hidden"}
              >
                <img
                  src={event.eventCoverPhoto}
                  alt={"Event Creator"}
                  className={"marker-image"}
                />
              </Box>
            </Marker>
          ))}
        </ReactMapGL>
      )}
      {!mapLoaded && (
        <Box
          width={"100%"}
          height={"100vh"}
          position={"absolute"}
          zIndex={10000}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          style={{ backgroundColor: "#ffffff" }}
        >
          <CircularProgress size={"100px"} />
        </Box>
      )}

      <Menu open={Boolean(selectedEvent)} anchorEl={anchor}>
        {selectedEvent && <Box>Hello</Box>}
      </Menu>
    </div>
  ) : (
    <Box
      width={"100%"}
      height={"100vh"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <CircularProgress size={"100px"} />
    </Box>
  );
};

export default RenderEventsOnTheMap;
