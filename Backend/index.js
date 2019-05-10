const express = require('express');
const firebase = require('firebase');
const firebaseConfig = require("./firebaseConfig.json");

firebase.initializeApp(firebaseConfig);

const app = express();


const server = app.listen(process.env.PORT || 3000, () => {
    console.info("Listening on port", server.address().port);
});
