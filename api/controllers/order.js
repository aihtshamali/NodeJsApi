const Order = require('../models/Order')
const Product = require('../models/Product')
const mongoose =require('mongoose')


// Index
exports.index=(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name productImage')
    .exec()
    .then(data => {
        const response = {
            count: data.length,
            orders: data.map(doc => {
                return {
                    quantity: doc.quantity,
                    product: doc.product,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: process.env.Project_Path+"order/"+doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })

}

// Store
exports.store=(req,res,next)=>{
    Product.findById(req.body.productId).exec()
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: "Product Not Found"
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(), 
            product: req.body.productId,
            quantity: req.body.quantity 
          });
       return order.save();    
    })
    .then(data => {
        res.status(201).json({
            message : 'Order Stored',
            createdProduct:{
                product: data.productId,
                quantity: data.quantity,
                _id: data._id,
                request:{
                    type: 'GET',
                    url: process.env.Project_Path+'order/'+data._id
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    
    })
    
}

// Show
exports.show=(req,res,next)=>{
    Order.findById(req.params.orderId).exec()
    .then(data=>{
        res.status(200).json({
            order:data
        });
    }).catch(err =>{
        res.status(500).json({
            error : err
        })
    })

}

//Delete
exports.delete=(req,res,next)=>{
    Order.findByIdAndDelete(req.params.orderId).exec()
    .then(data =>{
        if(!data){
            return res.status(404).json({
                message: "Order Not Found"
            })
        }
        res.status(200).json({
            message : 'Order Deleted',
            orderId: req.params.orderId
        })
    })
    .catch(err=> {
        res.status(500).json({
            error : err
        })
    })
}