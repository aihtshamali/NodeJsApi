const express = require ('express')
const router = express.Router()
const OrderController = require('../controllers/order')

const AuthCheck = require('../middleware/auth-check');

// Index
router.get('/',OrderController.index)

// Store
router.post('/',AuthCheck,OrderController.store)

// Show
router.get('/:orderId',AuthCheck,OrderController.show)

// Delete
router.delete('/:orderId',AuthCheck,OrderController.delete)

module.exports = router;