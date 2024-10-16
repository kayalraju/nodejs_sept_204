const  express = require('express');
const homeController = require('../controller/home.controller');
const ProductController = require('../controller/ProductController');
const uploadProductImage = require('../helper/productImageUpload');
const router = express.Router();

//**********This Router for ejs ui */
router.get('/',homeController.home)
router.get('/addproduct',homeController.addProduct)
router.post('/create/product',homeController.creatre)
router.get('/edit/:id',homeController.edit)
router.post('/update/:id',homeController.update)
router.get('/delete/:id',homeController.delete)

//**************for Crud api */

 router.post('/craete/product',uploadProductImage.single('image'),ProductController.craetreProduct)
 router.get('/product',ProductController.getAllProduct)
 router.get('/product/:id',ProductController.getProductById)
 router.post('/product/update/:id',ProductController.updateProduct)
 router.delete('/product/delete/:id',ProductController.deleteProduct)


module.exports = router;





