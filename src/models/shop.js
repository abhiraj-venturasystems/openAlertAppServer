import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const shopShema= new mongoose.Schema({
    shopName:  {
        type: String,
        required: true,
    },
    shopId:  {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,

    },
    address:  {
        type: String,
        required: true,
        default: '' 
    },
    typeOfCustomer:  {
        type: String,
        required: true,
        default: '' 
    },
    languageSetting:  {
        type: String,
        required: true,
        default: '' 
    },
    subscriptionStartDate:  {
        type: Date,
        default: '' 
    },
    subscriptionEndDate:  {
        type: Date,
        default: '' 
    },
    outletGroup:  {
        type: String,
        default: ''
    },
    outletLogo:  {
        type: String,
        default: ''
    },
    gpsTag:  {
        type: String,
        default: ''
    },
    tokenMessage:  {
        type: String,
        default: ''
    }
    

}, {timestamps: true});

//hashing the password ( getting as user input)
//this hashing will happends only password is passed to model before the action(save)
//eg: before saving the data, password is hashed here
shopShema.virtual('pwd').set(function(pwd){
    this.password = bcrypt.hashSync(pwd,10)
});

const shop = mongoose.model('shop-master', shopShema);
export default shop;