// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// const firebaseConfig = require("./firebase-config");
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const express = require('express');
const path = require('path');
const app = express();
// // Initialize Mongoose
mongoose.connect("mongodb+srv://workoutneed_admin:5VmbAUUgRvX2giBM@clusterworkoutneed.sodjb.mongodb.net/ClusterWorkOutNeed?retryWrites=true&w=majority").then(
    (result) => console.log("Database connected"));


//Install express server

app.get('/*', function(req,res) {
  res.status(200).json({status: true, message:"Workoutneed server running"});
});

// Start the app by listening on the default port
app.listen(process.env.PORT || 8080,()=>{
    console.log("The server started");
});