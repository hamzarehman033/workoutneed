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
                const newUser =  new UserDb({uid: user.user.uid, email: user.user.email});
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
                res.status(400).json({message:"User Login", payload: user});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"User cannot Creates", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"Invlid Credentials", payload: null});
    }
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