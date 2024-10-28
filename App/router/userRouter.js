const express = require('express');
const userController = require('../controller/userController');
const {authCheck} = require('../middleware/auth');
const router = express.Router();

router.post('/register',userController.register );
router.post('/login',userController.login );
router.get('/user/dashboard',authCheck,userController.dashboard );





module.exports = router;