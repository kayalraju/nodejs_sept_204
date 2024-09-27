const  express = require('express');
const homeController = require('../controller/home.controller');
const ProductController = require('../controller/ProductController');
const router = express.Router();

router.get('/',homeController.home)
router.get('/about',homeController.about)

//**************for Crud api */

 router.post('/craete/product',ProductController.craetreProduct)
 router.get('/product',ProductController.getAllProduct)


module.exports = router;





