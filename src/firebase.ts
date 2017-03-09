import { AngularFireModule, AuthMethods } from 'angularfire2';
import * as firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyCfrpo_1Z1uPZXldSj-JyOagQPMbfq1ipk",
  authDomain: "youtube-player-a3d98.firebaseapp.com",
  databaseURL: "https://youtube-player-a3d98.firebaseio.com",
  storageBucket: "youtube-player-a3d98.appspot.com",
  messagingSenderId: "12752850961"
};

const firebaseAuthConfig = {
  method: AuthMethods.Popup,
  remember: 'default'
};

export const FirebaseConfigModule = AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig);
