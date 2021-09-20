const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path')
const firebaseAuthController = require("./Auth/firebase-auth");
const app = express();



// var gcloud = require('gcloud');

// // Initialize Mongoose
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://workoutneed_admin:5VmbAUUgRvX2giBM@clusterworkoutneed.sodjb.mongodb.net/ClusterWorkOutNeed?retryWrites=true&w=majority").then(
    (result) => console.log("Database connected"));

// multer
app.use(express.static('storage'))
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const namesplit = file.originalname.split(".");
    const extension = namesplit[namesplit.length -1];
    cb(null, file.fieldname + '-' + uniqueSuffix + "." + extension);
  }
})
const upload = multer({ storage: storage })


app.post("/api/auth/signup", firebaseAuthController.createUser);
app.post("/api/auth/signin", firebaseAuthController.userLogin);
app.post("/api/auth/passwordreset", firebaseAuthController.resetPassword);
app.post("/api/auth/profile", firebaseAuthController.getProfile);
app.post("/api/auth/updateprofile", firebaseAuthController.updateProfile);
app.post("/api/auth/addnote", firebaseAuthController.addNote);
app.post("/api/profile/updateimage", upload.single("image") ,firebaseAuthController.updateProfileImage);

app.get('/*', function(req,res) {
  res.status(200).json({status: true, message:"Workoutneed server running"});
});

app.listen(process.env.PORT || 8080,()=>{
    console.log("The server started");
});