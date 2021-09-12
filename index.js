// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const mongoose = require("mongoose");
// const firebaseConfig = require("./firebase-config");


// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// Initialize Mongoose
mongoose.connect("mongodb+srv://workoutneed_admin:5VmbAUUgRvX2giBM@clusterworkoutneed.sodjb.mongodb.net/ClusterWorkOutNeed?retryWrites=true&w=majority").then(
    result => {
        console.log("Database connected");
    }
)
