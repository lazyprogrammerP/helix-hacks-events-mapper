import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { Redirect, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";

import CreateAnEvent from "./components/CreateAnEventPage/CreateAnEvent";
import RenderEventsOnTheMap from "./components/RenderEventsOnTheMap/RenderEventsOnTheMap";
import SignIn from "./components/SignIn/SignIn";
import { auth } from "./firebase/firebase";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setShow(true);
    });

    return unsubAuth;
  }, []);

  return (
    show && (
      <div className="app">
        <Switch>
          <Route path={"/sign-up"}>
            {!currentUser ? <SignIn isSignUp /> : <Redirect to={"/"} />}
          </Route>
          <Route path={"/sign-in"}>
            {!currentUser ? <SignIn /> : <Redirect to={"/"} />}
          </Route>
          <Route exact path={"/"}>
            {currentUser ? (
              <RenderEventsOnTheMap />
            ) : (
              <Redirect to={"/sign-up"} />
            )}
          </Route>
          <Route path={"/create-an-event"}>
            <CreateAnEvent />
          </Route>
        </Switch>
      </div>
    )
  );
}

export default App;
