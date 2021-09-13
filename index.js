// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// const firebaseConfig = require("./firebase-config");
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const mongoose = require("mongoose");
const express = require('express');
const app = express();
// Initialize Mongoose
mongoose.connect("mongodb+srv://workoutneed_admin:5VmbAUUgRvX2giBM@clusterworkoutneed.sodjb.mongodb.net/ClusterWorkOutNeed?retryWrites=true&w=majority").then(
    (result) => console.log("Database connected"));


app.get('/', (req, res) => {
  res.status(200).json({status:true, message:"Server Running"});
})
const port = 8080;
app.listen(port, () => {
  console.log(`Workoutneed app listening at http://localhost:${port}`)
})


