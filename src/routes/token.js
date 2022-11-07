import express from 'express';
import tokenController from '../controller/token/index.js';
import { verifyToken } from '../middlewares/userAuth.js';

const router = express.Router();

router.get("/getTokensList/:shopId", verifyToken(), tokenController.getTokens);

//token registration
router.post("/tokenReg", tokenController.tokenReg);



export default router;