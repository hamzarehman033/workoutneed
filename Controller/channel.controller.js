const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fireStore = require("firebase/storage");
const ChannelDb = require("../Model/channel.model");
const UserDb = require("../Model/user.model");
const PlaylistDb = require("../Model/playlist.model");
const VideoDb = require("../Model/video.model");
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
                            res.status(200).json({message:"Channel Created", payload: userData});
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
        UserDb.findOne({uid:data.id}).populate('channel_id').exec().then(
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


exports.createPlaylist =( async (req, res)=>{
    const data = req.body;
    if(data.title && data.channel_id){
            const Playlist = new PlaylistDb({
                title: data.title,
                channel_id: data.channel_id,
                audience:data.audience,
                category:data.category 
            })
            Playlist.save().then(
                _playlist =>{
                    res.status(200).json({message:"playlist Created", payload: _playlist});
                }
            )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
})
exports.getPlaylists =( async (req, res)=>{
    const data = req.body;
    if(data.channel_id){
            PlaylistDb.find({channel_id: data.channel_id})
            .then(
                _playlists =>{
                    res.status(200).json({message:"playlists", payload: _playlists});
                }
            )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
})


exports.uploadVideo =( async (req, res)=>{
    const data = req.body;
    const file = req.file;
    if( file && data.channel_id && data.title){
        const str = fireStore.getStorage(firebase.getApp(), "workoutneed-a5267.appspot.com");
        const ref=  fireStore.ref(str , "videos/"+ file.filename);
        filePath = path.join(__dirname, '../storage/'+file.filename);
        const channel = await ChannelDb.findById(data.channel_id);
        if(channel){
            const video = new VideoDb({
                channel_id: data.channel_id,
                title: data.title,
                playlist_id: data.playlist_id,
                description: data.description,
                tags: data.tags
            })
            fs.unlinkSync(filePath);
            video.save().then(
                video =>{
                    ChannelDb.findByIdAndUpdate(data.channel_id , {$push: {videos:video._id }}).then(
                        userData=>{
                            res.status(200).json({message:"video added Created", payload: userData});
                        }
                    ).catch(
                        err => {
                            res.status(400).json({message:"Failed to upload video", error: err});
                        }
                    )
                }
            )
        }
        else{
            res.status(400).json({message:"no channel found against the ID", error: null});
        }
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
    
})
exports.getVideo=( async (req, res)=>{
    const data = req.body;
    if(data.video_id){
        const video = VideoDb.findById(data.video_id).then(
            _video=>{
                if(_video){
                    res.status(200).json({message:"video detials", payload: _video});
                }
                else{
                    res.status(400).json({message:"no video found against the ID", error: null});
                }
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
    
})

exports.likeVideo =( async (req, res)=>{
    console.log("sdfasd");
    const data = req.body;
    console.log(req.body);
    if(data.video_id){
        console.log(data);
        const video = VideoDb.findByIdAndUpdate(data.video_id, {$push:{ likes: 1}}).then(
            _video=>{
                if(_video){
                    res.status(200).json({message:"video liked", payload: video});
                }
                else{
                    res.status(400).json({message:"no video found against the ID", error: null});
                }
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
    
})

exports.addComment =( async (req, res)=>{
    const data = req.body;
    if(data.video_id, data.user_id, data.comment ){
        const video = VideoDb.findByIdAndUpdate(data.video_id, {$push:{ comments: 1}}).then(
            _video=>{
                if(_video){
                    res.status(200).json({message:"comment added", payload: _video});
                }
                else{
                    res.status(400).json({message:"no video found against the ID", error: null});
                }
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }
    
})

exports.linkProduct =( async (req, res)=>{
    const data = req.body;
    if(data.video_id, data.product_id){
        VideoDb.findByIdAndUpdate(data.video_id, {product_id: data.product_id}).then(
            _video=>{
                if(_video){
                    res.status(200).json({message:"product linked", payload: _video});
                }
                else{
                    res.status(400).json({message:"no video found against the ID", error: null});
                }
            }
        )
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
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