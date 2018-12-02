const express = require ('express')
const router = express.Router();
const UserController = require('../controllers/user')

// New User
router.post('/signup',UserController.signup)

// Delete
router.delete('/:userId',UserController.delete)

// Login
router.post('/login',UserController.login)

module.exports = router;