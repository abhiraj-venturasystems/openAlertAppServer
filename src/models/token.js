import mongoose from "mongoose";


const tokenShema= new mongoose.Schema({

    shopId: {
        type: mongoose.Schema.ObjectId,
        ref: 'shopmaster'
    },
    tokenNumber:  {
        type: String,
        required: true,
        default: '' 
    },
    tokenStatus:  {
        type: Number,
        required: true,
        default: 1 
    }

    

}, {timestamps: true});



const token = mongoose.model('tokenmaster', tokenShema);
export default token;