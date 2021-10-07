const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fireStore = require("firebase/storage");
const UserDb = require("../Model/user.model");
const ChannelDb = require("../Model/channel.model");
const CategoryDb = require("../Model/category.model");
const StoreDb = require("../Model/store.model");
const ProductDb = require("../Model/product.model");
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


exports.createStore =( async (req, res)=>{
    const data = req.body;
    const file = req.file;
    if(data.id && data.title){
        UserDb.findOne({uid:data.id}).then(
            _user =>{
                if(!_user.store_id){
                    const store = new StoreDb({
                        user_id: _user.uid,
                        title: data.title,
                        balance: 0
                    })
                    store.save().then(
                        (_store)=>{
                            _user.store_id = _store._id;
                            _user.save();
                            res.status(200).json({message:"store create", payload: _store})
                        }
                    )
                }else{
                    res.status(400).json({message:"store already exists for this user", error: null})
                }
            }
        )
    }else{
        res.status(400).json({message:'invalid params', error: null});
    }

})


exports.getStoreId =( async (req, res)=>{
    const data = req.body;
    if(data.id){
        UserDb.findOne({uid:data.id}, {store_id:true}).then(
            _user =>{
                if(_user){
                    res.status(200).json({message:"store id", payload: _user})
                }
            }
        )
    }else{
        res.status(400).json({message:'invalid params', error: null});
    }

})

exports.getAllProducts =( async (req, res)=>{
    const data = req.body;
        ProductDb.find().then(
            _products =>{
                if(_products){
                    res.status(200).json({message:"all products", payload: _products})
                }
            }
        )
})

exports.getStoreProducts =( async (req, res)=>{
    const data = req.body;
    if(data.store_id){
        StoreDb.findById(data.store_id).populate('products').then(
            _products =>{
                if(_products){
                    res.status(200).json({message:"all store products", payload: _products})
                }
            }
        )
    }
    else{ res.status(400).json({message:'invalid params', error: null}); }
        
})


exports.addProduct = ((req, res)=>{
    const data = req.body;
    const file= req.file;
    if(data.title && file && data.category_id && data.store_id){
        const str = fireStore.getStorage(firebase.getApp(), "workoutneed-a5267.appspot.com");
        const ref=  fireStore.ref(str , "store/product/"+ file.filename);
        filePath = path.join(__dirname, '../storage/'+file.filename);
        fs.readFile(filePath, async function(err, filedata)
            {
                if(filedata)
                {
                    fireStore.uploadBytes(ref, filedata).then( async (snapshot) => {
                        fs.unlinkSync(filePath);
                        const downloadURL = await fireStore.getDownloadURL(ref);
                        const product = new ProductDb({
                            title: data.title,
                            description : data.description,
                            category_id: data.category_id,
                            image_url: downloadURL,
                            price: data.price,
                            service_charges:data.service_charges,
                            price: data.price,
                            store_id: data.store_id
                        })
                        product.save().then(
                            _product =>{
                                StoreDb.findByIdAndUpdate(data.store_id,{ $push:{products: _product._id}})
                                .then( s=> res.status(200).json({message:'Product Added', payload: _product}) )
                                .catch(e =>  res.status(400).json({message:"failed to add product", error: error}))
                            }
                        ).catch(error => res.status(400).json({message:"failed to add product", error: error}));
                });
                }
            });
        
    }else{
        res.status(400).json({message:'invalid params', error: null});
    }
  
})


exports.getProduct =( async (req, res)=>{
    const data = req.body;
    if(data.product_id){
        console.log("asdfas");
        ProductDb.findById(data.product_id).then(
            _product =>{
                if(_product){
                    res.status(200).json({message:"product updated", payload: _product})
                }
                else{ throw "product not found"}
            }
        )
        .catch( e=> res.status(400).json({message:'no product found against the id', error: null}) )
    }
    else{ res.status(400).json({message:'invalid params', error: null}); }
        
})

exports.updateProduct =( async (req, res)=>{
    const data = req.body;
    if(data.product_id){
        ProductDb.findByIdAndUpdate(data.product_id, {title: data.title, description: data.description, price: data.price} ).then(
            _product =>{
                if(_product){
                    res.status(200).json({message:"product updated", payload: _product})
                }
            }
        )
    }
    else{ res.status(400).json({message:'invalid params', error: null}); }
        
})

exports.deleteProduct =( async (req, res)=>{
    const data = req.body;
    if(data.product_id){
        ProductDb.findByIdAndDelete(data.product_id).then(
            _product =>{
                if(_product){
                    StoreDb.findByIdAndUpdate(_product.store_id, {$pull: { products: _product._id}})
                    res.status(200).json({message:"product deleted", payload: _product})
                }
                else{ throw "product not found" }
            }
        ).catch( () => res.status(400).json({message:'no product found against the id', error: null}) )
    }
    else{ res.status(400).json({message:'invalid params', error: null}); }
        
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