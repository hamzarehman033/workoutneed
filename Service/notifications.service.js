const NotificationDb = require("./notification.model");
exports.new = (creator_id, user_id, message)=>{
    
    NotificationDb.create({creator_id:creator_id, user_id: user_id, message: message, time: new Date()})
    .then( notification =>{
        console.log(notification);
    })
    

}

exports.getbyUserid =  (async (req, res)=>{
    const data = req.body;
    if(data.user_id){
        const notifications = await NotificationDb.find({user_id:data.user_id});
        res.status(400).json({message:"notifications", payload: notifications});
    }
    else{
        res.status(400).json({message:"invalid parameters", error: null});
    }

})