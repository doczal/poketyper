import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.db = app.firestore();
    this.auth = app.auth();

    this.db.settings({
      timestampsInSnapshots: true
    });
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  addNewUserToDB = (username = "Anonymous", uid) => {
    return this.db.collection("users").doc(uid).set({
      name: username,
      score: 0,
    });
  };

  updateScoreOnDB = (uid, score) => {
    let usersRef = this.db.collection("users");
    let docRef = usersRef.doc(uid);
    docRef.get().then((doc) => {
      if(doc.exists && score > doc.data().score) {
        usersRef.doc(uid).update({
          score,
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  getHighScoresFromDB = () => {
    let usersRef = this.db.collection("users");
    return usersRef.orderBy("score", "desc").limit(5)
      .get();

      // return usersRef.orderBy("score", "desc").limit(5)
      // .get().then((querySnapshot) => {
      //   console.log('lol' + querySnapshot.doc());
      //   return querySnapshot.doc();
      // });
  }

  getMyInfoFromDB = (uid) => {
    let usersRef = this.db.collection("users");
    let docRef = usersRef.doc(uid);
    return docRef.get();
  }


  
  doSignOut = () => this.auth.signOut();
}

export default Firebase;