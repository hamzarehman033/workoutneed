const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fireStore = require("firebase/storage");
const UserDb = require("../Model/user.model");
const ChannelDb = require("../Model/channel.model");
const CategoryDb = require("../Model/category.model");
const StoreDb = require("../Model/store.model");
const ChatDb = require("../Model/chat.model");
const ProductDb = require("../Model/product.model");


exports.getUserChats =( async (req, res)=>{
    const data = req.body;
    if(data.user_id){
        ChatDb.find({user_id:data.user_id}).then( 
            _chats =>{
                if(_chats){
                    res.status(200).json({message: "user chats", payload: _chats})
                }
                else{
                    res.status(400).json({message:"no chat found", error: err})
                }
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to fetch chats", error: err})
        })
    }else { res.status(400).json({message:"invalid params", error: null}) }
    
})

exports.getCreatorChats =( async (req, res)=>{
    const data = req.body;
    if(data.creator_id){
        ChatDb.find({creator_id:data.creator_id}).then( 
            _chats =>{
                if(_chats){
                    res.status(200).json({message: "creator chats", payload: _chats})
                }
                else{
                    res.status(400).json({message:"no chat found", error: err})
                }
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to fetch chats", error: err})
        })
    }else { res.status(400).json({message:"invalid params", error: null}) }
    
})


exports.startChat =( async (req, res)=>{
    const data = req.body;
    if(data.user_id && data.creator_id){
        const newChat = new ChatDb({
            user_id: data.user_id,
            creator_id: data.creator_id
        })
        newChat.save().then(
            _chat => res.status(200).json({message: "chat started", payload: _chat})
        ).catch( error => res.status(400).json({message:" failed to start chat", error: error}) )
    }else { res.status(400).json({message:"invalid params", error: null}) }
})

exports.newMessage =( async (req, res)=>{
    const data = req.body;
    if(data.chat_id && data.from && data.message){
        chat = await ChatDb.findById(data.chat_id);
        if(chat){
            chat.messages.push({
                from: data.from,
                message: data.message,
                time: new Date()
            })
            chat.save().then( 
                _chat =>{
                    res.status(200).json({message: "message added", payload: _chat})
                }
            ).catch( err =>{
                res.status(400).json({message:"failed to add message", error: err})
            })
        }else { res.status(400).json({message:"not chat found", error: null}) }
    }else { res.status(400).json({message:"invalid params", error: null}) }
})