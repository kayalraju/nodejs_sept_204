const express = require('express');
const userController = require('../controller/userController');
const {authCheck} = require('../middleware/auth');
const webController = require('../controller/webController');
const jwtWebAuth = require('../middleware/webAuth');
const router = express.Router();

//******for api */
router.post('/register',userController.register );
router.post('/login',userController.login );
router.get('/user/dashboard',authCheck,userController.dashboard );
router.post('/forgetPsssword',userController.forgetPsssword );
router.post('/updates',authCheck,userController.UpdatePasswordddd );

/******for web */
router.get('/register',webController.register);
router.post('/register/create',webController.registerCreatre);
router.get('/login',webController.login);
router.post('/login/create',webController.loginCreatre);

router.get('/dashboard',jwtWebAuth,webController.AuthUser,webController.dashboard); 
router.get('/logout',webController.logout);


module.exports = router;