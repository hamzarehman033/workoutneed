const { async } = require("@firebase/util");
const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const UserDb = require("../Model/user.model");
// const config = require("../firebase-config");

const config = firebaseConfig = {
    apiKey: "AIzaSyCNO-NL_zcdVVWcA8RNS9_UmeGYAAs7HMk",
    authDomain: "workoutneed-a5267.firebaseapp.com",
    projectId: "workoutneed-a5267",
    storageBucket: "workoutneed-a5267.appspot.com",
    messagingSenderId: "153392717161",
    appId: "1:153392717161:web:844a585eebb693e4daf1f8",
    measurementId: "G-EPBZJXC852"
  };
firebase.initializeApp(config);

exports.createUser = async ((req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(email && password){
        firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(),email,password).then(
           async user =>{
                console.log("usersignup");
                console.log(user);
                firebaseAuth.sendEmailVerification(user.user);
                randomNum = Math.floor(Math.random() * 100);
                const newUser =  new UserDb({uid: user.user.uid, email: user.user.email, username: user.user.email.split('@')[0] + randomNum});
                const saveUser = await newUser.save();
                if(saveUser){
                    console.log("user created");
                    res.status(200).json({message:"User Created", payload: user});
                }
                else{
                    console.log('User cannot added to daabase')
                    res.status(400).json({message:"User Data not stored", error: err});
                }
            }
        ).catch(
            err =>{
                res.status(400).json({message:"User cannot be created", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invalid request params", payload: null});
    }
})



exports.userLogin = ((req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(email && password){
        firebaseAuth.signInWithEmailAndPassword(firebaseAuth.getAuth(),email,password).then(
            user =>{
                res.status(200).json({message:"User Login", payload: user});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"User cannot Creates", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invalid request params", payload: null});
    }
})

exports.resetPassword = ((req, res)=>{
    const email = req.body.email;
    if(email){
        firebaseAuth.sendPasswordResetEmail(firebaseAuth.getAuth(), email).then(
            user =>{
                res.status(200).json({message:"Password reset link sent", payload: null});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to send reset email", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invalid request params", payload: null});
    }
})


exports.getProfile = ((req, res)=>{
    const uid = req.body.id;
    if(uid){
        UserDb.findOne({uid: uid}).then(
            user => {
                if (user){
                    res.status(200).json({message:"User profile", payload: user});
                }
                else {
                    res.status(400).json({message:"no data found against provided id", payload: null});
                }
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to fetch user profile", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invalid request params", payload: null});
    }
})

exports.updateProfile = ((req, res)=>{
    const data = req.body;
    console.log(data);
    const uid = data.id;
    delete data.id;
    if(data.email || data.uid || data.username){
        delete data.email;
        delete data.uid;
        delete data.username;
    }
    if(uid){
        UserDb.findOneAndUpdate({uid: uid}, data).then(
            user => {
                if (user){
                    res.status(200).json({message:"User profile updated", payload: user});
                }
                else {
                    res.status(400).json({message:"no data found against provided id", payload: null});
                }
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to update user profile", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invalid request params", payload: null});
    }
})


exports.addNote = ((req, res)=>{
    const data = req.body;
    const uid = data.id;
    const note = {
        title: data.title,
        text: data.text
    }
    if(uid && note.title){
        UserDb.findOneAndUpdate({uid: uid}, { $push:{notes : note } }).then(
            user => {
                res.status(200).json({message:"note added", payload: user});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to add note", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invalid request params", payload: null});
    }
})


exports.updateProfileImage = ((req, res)=>{
    const data = req.body;
    console.log(data);
    if(req.file){
        console.log("file");
    }
    res.status(200).send(req.file? "file/"+ data.email: "no file/"+ data.email);
    // const uid = data.id;
    // const note = {
    //     title: data.title,
    //     text: data.text
    // }
    // if(uid && note.title){
    //     UserDb.findOneAndUpdate({uid: uid}, { $push:{notes : note } }).then(
    //         user => {
    //             res.status(200).json({message:"note added", payload: user});
    //         }
    //     ).catch(
    //         err =>{
    //             res.status(400).json({message:"failed to add note", error: err});
    //         }
    //     )
    // }
    // else{
    //     res.status(400).json({message:"Invalid request params", payload: null});
    // }
})
// exports.login = ((req, rsp)=>{
//     if(true){           
//     firebase.signInWithEmailAndPassword(firebase.getAuth(),   email,password).then((user)=>{
//         console.log(user);
// user.getIdToken(true).then((token)=>{
//     console.log(token);
//             }).catch((err)=>{
//                 console.log(err);
//             });
//         }).catch((err)=>{
//             console.log(err);
//         });
//     } else {
//         console.log(rsp);
//     }
// });