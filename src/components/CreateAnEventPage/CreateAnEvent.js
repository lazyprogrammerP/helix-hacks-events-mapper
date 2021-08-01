import { Box, Grid, Snackbar, Typography } from "@material-ui/core";
import {
  CalendarToday,
  FileCopy,
  Label,
  NavigationOutlined,
  VerticalSplitOutlined,
} from "@material-ui/icons";
import { addEventToDb, storage } from "../../firebase/firebase";

import { Alert } from "@material-ui/lab";
import ChooseLocationFromMap from "../ChooseLocationFromMap/ChooseLocationFromMap";
import CustomButton from "../CustomButton/CustomButton";
import CustomInput from "../CustomInput/CustomInput";
import React from "react";
import { useState } from "react";

const selectLocation = "SELECT_LOCATION";
const formPage = "FORM_PAGE";

const CreateAnEvent = () => {
  const [currentlyDisplaying, setCurrentlyDisplaying] =
    useState(selectLocation);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [creatingEvent, setCreatingEvent] = useState(false);

  const [message, setMessage] = useState(null);

  const handleGoToForm = (locationForEvent) => {
    setSelectedLocation(locationForEvent);
    setCurrentlyDisplaying(formPage);
    console.log(locationForEvent);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();

    let { eventName, eventDesc, startDate, endDate, eventCoverPhoto } =
      e.target;
    eventName = eventName.value;
    eventDesc = eventDesc.value;
    startDate = startDate.value;
    endDate = endDate.value;

    const coverPhotoRef = storage.ref(
      `eventCovers/${eventCoverPhoto.files[0].name}`
    );

    setCreatingEvent(true);
    coverPhotoRef
      .put(eventCoverPhoto.files[0])
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          addEventToDb({
            eventName,
            eventDesc,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            eventLocation: selectedLocation,
            eventCoverPhoto: downloadURL,
          })
            .then(() => {
              setCreatingEvent(false);
              setMessage({
                text: "Successfully created the event! Go back to the dashboard to view it.",
                color: "success",
              });

              e.target.eventName.value = "";
              e.target.eventDesc.value = "";
              e.target.startDate.value = "";
              e.target.endDate.value = "";
              e.target.eventLocation.value = "";

              setCurrentlyDisplaying(selectLocation);
            })
            .catch((error) => {
              setCreatingEvent(false);
              setMessage({
                text: "Error creating the event! Please try again.",
                color: "error",
              });
              console.log(error);
            });
        });
      })
      .catch((error) => alert(error));
  };

  return (
    <div>
      {currentlyDisplaying === selectLocation ? (
        <ChooseLocationFromMap onNext={handleGoToForm} />
      ) : (
        <Box
          width={"100%"}
          minHeight={"100vh"}
          style={{ backgroundColor: "#f5f9f5" }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          paddingY={6}
        >
          <Box
            width={"90%"}
            maxWidth={"500px"}
            style={{ backgroundColor: "#ffffff" }}
            paddingY={4}
            paddingX={5}
            borderRadius={"20px"}
            boxShadow={"0px 0px 20px 0px rgba(30, 30, 30, 0.04)"}
          >
            <Typography variant={"h5"} align={"center"}>
              Create An Event
            </Typography>
            <Box display={"flex"} justifyContent={"center"}>
              <img
                width={300}
                src={
                  "https://cdn.dribbble.com/users/81368/screenshots/5290532/illustration____22events_and_connections_22.png"
                }
                alt={"event-svg"}
              />
            </Box>
            <form onSubmit={handleCreateEvent}>
              <CustomInput
                placeholder={"Event Name"}
                name={"eventName"}
                Icon={Label}
                required
              />
              <CustomInput
                placeholder={"Event Description"}
                name={"eventDesc"}
                Icon={VerticalSplitOutlined}
                rows={5}
                multiline
                required
              />
              <Box>
                <small style={{ color: "#8a8a8a" }}>
                  Start Date - End Date
                </small>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CustomInput
                      placeholder={"Event Data"}
                      Icon={CalendarToday}
                      type={"date"}
                      name={"startDate"}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInput
                      placeholder={"Event Data"}
                      Icon={CalendarToday}
                      type={"date"}
                      name={"endDate"}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>

              <CustomInput
                placeholder={"Specific Location"}
                value={`${
                  selectedLocation.place_name
                    ? selectedLocation.place_name
                    : selectedLocation?.geometry.coordinates?.[0] +
                      ", " +
                      selectedLocation?.geometry.coordinates?.[1]
                }`}
                name={"eventLocation"}
                Icon={NavigationOutlined}
              />

              <Box>
                <CustomInput
                  type={"file"}
                  Icon={FileCopy}
                  name={"eventCoverPhoto"}
                  required
                />
                <small style={{ color: "#8a8a8a" }}>
                  Upload cover photo for the event!
                </small>
              </Box>

              <CustomButton
                label={"Create"}
                type={"submit"}
                loading={creatingEvent}
              />
            </form>
          </Box>
        </Box>
      )}

      <Snackbar
        open={Boolean(message?.text)}
        onClose={() => setMessage(null)}
        autoHideDuration={3000}
      >
        <Alert color={message?.color}>{message?.text}</Alert>
      </Snackbar>
    </div>
  );
};

export default CreateAnEvent;
