const Product = require('../models/Product')
const mongoose = require('mongoose')


exports.index=(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(data=>{
        const response = {
            count: data.length,
            products: data.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage:doc.productImage,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/product/'+doc._id
                    }
                }
            })
        }
        if(data.length>0)
            res.status(200).json(response           
            )
        else
        {
            res.status(404).json({
                message: 'No entries Found'           
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error: err           
        })
    })
    
}

// Store
exports.store= (req,res,next)=>{
    console.log(req.file);
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(data => {
        // console.log(data)
        res.status(201).json({
            message: "Created Product Successfully",
            createdProduct:{
                name: data.name,
                price: data.price,
                productImage:data.productImage,
                _id: data._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/product/'+data._id
                }
            }
        })
    }).catch(err => {
        res.status(500).json({
            error: err           
        })
    });

}

// Show
exports.show=(req,res,next)=>{
    const productId=req.params.productId; 
    Product.findById(productId).exec().then(data=>{
        res.status(200).json({
            product: data
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({
            message: 'No valid Entry Found'
        })        
    })
   
}

// Update
exports.update =(req,res,next)=>{
    const productId=req.params.productId; 
    const updateOps= {}
    for(const ops of req.body)
        updateOps[ops.propName]= ops.value;

    Product.update({_id:productId},{$set:updateOps}).exec()
    .then(data=>{
        console.log(data);
        res.status(200).json({
            message: 'Upated Product',
            product: data
        })
    })
    .catch(error=>{
        res.status(500).json({
            error: error
        })
    })
    
    // OR
    // Product.update({_id:productId},{$set:{name:req.params.name}})
    
} 

// Delete
exports.delete = (req,res,next)=>{
    const productId=req.params.productId; 
    Product.remove({_id:productId}).exec()
    .then(data=>{
        if(data.n>0)
        {
            res.status(200).json({
                message: data
            })
        }
        else{
            res.status(500).json({
                error: "No Product Found"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error: err,
        })
    })    
}