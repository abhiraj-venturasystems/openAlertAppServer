import shopModel from '../../models/shop.js';
import messageHelper from '../../helpers/messages.js';


const shopReg = async (req, res)=>{

    try{
        let shopExistsResult = await shopModel.findOne({shopId: req.body.shop_id});
        if(shopExistsResult){
            throw Error(messageHelper.SHOP_EXISTS);
        }

        //destructure the request body
        const {
            shop_name,
            shop_id,
            pwd,
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
            pwd,
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

        const saveShopReg=await new shopModel(fieldValues).save();
        res.send('Success');
    }catch(error){
        throw Error('Failure');
    }
};

const shopLogin = async (req, res, next)=>{
    try{
        let shopExistsResult = await shopModel.findOne({shopId: req.body.shop_id});
        if(!shopExistsResult){
            throw Error(messageHelper.INVALID_CREDENTIALS);
        }
        res.send('Success');
    }
    catch(error){
        throw Error('Failure');
    }
}

export default{
    shopReg,
    shopLogin
}