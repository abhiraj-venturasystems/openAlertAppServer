import express from 'express';
import shopController from '../controller/shop/index.js';

const router = express.Router();

//shop registration
router.post("/shopReg",shopController.shopReg);

//shop registration
router.post("/shopLogin", shopController.shopLogin);

export default router;