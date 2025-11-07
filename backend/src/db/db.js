import mongoose from "mongoose"


const connectDB=()=>{
    
mongoose.connect(process.env.MONGO_URI).then((data)=>{
    console.log("database connected") 
}).catch((err)=>{
    console.log(err.message);
    
})
}

export default connectDB;