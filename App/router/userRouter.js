const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/register',userController.register );
router.post('/login',userController.login );
router.get('/user/dashboard',userController.dashboard );





module.exports = router;