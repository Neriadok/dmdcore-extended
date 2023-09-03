import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


export const firebaseOptions: FirebaseOptions = require(`../env/firebase.json`)
export const firebaseApp = initializeApp(firebaseOptions);
export const googleAnalytics = getAnalytics(firebaseApp);