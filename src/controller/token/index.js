import TokenModel from '../../models/token.js';
import ShopModel from '../../models/shop.js';

import jwtHelper from '../../helpers/jwt.js';
import messageHelper from '../../helpers/messages.js';
import responseHelper from '../../helpers/response.js';
import bcrypt from 'bcrypt';


const getTokens = async (req, res, next) => {
	const { Id }  = req.params;
	try {	
			let limit = parseInt(req.query.limit);
			let skip = parseInt(req.query.skip);
			let query = req.query.query;
			//ie, for Admin, show the tokens of all Shops
			//from mobile side only show the tokens for particular shopId
			
			//let criteria = {tokenStatus: { $ne: 1 }};
			let criteria = {};
			if(Id>0){ criteria = { shopId:Id }; }
			
			if(query){
				criteria = {
					...criteria,
					$or: [
						{ tokenNumber: { $regex: query, $options:'i' } }
					]
				}
			}
			if (req.query.pagination == 'false') {
				let tokenlist = await TokenModel.find({tokenStatus: { $ne: 1 }})
												.select('tokenNumber tokenStatus updatedAt')
												.sort({'tokenNumber': 1});
				responseHelper.data(res, tokenlist, 200, '');
			}
			else {
				let tokenlist = await TokenModel.find(criteria)
                                                    .select('tokenNumber tokenStatus updatedAt')
													.populate({
														path: 'shopId',
														select: 'shopName shopId'
													})
												//	.skip(skip)
												//	.limit(limit)
													.sort({'tokenNumber': 1});
				let totalTokensCount = await TokenModel.countDocuments(criteria);
				responseHelper.page(res, tokenlist, totalTokensCount, skip, 200);
			}
	}
	catch(err) {
		next(err);
	}
}



const tokenReg = async (req, res)=>{ 

    //Here data from registration pages comes as FormData. so to use it, you have to use multer as middleware
    // it handles multipart/form-data. Without it, you can't work with form data in backend.
   
    try{
        //let getActualShopMasterId  = await ShopModel.findOne({ shopId: req.body.shop_id });
        

        let shopExistsResult  = await ShopModel.findOne({ shopId: req.body.shop_id });
        if(!shopExistsResult){
            throw Error(messageHelper.SHOP_NOT_VALID);
        }
        
        let tokenExistsResult = await TokenModel.findOne({shopId: shopExistsResult._id, tokenNumber:req.body.token_number});
        if(tokenExistsResult){
            throw Error(messageHelper.TOKEN_EXISTS);
        }
        //destructure the request body
        const {
            token_number

        }=req.body;

        const fieldValues= {
            shopId:shopExistsResult._id,
            tokenNumber:token_number

        }

        const saveTokenReg=await new TokenModel(fieldValues).save();
        responseHelper.success(res, messageHelper.TOKEN_ADDED, 200 ); 
    }catch(error){
        responseHelper.failure(res, error);
    }
};



export default{
    getTokens,
    tokenReg
}