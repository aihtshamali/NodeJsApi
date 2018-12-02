const express = require ('express')
const router = express.Router();

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename: function(req,file,callback){
        callback(null,Date.now()+'-'+file.originalname);
        // callback(null,file.filename) // Encoded
    }
})
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true)
    }
    else{
        cb(new Error("Only JPEG & PNG allowed"),false)        
    }
}
const upload = multer({storage:storage,
    limits:{
    fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
})


const checkAuth = require('../middleware/auth-check');

const ProductController = require('../controllers/product')


// Index
router.get('/',ProductController.index)

// Store
router.post('/',checkAuth,upload.single('productImage'),ProductController.store)

// show
router.get('/:productId',ProductController.show) 

// Update
router.patch('/:productId',checkAuth,ProductController.update) 

// Delete
router.delete('/:productId',checkAuth,ProductController.delete) 

module.exports = router;