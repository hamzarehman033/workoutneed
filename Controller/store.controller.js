const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fireStore = require("firebase/storage");
const ChannelDb = require("../Model/channel.model");
const CategoryDb = require("../Model/category.model");
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

exports.getAllCategories =( async (req, res)=>{
    CategoryDb.find().then( 
        categories =>{
            res.status(200).json({message: "all categories", payload: categories})
        }
    ).catch( err =>{
        res.status(400).json({message:" failed to fetch categories", error: err})
    })
})


exports.addCategory =( async (req, res)=>{
    const data = req.body;
    const file = req.file;
    if(data.title && file){
        const str = fireStore.getStorage(firebase.getApp(), "workoutneed-a5267.appspot.com");
        const ref=  fireStore.ref(str , "store/thumbnail/"+ file.filename);
        filePath = path.join(__dirname, '../storage/'+file.filename);
        fs.readFile(filePath, async function(err, filedata)
            {
                if(filedata)
                {
                    fireStore.uploadBytes(ref, filedata).then( async (snapshot) => {
                        fs.unlinkSync(filePath);
                        const downloadURL = await fireStore.getDownloadURL(ref);
                        const category = new CategoryDb({
                            title: data.title,
                            image_url: downloadURL,
                        });
                        category.save().then(
                            (u)=>{
                                res.status(200).json({message:'Category added', payload: u});
                            }
                        ).catch(
                            err =>{
                                res.status(400).json({message:'Category not added', error: err});
                            }
                        )
                });
                }
            });
        
    }else{
        res.status(400).json({message:'invalid params', error: null});
    }

})



exports.deleteCategory = ((req, res)=>{
    const data = req.body;
    if(data.category_id){
        CategoryDb.findByIdAndDelete(data.category_id).then(
            cate => {
                res.status(200).json({message:"category delete", payload:cate})
            }
        )
        .catch(
            err => res.status(400).json({message:" failed to delete category", error: err})
        )
    }else{
        res.status(400).json({message:'invalid params', error: null});
    }
})



exports.updateCategory = ((req, res)=>{
    const data = req.body;
    const file= req.file;
    console.log();
    if(data.title && file && data.category_id){
        const str = fireStore.getStorage(firebase.getApp(), "workoutneed-a5267.appspot.com");
        const ref=  fireStore.ref(str , "store/thumbnail/"+ file.filename);
        filePath = path.join(__dirname, '../storage/'+file.filename);
        fs.readFile(filePath, async function(err, filedata)
            {
                if(filedata)
                {
                    fireStore.uploadBytes(ref, filedata).then( async (snapshot) => {
                        fs.unlinkSync(filePath);
                        const downloadURL = await fireStore.getDownloadURL(ref);
                       
                        CategoryDb.findByIdAndUpdate(data.category_id, {image_url: downloadURL, title: data.title})
                        .then(
                            (u)=>{
                                res.status(200).json({message:'Category updated', payload: u});
                            }
                        ).catch(
                            err =>{
                                res.status(400).json({message:'Category not added', error: err});
                            }
                        )
                });
                }
            });
        
    }else if(data.title && data.category_id){
        console.log(data);
        CategoryDb.findByIdAndUpdate(data.category_id, {title: data.title})
                        .then(
                            (u)=>{
                                res.status(200).json({message:'Category updated', payload: u});
                            }
                        ).catch(
                            err =>{
                                res.status(400).json({message:'Category not added', error: err});
                            }
                        )
        
    }else{
        res.status(400).json({message:'invalid params', error: null});
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