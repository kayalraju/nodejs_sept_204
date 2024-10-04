const  express = require('express');
const homeController = require('../controller/home.controller');
const ProductController = require('../controller/ProductController');
const router = express.Router();

//**********This Router for ejs ui */
router.get('/',homeController.home)
router.get('/addproduct',homeController.addProduct)
router.post('/create/product',homeController.creatre)

//**************for Crud api */

 router.post('/craete/product',ProductController.craetreProduct)
 router.get('/product',ProductController.getAllProduct)
 router.get('/product/:id',ProductController.getProductById)
 router.post('/product/update/:id',ProductController.updateProduct)
 router.delete('/product/delete/:id',ProductController.deleteProduct)


module.exports = router;





