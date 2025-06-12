import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

     email : {
        required : true,
        type : String,
        unique : true,
    },
    firstName : {
        required : true,
        type : String,
    },
    lastName :{
        type:String,
    },
    password : {
        type : String,
        required : true,
        length: 6,
    },
    phoneNo :{
        required : true,
        unique:true,
        type: Number,

    },
    isVerified:{
        type:Boolean,
        default:false
    },

verificationCode:String
},
{timestamps:true}
)
const Admin = mongoose.model("admin",adminSchema)
export default Admin;