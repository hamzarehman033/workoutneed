const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path')
const firebaseAuthController = require("./Auth/firebase-auth");
const channelController = require("./Controller/channel.controller");
const storeController = require("./Controller/store.controller");
const orderController = require("./Controller/order.controller");
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



//admin APIs
app.post("/api/store/getcategories", storeController.getAllCategories);
app.post("/api/store/addcategory",  upload.single("image"), storeController.addCategory);
app.post("/api/store/deletecategory", storeController.deleteCategory);
app.post("/api/store/updatecategory", upload.single("image"), storeController.updateCategory);


// General APIs
app.post("/api/auth/signup", firebaseAuthController.createUser);
app.post("/api/auth/signin", firebaseAuthController.userLogin);
app.post("/api/auth/passwordreset", firebaseAuthController.resetPassword);
app.post("/api/auth/profile", firebaseAuthController.getProfile);
app.post("/api/auth/updateprofile", firebaseAuthController.updateProfile);

//creator APIs



//user APIs

app.post("/api/auth/addnote", firebaseAuthController.addNote);
app.post("/api/profile/updateimage", upload.single("image") ,firebaseAuthController.updateProfileImage);

app.post("/api/channel/create", channelController.createChannel);
app.post("/api/channel/get", channelController.getChannel);
app.post("/api/channel/update", channelController.updateChannel);
app.post("/api/channel/delete", channelController.deleteChannel);
app.post("/api/channel/subscribe", channelController.subscribe);
app.post("/api/channel/unsubscribe", channelController.unsubscribe);
app.post("/api/channel/updatelogo", upload.single("image"), channelController.updateLogo);
app.post("/api/channel/createPlaylist", channelController.createPlaylist);
app.post("/api/channel/getPlaylists", channelController.getPlaylists);




app.post("/api/store/createStore", storeController.createStore);
app.post("/api/store/getstoreid", storeController.getStoreId);
app.post("/api/store/getallproducts", storeController.getAllProducts);
app.post("/api/store/getstoreproducts", storeController.getStoreProducts);

app.post("/api/store/addproduct", upload.single("image"), storeController.addProduct);
app.post("/api/store/getproduct", storeController.getProduct);
app.post("/api/store/editproduct", storeController.updateProduct);
app.post("/api/store/deleteproduct", storeController.deleteProduct);

app.post("/api/store/addorder", orderController.addOrder);
app.post("/api/store/updateorder", orderController.updateOrder);
app.post("/api/store/getorder", orderController.getOrder);
app.post("/api/store/getbuyerorder", orderController.getBuyerOrders);
app.post("/api/store/getsellerorder", orderController.getSellerOrders);
app.post("/api/store/orderpaid", orderController.markOrderPaid);

app.get('/*', function(req,res) {
  res.status(200).json({status: true, message:"Workoutneed server running"});
});

app.listen(process.env.PORT || 8080,()=>{
    console.log("The server started");
});