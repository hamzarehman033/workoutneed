const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fireStore = require("firebase/storage");
const ChannelDb = require("../Model/channel.model");
const UserDb = require("../Model/user.model");
const fs = require('fs');
const path = require('path');

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


exports.createChannel =( async (req, res)=>{
    const data = req.body;
    if( data.id && data.title){
        const user = await UserDb.findOne({uid:data.id});
        if(!user.channel_id){
            const channel = new ChannelDb({
                user_uid: data.id,
                title: data.title,
                description: data.description
            })
            channel.save().then(
                channelData =>{
                    UserDb.findOneAndUpdate({ uid: data.id}, { channel_id: channelData._id}).then(
                        userData=>{
                            res.status(200).json({message:"Channel Created", payload: channelData});
                        }
                    ).catch(
                        err => {
                            res.status(400).json({message:"Failed to create channel", error: err});
                        }
                    )
                }
            )
        }
        else{
            res.status(400).json({message:"channel already existed", error: null});
        }
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
    


})

exports.getChannel =( async (req, res)=>{
    const data = req.body;
    if(data.id){
        UserDb.findOne({uid:data.id}, {uid: true}).populate('channel_id').exec().then(
            userData =>{
                res.status(200).json({message:"channel details", payload: userData});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to fetch details", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
})


exports.updateChannel = ((req, res)=>{
    const data = req.body;
    if(data.channel_id && data.title){
        ChannelDb.findByIdAndUpdate(data.channel_id, { title: data.title, description: data.description})
        .then(
            channelData =>{
                res.status(200).json({message:"channel details updated", payload: channelData});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to update channel details", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }

})


exports.deleteChannel = ((req, res)=>{
    const data = req.body;
    if(data.channel_id){
        ChannelDb.findByIdAndDelete(data.channel_id)
        .then(
             async (channelData) =>{
                 if(channelData){
                    const userr =  await UserDb.findOne({uid: data.user_id});
                    userr.channel_id = null;
                    userr.save();
                    res.status(200).json({message:"channel deleted successfully", payload: channelData});
                 }
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to delete channel", error: err});
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
})

exports.subscribe = ((req, res)=>{
    const data = req.body;
    if(data.channel_id && data.user_id){
        ChannelDb.findByIdAndUpdate(data.channel_id, { $push: {subscribers : data.user_id}})
        .then( 
            channel =>{
                res.status(200).json({message:"channel subscribed", payload: channel});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to subscribed", error: null});
            }
        )
    }else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
   
})


exports.unsubscribe = ((req, res)=>{
    const data = req.body;
    if(data.channel_id && data.user_id){
        ChannelDb.findByIdAndUpdate(data.channel_id, { $pull: {subscribers : data.user_id}})
        .then( 
            channel =>{
                res.status(200).json({message:"channel unsubscribed", payload: channel});
            }
        ).catch(
            err =>{
                res.status(400).json({message:"failed to unsubscribed", error: null});
            }
        )
    }else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
})

exports.updateLogo = ((req, res)=>{
    const data = req.body;
    const file = req.file;
    if(file){
        const str = fireStore.getStorage(firebase.getApp(), "workoutneed-a5267.appspot.com");
        const ref=  fireStore.ref(str , "thumbnail/"+ file.filename);
        filePath = path.join(__dirname, '../storage/'+file.filename);
        fs.readFile(filePath, async function(err, filedata)
            {
                if(filedata)
                {
                    fireStore.uploadBytes(ref, filedata).then( async (snapshot) => {
                        fs.unlinkSync(filePath);
                        const downloadURL = await fireStore.getDownloadURL(ref);
                        ChannelDb.findByIdAndUpdate(data.channel_id, { logo: downloadURL.toString() }).then(
                            (u)=>{
                                res.status(200).json({message:'Image uploaded successfully', payload: u});
                            }
                        )
                });
                }
            });
        
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