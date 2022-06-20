import mongoose from "mongoose";


const tokenShema= new mongoose.Schema({

    shopId: {
        type: mongoose.Schema.ObjectId,
        ref: 'shop-master'
    },
    tokenNumber:  {
        type: String,
        required: true,
        default: '' 
    },
    dateOfReg:  {
        type: Date,
        default: '' 
    },
    tokenStatus:  {
        type: Number,
        required: true,
        default: '' 
    }

    

}, {timestamps: true});



const token = mongoose.model('token-master', tokenShema);
export default token;