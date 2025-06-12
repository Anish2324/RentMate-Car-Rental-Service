import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        console.log("mongoDB connected successfully   :  "+ connect.connection.host);
    }
    catch(error){
        console.log("Error in connecting mongodb : " , error)
    }
}