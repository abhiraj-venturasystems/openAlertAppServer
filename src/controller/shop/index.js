import ShopModel from '../../models/shop.js';

import jwtHelper from '../../helpers/jwt.js';
import messageHelper from '../../helpers/messages.js';
import responseHelper from '../../helpers/response.js';
import bcrypt from 'bcrypt';


const getShops = async (req, res, next) => {
	try {	
			let limit = parseInt(req.query.limit);
			let skip = parseInt(req.query.skip);
			let query = req.query.query;
			let criteria = {privilegeId: { $ne: 1 }};
			if(query){
				criteria = {
					...criteria,
					$or: [
						{ shopName: { $regex: query, $options:'i' } },
                        { shopid: { $regex: query, $options:'i' } }
					]
				}
			}
			if (req.query.pagination == 'false') {
				let shoplist = await ShopModel.find({ privilegeId: { $ne: 1 } })
												.select('shopName shopId typeOfCustomer subscriptionStartDate subscriptionEndDate outletGroup gpsTag status')
												.sort({'tokenNumber': 1});
				responseHelper.data(res, shoplist, 200, '');
			}
			else {
				let shoplist = await ShopModel.find(criteria)
                                                    .select('shopName shopId typeOfCustomer subscriptionStartDate subscriptionEndDate outletGroup gpsTag status')
													
												//	.skip(skip)
												//	.limit(limit)
													.sort({'tokenNumber': 1});
				let totalShopsCount = await ShopModel.countDocuments(criteria);
				responseHelper.page(res, shoplist, totalShopsCount, skip, 200);
			}
	}
	catch(err) {
		next(err);
	}
}

const shopReg = async (req, res)=>{ 

    //Here data from registration pages comes as FormData. so to use it, you have to use multer as middleware
    // it handles multipart/form-data. Without it, you can't work with form data in backend.
   
    try{
        
        let shopExistsResult = await ShopModel.findOne({shopId: req.body.shop_id});
        if(shopExistsResult){
            throw Error(messageHelper.SHOP_EXISTS);
        }
        //destructure the request body
        const {
            shop_name,
            shop_id,
            Password,
            shop_email,
            address,
            type_of_customer,
            language_setting,
            subscription_start_date,
            subscription_end_date,
            outlet_group,
            outlet_logo,
            gps_tag,
            token_message

        }=req.body;

        const fieldValues= {
            shopName:shop_name,
            shopId:shop_id,
            Password,
            emailId:shop_email,
            address,
            typeOfCustomer:type_of_customer,
            languageSetting:language_setting,
            subscriptionStartDate:subscription_start_date,
            subscriptionEndDate:subscription_end_date,
            outletGroup:outlet_group,
            outletLogo:outlet_logo,
            gpsTag:gps_tag,
            tokenMessage:token_message

        }

        const saveShopReg=await new ShopModel(fieldValues).save();
        //responseHelper.data(res, saveShopReg, 200, messageHelper.SHOP_ADDED ); 
        responseHelper.success(res, messageHelper.SHOP_ADDED, 200 ); 
    }catch(error){
        responseHelper.failure(res, error);
    }
};

const shopLogin = async (req, res, next)=>{ 
    try{ 
        let shopExistsResult = await ShopModel.findOne({shopId:req.body.Username});
        if(!shopExistsResult){
             responseHelper.failure(res, messageHelper.INVALID_CREDENTIALS);
          }
        
        // //comparing input password with above exists result
        let passCheckResult = await bcrypt.compareSync(req.body.Password, shopExistsResult.password);
        if(!passCheckResult){
            responseHelper.failure(res, messageHelper.INVALID_CREDENTIALS);
        }

        let userActiveResult = await ShopModel.findOne({ shopId:req.body.Username, status:1 }); 
        if(!userActiveResult){
             responseHelper.failure(res, messageHelper.SHOP_NOT_ACTIVE);
          }
        
          //passing the result from schema to the generateToken() function within jwtHelper
          let authToken = jwtHelper.generateToken(shopExistsResult);
          let responseData = {
              token: authToken, 
              loginId:`${shopExistsResult._id}`, 
              shopName:`${shopExistsResult.shopName}`,
              emailId:`${shopExistsResult.emailId}`,
              privilegeId:`${shopExistsResult.privilegeId}`,
              shopLogo: shopExistsResult.outletLogo ? `${shopExistsResult.outletLogo}` : ''
          }
          
          //try to pass response code as an integer (not as a string eg not like '200')
          //bcz there is an integer checking code before storing login response values to localStorage
          responseHelper.data(res, responseData, 200);

    }
    catch(error){
        responseHelper.failure(res, error);
    }


}


const shopEnableDisable = async (req, res, next) => {
    try {
            const { shopId, shopStatus } = req.params;
            if(parseInt(shopStatus) == 0) { 
                let shopStatus = 1;
            }
            else { 
                    let shopStatus = 0;
                 }

            const shopResult = await ShopModel.updateOne({_id: shopId}, { status: shopStatus }, { new: true } );
            responseHelper.data(res, shopResult, 200);
        
    } catch (err) {
        next(err);
    }
}


const shopDetailById = async (req, res, next) => {
    try {
            const { shopId } = req.params;
            const shop = await ShopModel
                                    .findOne({ _id: shopId })
                                    .populate("shopId","shopName");
            if (!shop) {
                throw Error(responseMessage.USER_NOT_EXIST);
            }
            responseHelper.data(res, shop, 200);
    } catch (err) {
        next(err);
    }
}

const logOut = async (req, res)=> {

    try{
        //decrypted user details from token within verifyToken middleware is passed to the request
        //userId within this request checking with database user document
        let userExists = await ShopModel.findOne({ _id:req.user.loginId }); 
        if (!userExists) {
			throw Error(messageHelper.USER_NOT_FOUND);
		}
        //next write the code to remove this user from session on table 
        responseHelper.success(res, messageHelper.LOGOUT_SUCCESS, 200)
    }catch (error){
        responseHelper.failure(res, error)
    }

}

export default{
    getShops,
    shopReg,
    shopLogin,
    shopEnableDisable,
    shopDetailById,
    logOut
}