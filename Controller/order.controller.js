const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fireStore = require("firebase/storage");
const UserDb = require("../Model/user.model");
const ChannelDb = require("../Model/channel.model");
const CategoryDb = require("../Model/category.model");
const StoreDb = require("../Model/store.model");
const ProductDb = require("../Model/product.model");
const OrderDb = require("../Model/order.model");
const fs = require('fs');
const path = require('path');


exports.addOrder =( async (req, res)=>{
    const data = req.body;
    if(data.product_id && data.store_id && data.buyer_id && data.price){
        const order = new OrderDb({
            product_id: data.product_id,
            store_id: data.store_id,
            buyer_id: data.buyer_id,
            price: data.price,
            status: 'uncompleted',
            date: new Date().toLocaleDateString()
        })
        order.save().then( 
            order =>{
                res.status(200).json({message: "order created", payload: order})
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to add order", error: err})
        })
    } else{
        res.status(400).json({message:"invalid parameters", error: null})
    }
    
})


exports.getOrder =( async (req, res)=>{
    const data = req.body;
    if(data.order_id){
        OrderDb.findById(data.order_id).then( 
            order =>{
                res.status(200).json({message: "order details", payload: order})
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to get order", error: err})
        })
    } else{
        res.status(400).json({message:"invalid parameters", error: null})
    }
   
})


exports.getBuyerOrders =( async (req, res)=>{
    const data = req.body;
    if(data.buyer_id){
        OrderDb.find({buyer_id: data.buyer_id}).then( 
            orders =>{
                res.status(200).json({message: "orders list", payload: orders})
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to get orders", error: err})
        })
    } else{
        res.status(400).json({message:"invalid parameters", error: null})
    }
   
})

exports.getSellerOrders =( async (req, res)=>{
    const data = req.body;
    if(data.store_id){
        OrderDb.find({store_id : data.store_id}).then( 
            orders =>{
                res.status(200).json({message: "orders list", payload: orders})
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to get orders", error: err})
        })
    } else{
        res.status(400).json({message:"invalid parameters", error: null})
    }
   
})

exports.updateOrder =( async (req, res)=>{
    const data = req.body;
    if(data.order_id){
        OrderDb.findByIdAndUpdate(data.order_id, {status: data.status}).then( 
            order =>{
                res.status(200).json({message: "order updated", payload: order})
            }
        ).catch( err =>{
            res.status(400).json({message:"failed to update order", error: err})
        })
    } else{
        res.status(400).json({message:"invalid parameters", error: null})
    }
   
})










