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
    emailId:  {
        type: String,
        required: true,
    },
    privilegeId: {
        type: Number,
        default: 2,

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
    },
    status: {
        type: Number,
        default: 0,

    }
    

}, {timestamps: true});

//hashing the password ( getting as user input)
//this hashing will happends only password is passed to model before the action(save)
//eg: before saving the data, password is hashed here
shopShema.virtual('Password').set(function(Password){
    this.password = bcrypt.hashSync(Password,10)
});

const shop = mongoose.model('shopmaster', shopShema);
export default shop;