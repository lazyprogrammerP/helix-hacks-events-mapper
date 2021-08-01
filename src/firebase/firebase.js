import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA1u5lUbXOL4MtW8cyXbCwXbilWv_OMxGY",
  authDomain: "outcasts-d1d96.firebaseapp.com",
  projectId: "outcasts-d1d96",
  storageBucket: "outcasts-d1d96.appspot.com",
  messagingSenderId: "698041736529",
  appId: "1:698041736529:web:4ce70e1b55c62c532cc770",
};

const fireApp = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const signUp = async (email, password) =>
  await auth
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => alert(`Error :(\nCouldn't sign up! ${error}`));

export const signIn = async (email, password) =>
  await auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(`Error :(\nCouldn't sign in! ${error}`));

export const addEventToDb = async (eventObj) =>
  await db
    .collection("events")
    .add({
      ...eventObj,
    })
    .catch((error) => alert(`Error :(\nCouldn't add the event! ${error}`));

export const getEvents = async () =>
  await db
    .collection("events")
    .get()
    .then((res) => res.docs.map((eventDoc) => eventDoc.data()))
    .catch((error) =>
      alert(
        `Error :(\nCouldn;t get the events! Refresh your page and try again! ${error}`
      )
    );

export const signOut = async () =>
  await auth
    .signOut()
    .catch((error) =>
      alert(
        `Error :(\nCouldn't sign out! Refresh your page and try again! ${error} )`
      )
    );

export default fireApp;
