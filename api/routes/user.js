const express = require ('express')
const router = express.Router();
const User = require('../models/User')
const mongoose = require('mongoose')

//TokenFor Session
const jwt = require('jsonwebtoken')


// For Hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// New USer
router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        if(err){
            return res.status(500).json({
                error:err
            })
        }
        else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            })
            console.log(user);
            
            user.save().then(data => {
                console.log(data);
                res.status(200).json({
                    message: "User Created",
                    User:data
                })
            }) 
            .catch(err=>{
                res.status(500).json({
                    error: err           
                })
            })
        }
    })
    
})

// Delete
router.delete('/:userId',(req,res,next)=> {
    User.remove({_id:req.params.userId}).exec()
    .then(result=>{
        res.status(200).json({
            message:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error: err           
        })
    })
})

// Login
router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user => {      
        if(user.length<1){
            return res.status(401).json({
                message:'Authantication Failed!'
            })
        }
        else{
            bcrypt.compare(req.body.password,user[0].password,(err,has)=>{
                if(err){
                    return res.status(401).json({
                        message:'Authantication Failed!'
                    })
                }
                if(has){
                    const Customtoken = jwt.sign(
                    {
                        email:user[0].email,
                        _id:user[0]._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn:"1h"
                    }
                    );
                    return res.status(200).json({
                        message:'Successfully Logged In!',
                        token: Customtoken                               
                    })
                }
                return res.status(401).json({
                    message:'Authantication Failed!'                
                }) 
            })
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err           
        })
    })
})
module.exports = router;