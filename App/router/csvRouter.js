const express = require('express');
const router = express.Router();
const bodyparser=require('body-parser');
const csvController = require('../controller/csvController');


router.use(bodyparser.urlencoded({extended:true}));
router.use(bodyparser.json());
const multer = require('multer');
const path=require('path');

router.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../../public/csvupload'), function(err,success){
            if(err) throw err;
    
          })
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)   
    }
  })    

  const upload=multer({storage:storage});

router.post('/create/csvuser',upload.single('file'),csvController.create)
router.get('/all/csvuser',csvController.alldata)




module.exports = router;