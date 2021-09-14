const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const firebaseAuthController = require("./Auth/firebase-auth");
const app = express();

// // Initialize Mongoose
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://workoutneed_admin:5VmbAUUgRvX2giBM@clusterworkoutneed.sodjb.mongodb.net/ClusterWorkOutNeed?retryWrites=true&w=majority").then(
    (result) => console.log("Database connected"));



app.post("/api/auth/signup", firebaseAuthController.createUser);
app.post("/api/auth/signin", firebaseAuthController.userLogin);

app.get('/*', function(req,res) {
  res.status(200).json({status: true, message:"Workoutneed server running"});
});

app.listen(process.env.PORT || 8080,()=>{
    console.log("The server started");
});