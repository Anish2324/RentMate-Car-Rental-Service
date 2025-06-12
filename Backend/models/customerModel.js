import mongoose from "mongoose";

const customerSchema= new mongoose.Schema({
    fullname :{
        required : true,
        type : String,

    },
    
     email : {
        required : true,
        type : String,
        unique : true,
    },
    phoneNo :{
        required : true,
        unique:true,
        type: Number,

    },
    DOB : {
        type: Date,
        required: true,

    },
     password : {
        type : String,
        required : true,
        length: 6,
    },

    age:{
        type:Number,

    },
    licenseNo :{
        required:true,
        unique:true,
        type:String,

    },
     isVerified:{
        type:Boolean,
        default:false
    },

verificationCode:String
},


{timestamps:true})

const Cust = mongoose.model("customer",customerSchema)
export default Cust;