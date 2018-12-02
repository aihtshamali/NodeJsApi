const express = require('express');
const app =express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose =require('mongoose')
const productsRoutes =require('./api/routes/products');
const ordersRoutes =require('./api/routes/orders');
const userRoutes =require('./api/routes/user');

app.use(morgan('dev')) //middleware

// For making Directory Publicaly Accessible
app.use('/uploads',express.static('uploads'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose.connect(
    'mongodb+srv://admin:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop-cew83.mongodb.net/test?retryWrites=true',
    { useNewUrlParser: true }
)

//Handling CORS
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,Authorization,Content-Type,Accept,X-Requested-With");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,PATCH,POST,DELETE,GET');
        return res.status(200).json({});
    }
    next()
});

// Routes
app.use('/product',productsRoutes)
app.use('/order',ordersRoutes)
app.use('/user',userRoutes)


module.exports = app;