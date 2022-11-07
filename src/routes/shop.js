import express from 'express';
import shopController from '../controller/shop/index.js';
import { shopImgUpload } from '../helpers/aws.js';
import { verifyToken } from '../middlewares/userAuth.js';

const router = express.Router();

const singleUpload = shopImgUpload.single("outlet_logo");

//For localy storing uploaded images starts.....

// var storage = multer.diskStorage({
//     //here we can set the image upload folder path 
//     //this path will be within the node project folder (like server/uploads/qrcodes/)
//     destination: function (req, file, cb) {
//      cb(null, 'uploads/qrcodes/')
//     },
//     // By default, multer removes file extensions so let's add them back
//     filename: function (req, file, cb) {
//         //file.originalname will show the original image name
//       //path.extname(file.originalname) will get the extension of the file
//       //here any type of file saved in png format
//       cb(null, req.user.userId + '.png') 
//    } });
//   var upload = multer({ storage: storage });

//router.post('/generate-qrcode', verifyToken(), upload.single('bugAttachmentsUrl'), qrcodeController.generateQrcode);

//For localy storing uploaded images ends.....

router.get("/getShopsList", verifyToken(), shopController.getShops);

//shop registration
router.post("/shopReg", function(req, res, next){
    singleUpload(req, res, function(err){
       next(err);
    });
}, shopController.shopReg);

//shop registration
router.post("/shopLogin", shopController.shopLogin);

router.delete("/shopEnableDisable/:shopId/:shopStatus", verifyToken(), shopController.shopEnableDisable);

router.get("/:shopId/detail", verifyToken(), shopController.shopDetailById);

router.post("/logout", verifyToken(), shopController.logOut);

export default router;